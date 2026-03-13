import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as path from 'path';

/**
 * CDK Stack for Motia Strands Agent
 * - S3 Bucket for frontend static files
 * - App Runner service for backend (Docker image from local directory)
 * - CloudFront distribution with OAC for S3 and custom origin for App Runner
 * - IAM Roles for App Runner to access ECR and Bedrock
 */
export class CdkStack extends cdk.Stack {
  /**
   * コンストラクター
   * @param scope
   * @param id
   * @param props
   */
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ========================================
    // 1. S3 Bucket - フロントエンド静的ファイル
    // ========================================
    const siteBucket = new s3.Bucket(this, 'FrontendBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // ========================================
    // 2. Docker Image Asset - Motia バックエンド
    // ========================================
    const imageAsset = new ecr_assets.DockerImageAsset(this, 'MotiaBackendImage', {
      directory: path.join(__dirname, '../../my-project'),
      platform: ecr_assets.Platform.LINUX_AMD64,
    });

    // ========================================
    // 3. IAM Roles for App Runner
    // ========================================

    // ECR アクセスロール
    const accessRole = new iam.Role(this, 'AppRunnerAccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
    });
    imageAsset.repository.grantPull(accessRole);

    // インスタンスロール (Bedrock アクセス用)
    const instanceRole = new iam.Role(this, 'AppRunnerInstanceRole', {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    });
    instanceRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream',
      ],
      resources: ['*'],
    }));

    // ========================================
    // 4. App Runner Service (L1 - CfnService)
    // ========================================
    const appRunnerService = new apprunner.CfnService(this, 'MotiaBackendService', {
      serviceName: 'motia-backend',
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: accessRole.roleArn,
        },
        imageRepository: {
          imageIdentifier: imageAsset.imageUri,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '3111',
            runtimeEnvironmentVariables: [
              { name: 'AWS_REGION', value: 'us-east-1' },
            ],
          },
        },
        autoDeploymentsEnabled: false,
      },
      instanceConfiguration: {
        cpu: '1 vCPU',
        memory: '2 GB',
        instanceRoleArn: instanceRole.roleArn,
      },
      autoScalingConfigurationArn: undefined, // デフォルト (min:1, max:25)
    });

    // App Runner の AutoScaling (min:1, max:1)
    const autoScalingConfig = new apprunner.CfnAutoScalingConfiguration(this, 'AppRunnerAutoScaling', {
      autoScalingConfigurationName: 'motia-single-instance',
      maxConcurrency: 100,
      maxSize: 1,
      minSize: 1,
    });
    appRunnerService.autoScalingConfigurationArn = autoScalingConfig.attrAutoScalingConfigurationArn;

    // App Runner サービスURL
    const appRunnerServiceUrl = appRunnerService.attrServiceUrl;

    // ========================================
    // 5. CloudFront Distribution
    // ========================================

    // OAC for S3
    const oac = new cloudfront.S3OriginAccessControl(this, 'OAC', {
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    // S3 Origin
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket, {
      originAccessControl: oac,
    });

    // App Runner Origin
    const appRunnerOrigin = new origins.HttpOrigin(appRunnerServiceUrl, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        '/tickets*': {
          origin: appRunnerOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        },
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
      ],
    });

    // ========================================
    // 6. S3 Deployment - フロントエンドをアップロード
    // ========================================
    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../frontend/dist'))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // ========================================
    // Outputs
    // ========================================
    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'AppRunnerServiceUrl', {
      value: `https://${appRunnerServiceUrl}`,
      description: 'App Runner Service URL',
    });

    // タグ
    cdk.Tags.of(this).add('Project', 'motia-strands-agent');
  }
}

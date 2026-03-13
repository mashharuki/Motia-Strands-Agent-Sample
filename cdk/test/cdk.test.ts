import * as cdk from 'aws-cdk-lib/core';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

function createTemplate(): Template {
  const app = new cdk.App();
  const stack = new CdkStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'ap-northeast-1' },
  });
  return Template.fromStack(stack);
}

describe('CdkStack', () => {
  let template: Template;

  beforeAll(() => {
    template = createTemplate();
  });

  // ========================================
  // S3 Bucket
  // ========================================
  describe('S3 Bucket', () => {
    test('フロントエンド用S3バケットが作成される', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });
    });

    test('S3バケットがDESTROYポリシーで設定される', () => {
      template.hasResource('AWS::S3::Bucket', {
        UpdateReplacePolicy: 'Delete',
        DeletionPolicy: 'Delete',
      });
    });
  });

  // ========================================
  // IAM Roles
  // ========================================
  describe('IAM Roles', () => {
    test('App Runner ECRアクセスロールが作成される', () => {
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Principal: { Service: 'build.apprunner.amazonaws.com' },
              Action: 'sts:AssumeRole',
            }),
          ]),
        }),
      });
    });

    test('App Runnerインスタンスロールが作成される', () => {
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Principal: { Service: 'tasks.apprunner.amazonaws.com' },
              Action: 'sts:AssumeRole',
            }),
          ]),
        }),
      });
    });

    test('Bedrock InvokeModel権限がインスタンスロールに付与される', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: Match.objectLike({
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: [
                'bedrock:InvokeModel',
                'bedrock:InvokeModelWithResponseStream',
              ],
              Effect: 'Allow',
              Resource: 'arn:aws:bedrock:ap-northeast-1::foundation-model/*',
            }),
          ]),
        }),
      });
    });
  });

  // ========================================
  // App Runner
  // ========================================
  describe('App Runner', () => {
    test('App Runnerサービスが作成される', () => {
      template.hasResourceProperties('AWS::AppRunner::Service', {
        ServiceName: 'motia-backend',
        SourceConfiguration: Match.objectLike({
          ImageRepository: Match.objectLike({
            ImageRepositoryType: 'ECR',
            ImageConfiguration: { Port: '3111' },
          }),
          AutoDeploymentsEnabled: false,
        }),
        InstanceConfiguration: Match.objectLike({
          Cpu: '0.25 vCPU',
          Memory: '0.5 GB',
        }),
      });
    });

    test('AutoScaling設定がmin:1 max:1で作成される', () => {
      template.hasResourceProperties('AWS::AppRunner::AutoScalingConfiguration', {
        AutoScalingConfigurationName: 'motia-single-instance',
        MaxSize: 1,
        MinSize: 1,
      });
    });
  });

  // ========================================
  // CloudFront
  // ========================================
  describe('CloudFront', () => {
    test('CloudFront Distributionが作成される', () => {
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: Match.objectLike({
          DefaultRootObject: 'index.html',
        }),
      });
    });

    test('SPA用の403/404エラーレスポンスが設定される', () => {
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: Match.objectLike({
          CustomErrorResponses: Match.arrayWith([
            Match.objectLike({
              ErrorCode: 403,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
            }),
            Match.objectLike({
              ErrorCode: 404,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
            }),
          ]),
        }),
      });
    });

    test('/tickets* パスがキャッシュ無効で設定される', () => {
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: Match.objectLike({
          CacheBehaviors: Match.arrayWith([
            Match.objectLike({
              PathPattern: '/tickets*',
              AllowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
            }),
          ]),
        }),
      });
    });

    test('OACが作成される', () => {
      template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
        OriginAccessControlConfig: Match.objectLike({
          SigningProtocol: 'sigv4',
        }),
      });
    });
  });

  // ========================================
  // Outputs
  // ========================================
  describe('Outputs', () => {
    test('CloudFront URLが出力される', () => {
      template.hasOutput('CloudFrontUrl', {
        Description: 'CloudFront Distribution URL',
      });
    });

    test('App Runner URLが出力される', () => {
      template.hasOutput('AppRunnerServiceUrl', {
        Description: 'App Runner Service URL',
      });
    });
  });

  // ========================================
  // リソース数の確認
  // ========================================
  describe('Resource counts', () => {
    test('S3バケットが1つ作成される', () => {
      template.resourceCountIs('AWS::S3::Bucket', 1);
    });

    test('CloudFront Distributionが1つ作成される', () => {
      template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    });

    test('App Runnerサービスが1つ作成される', () => {
      template.resourceCountIs('AWS::AppRunner::Service', 1);
    });
  });
});

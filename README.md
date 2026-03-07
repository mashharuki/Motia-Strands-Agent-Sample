# Motia-Strands-Agent-Sample

バックエンドフレームワーク Motia と AWS Strands Agentを掛け合わせてみたサンプルリポジトリ

## テンプレプロジェクト生成

```bash
motia-cli create my-project
```

以下のようになればOK!

```bash

  ╭───────────────────────────────────────╮
  │  == Welcome to Motia powered by iii   │
  ╰───────────────────────────────────────╯

░███     ░███               ░██    ░██                ░████████████
░████   ░████               ░██                      ░██         ░██
░██░██ ░██░██  ░███████  ░████████ ░██ ░██████      ░██  ░██████  ░██    ░██░██░██
░██ ░████ ░██ ░██    ░██    ░██    ░██      ░██     ░██       ░██ ░██
░██  ░██  ░██ ░██    ░██    ░██    ░██ ░███████     ░██  ░███████ ░██    ░██░██░██
░██       ░██ ░██    ░██    ░██    ░██░██   ░██     ░██ ░██   ░██ ░██    ░██░██░██
░██       ░██  ░███████      ░████ ░██ ░█████░██    ░██  ░█████░████     ░██░██░██
                                                     ░██
                                                      ░████████████

  - Create a new Motia project powered by iii
  Select language: Mixed (Node.js + Python, requires both)
  Do you have iii installed? yes

  Creating project in ./my-project

```

Node.js + Pythonのミックス構成となっている

```bash
.
├── iii-config.yaml
├── nodejs
│   ├── package.json
│   ├── src
│   │   ├── create-ticket.step.ts
│   │   └── list-tickets.step.ts
│   └── tsconfig.json
└── python
    ├── pyproject.toml
    └── steps
        ├── __init__.py
        ├── escalate_ticket_step.py
        ├── notify_customer_step.py
        ├── sla_monitor_step.py
        └── triage_ticket_step.py

5 directories, 11 files
```

テンプレートプロジェクトで実装されているもの

- チケットの取得する機能
- チケットの作成する機能
- チケットのトリアージ(cron処理、HTTP APIメソッド両方対応)する機能
- Escalate Ticket
- ユーザーに通知する機能
- SLAをモニタにングする機能

このリポジトリではさらに、Strands Agent SDKを利用したAIアシスタントStepを追加しています。

- `POST /tickets/ai-assistant` でチケット情報を参照しながら回答を生成
- Tool Callingで `get_ticket` / `list_open_tickets` を呼び出し可能

> In the mixed template, Node.js handles the HTTP API endpoints (create-ticket, list-tickets) in nodejs/src/, while Python handles queue and cron triggers (triage, notify, sla-monitor, escalate) in python/steps/. Both run as subprocesses connected to the same iii infrastructure.

## Motiaとは

JavaScript Rasing Star2 2025のバックエンド部門にてNext.jsやHonoを抑えて一位となったフレームワーク！

エンドポイントをステップという単位で分けて実装することができる。  
最大の特徴はTypeScriptやPythonといった異なるプログラミング言語を組み合わせてバックエンドが開発できる点！

- ステップの中身の構造
  - name: ステップ名
  - description: 処理の説明
  - flows: どのフローに属している処理なのかを配列で指定
  - triggers: どのタイミングで呼び出される処理なのかを指定

Motiaのエージェントはイベント駆動で動作します。各Stepは特定の イベント（トピック） が発生するのを待ち受け、イベントを受け取ると自身の処理を実行します。

そして、処理結果に応じて新たなイベントを発行したり、外部APIへのレスポンスを返したりします。

Flowは、これらのイベントを介してStep同士を連携させ、全体として目的の機能を実現するように設計されます。

AI領域だとPythonにはSDKがあるのにTypeScriptsにはない....

ということがおきがちだが、このMotiaを使えばイベント駆動でロジックを分割し**部分的にPythonで実装**したりする柔軟な設計が可能。

サンプルコードも豊富でAI Agentももちろん実装可能。

今大注目のバックエンドフレームワーク！

## iiiのインストール

```bash
curl -fsSL https://install.iii.dev/iii/main/install.sh | sh
```

## 起動方法

```bash
cd my-project
iii -c iii-config.yaml
```

## AI Assistant API

`/tickets/ai-assistant` は Strands Agent SDK (`@strands-agents/sdk`) を使って、
運用中チケットを参照しながら回答するHTTP Stepです。

リクエスト例:

```bash
curl -X POST http://127.0.0.1:3111/tickets/ai-assistant \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": "優先対応すべきチケットを教えて",
    "ticketId": "TKT-EXAMPLE-001"
  }'
```

注意:

- デフォルトのStrandsモデルプロバイダ(例: Bedrock)を使うため、実行環境に認証設定が必要です。
- 認証が未設定の場合、APIは500でヒント付きエラーを返します。

レスポンス例

```json
{
  "answer": "チケット TKT-1772723527561-e4a8w の状況を確認しました。\n\n## 現状分析:\n- **重大度**: Critical（最重要）\n- **状態**: エスカレーション済み（engineering-leadへ自動エスカレ）\n- **問題**: 決済エラー（PMT-402）\n- **SLA違反**: 2039分（約34時間）未解決\n\n## 推奨する次アクション3つ:\n\n### 1. **Engineering-leadへの即時フォローアップ**\n   - エスカレーション後の進捗を確認\n   - PMT-402エラーの根本原因分析状況を確認\n   - 暫定対応策の有無を問い合わせ\n\n### 2. **顧客への状況アップデート**\n   - customer@example.com へ現在の調査状況を報告\n   - 代替決済手段の提案（可能であれば）\n   - 次回更新のタイムラインを明示（例: 4時間以内）\n\n### 3. **決済システムの緊急チェック**\n   - PMT-402エラーの発生頻度を確認（他顧客への影響範囲）\n   - 決済ゲートウェイのステータス確認\n   - 必要に応じてインシデント対応チームへ連携\n\n**優先順位**: 1→2→3の順で実施を推奨します。",
  "modelProvider": "strands-default-bedrock",
  "openTicketCount": 2,
  "referencedTicketId": "TKT-1772723527561-e4a8w"
}
```

```json
{
  "answer": "現在オープンしている優先度の高いチケットは2件あります：\n\n## **1. TKT-1772723527561-e4a8w [Critical - 最優先]**\n- **件名**: Payment failed on checkout\n- **問題**: 決済時にエラーコード PMT-402 で失敗\n- **顧客**: customer@example.com\n- **担当**: support-jp-team\n- **状況**: \n  - SLA違反により自動エスカレーション（2041分未解決）\n  - engineering-lead へエスカレーション済み\n  - 作成日: 2026-03-05\n\n## **2. TKT-1772723533374-3d6b7 [High]**\n- **件名**: test\n- **問題**: （詳細は\"desc\"のみ）\n- **顧客**: a@example.com\n- **担当**: senior-support\n- **状況**:\n  - SLA違反により自動エスカレーション（2041分未解決）\n  - engineering-lead へエスカレーション済み\n  - 作成日: 2026-03-05\n\n### **推奨アクション**:\n1. **Critical チケット**を最優先で対応 - 決済機能の障害は事業影響が大きい\n2. 両チケットとも既にエンジニアリングリードへエスカレーション済みなので、進捗確認が必要\n3. 長期未解決のため、顧客への状況アップデートを実施\n\nどちらかのチケットについて詳細を確認しますか？",
  "modelProvider": "strands-default-bedrock",
  "openTicketCount": 2,
  "referencedTicketId": null
}
```

## 参考文献

- [Motia 公式サイト](https://www.motia.dev/)
- [Motia クイックスタート](https://www.motia.dev/docs/getting-started/quick-start)
- [JavaScript Rasing Stars 2025](https://risingstars.js.org/2025/en#section-nodejs-framework)
- [GitHub Motia](https://github.com/MotiaDev/motia)
- [【GitHub人気急騰】Motia徹底解説：AIエージェント開発 実務活用ガイド](https://qiita.com/syukan3/items/9740ebdafde32599b7a2)
- [GitHub TypeScript SDK](https://github.com/strands-agents/sdk-typescript)
- [Strands Agent](https://strandsagents.com/latest/)

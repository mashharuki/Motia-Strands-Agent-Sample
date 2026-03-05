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

## 参考文献

- [Motia 公式サイト](https://www.motia.dev/)
- [Motia クイックスタート](https://www.motia.dev/docs/getting-started/quick-start)
- [JavaScript Rasing Stars 2025](https://risingstars.js.org/2025/en#section-nodejs-framework)
- [GitHub Motia](https://github.com/MotiaDev/motia)
- [【GitHub人気急騰】Motia徹底解説：AIエージェント開発 実務活用ガイド](https://qiita.com/syukan3/items/9740ebdafde32599b7a2)
- [GitHub TypeScript SDK](https://github.com/strands-agents/sdk-typescript)
- [Strands Agent](https://strandsagents.com/latest/)

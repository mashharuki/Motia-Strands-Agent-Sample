FROM node:20-slim

# Python + uv インストール
RUN apt-get update && apt-get install -y python3 python3-venv curl && rm -rf /var/lib/apt/lists/*
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# iii CLI インストール
RUN curl -fsSL https://install.iii.dev/iii/main/install.sh | sh
ENV PATH="/root/.iii/bin:/root/.local/bin:${PATH}"

WORKDIR /app

# Node.js 依存関係
COPY nodejs/package*.json nodejs/
RUN cd nodejs && npm install

# Python 依存関係
COPY python/pyproject.toml python/
RUN cd python && /root/.local/bin/uv venv && /root/.local/bin/uv pip install -r pyproject.toml

# ソースコード & 設定
COPY nodejs/ nodejs/
COPY python/ python/
COPY iii-config.yaml .

# データディレクトリ
RUN mkdir -p data

EXPOSE 3111 3112

CMD ["iii", "-c", "iii-config.yaml"]

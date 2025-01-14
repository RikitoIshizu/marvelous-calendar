FROM node:18-alpine

WORKDIR /app

# package.json と yarn.lock をコピー
COPY package.json yarn.lock ./

# 依存関係のインストール
RUN yarn install

# アプリケーションのソースコードをすべてコピー
COPY . .

# 開発モードで起動
CMD ["yarn", "dev"]

EXPOSE 3000

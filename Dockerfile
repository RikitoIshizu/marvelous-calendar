FROM node:20-alpine

WORKDIR /app

# package.json と yarn.lock をコピーして依存関係をインストール
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# アプリケーションのソースコードをすべてコピー
COPY . .
RUN yarn build

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# ビルド成果物のみをコピー
COPY --from=builder /app/build ./build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 開発モードで起動
CMD ["yarn", "start"]


FROM node:20-alpine AS builder

WORKDIR /app
RUN rm -rf .next node_modules .next
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 開発用（または実行用）ステージ
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app

# 非root ユーザー、ヘルスチェックなどの設定
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["yarn", "dev"]

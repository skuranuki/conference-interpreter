# Golangの公式Alpineベースイメージを使用
FROM golang:1.24-alpine

WORKDIR /app

# 必要なファイルをコピー
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# アプリケーションをビルド
RUN go build -o /app/main .

# Vosk APIをセットアップ
RUN apk add --no-cache ffmpeg

# Expose the application port
EXPOSE 3001

CMD ["/app/main"]

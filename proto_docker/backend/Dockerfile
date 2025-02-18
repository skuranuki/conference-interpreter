FROM golang:1.24-alpine

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

# 出力ファイルを明示的に /app/main に指定
RUN go build -o /app/main .

EXPOSE 3001

CMD ["/app/main"]
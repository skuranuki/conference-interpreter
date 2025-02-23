package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors" // CORSミドルウェアをインポート

	"project-root/backend/handlers"

	"github.com/joho/godotenv"
)

func main() {
	// .envファイルの読み込み
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// 環境変数の確認（デバッグ用）
	apiKey := os.Getenv("SPEECH_TO_TEXT_API_KEY")
	if apiKey == "" {
		log.Fatal("SPEECH_TO_TEXT_API_KEY is not set")
	}
	log.Println("API Key Loaded Successfully!")

	app := fiber.New()

	// CORS を有効化
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", // フロントエンドのURLを許可
		AllowMethods: "GET,POST,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// ルートエンドポイント
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, Fiber!")
	})

	app.Options("/transcribe", func(c *fiber.Ctx) error {
		return c.SendStatus(200) // ✅ OPTIONS リクエストに 200 を返す
	})

	// 音声テキスト変換のエンドポイント
	app.Post("/transcribe", handlers.Transcribe)

	// サーバー起動
	log.Fatal(app.Listen(":3001"))
}

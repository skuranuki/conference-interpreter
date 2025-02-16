package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors" // CORSミドルウェアをインポート

	"project-root/backend/handlers"
)

func main() {
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

package main
//サーバー起動のためのmain関数
import (
	"log"

	"github.com/gofiber/fiber/v2"
	"project-root/backend/handlers"
)

func main() {
	app := fiber.New()

	// ルートエンドポイント
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, Fiber!")
	})

	// 音声テキスト変換のエンドポイント
	app.Post("/transcribe", handlers.Transcribe)

	// サーバー起動
	// 仮でポート3001で起動
	log.Fatal(app.Listen(":3001"))
}
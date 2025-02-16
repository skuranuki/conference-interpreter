package handlers
//whisper APIを呼び出して音声をテキストに変換
import (
	"fmt"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/go-resty/resty/v2"
)

// Whisper API を呼び出して音声をテキストに変換
func Transcribe(c *fiber.Ctx) error {
	// アップロードされたファイルを取得
	file, err := c.FormFile("audio")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("ファイルを取得できませんでした")
	}

	// 一時ファイルとして保存
	filePath := fmt.Sprintf("./uploads/%s", file.Filename)
	err = c.SaveFile(file, filePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("ファイルの保存に失敗しました")
	}

	// Whisper API に送信
	client := resty.New()
	resp, err := client.R().
		SetFile("file", filePath).
		SetHeader("Authorization", "Bearer "+os.Getenv("WHISPER_API_KEY")).
		Post("https://api.openai.com/v1/audio/transcriptions")

	if err != nil {
		return c.Status(http.StatusInternalServerError).SendString("Whisper API の呼び出しに失敗しました")
	}

	// 結果を返す
	return c.SendString(resp.String())
}
// handlers/transcribe.go

package handlers

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/sashabaranov/go-openai"
)

func Transcribe(c *fiber.Ctx) error {
	targetLang := c.Query("lang", "en")
	file, err := c.FormFile("audio")
	if err != nil {
		return c.Status(400).SendString("音声ファイルの取得に失敗しました")
	}

	tempFile, err := os.CreateTemp("", "audio-*.wav")
	if err != nil {
		log.Println("一時ファイル作成エラー:", err)
		return c.Status(500).SendString("一時ファイルの作成に失敗しました")
	}
	defer os.Remove(tempFile.Name())

	fileData, err := file.Open()
	if err != nil {
		return c.Status(500).SendString("ファイルのオープンに失敗しました")
	}
	defer fileData.Close()

	data, err := ioutil.ReadAll(fileData)
	if err != nil {
		return c.Status(500).SendString("ファイルの読み込みに失敗しました")
	}

	_, err = tempFile.Write(data)
	if err != nil {
		return c.Status(500).SendString("ファイルの保存に失敗しました")
	}

	token := os.Getenv("SPEECH_TO_TEXT_API_KEY")
	if token == "" {
		return c.Status(500).SendString("APIキーが設定されていません")
	}
	client := openai.NewClient(token)

	ctx := context.Background()
	req := openai.AudioRequest{
		Model:    openai.Whisper1,
		FilePath: tempFile.Name(),
	}
	res, err := client.CreateTranscription(ctx, req)
	if err != nil {
		return c.Status(500).SendString("音声テキスト変換に失敗しました")
	}

	transcribedText := res.Text
	fmt.Println("Transcribed Text:", transcribedText)

	translatedText, err := TranslateText(client, ctx, transcribedText, targetLang)
	if err != nil {
		return c.Status(500).SendString("翻訳に失敗しました")
	}
	fmt.Println("Translated Text:", translatedText)

	return c.JSON(fiber.Map{
		"transcribed_text": transcribedText,
		"translated_text":  translatedText,
	})
}

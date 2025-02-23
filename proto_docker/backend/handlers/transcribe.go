package handlers

import (
	"io/ioutil"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"

	"context"
	"fmt"

	"github.com/sashabaranov/go-openai"
)

func Transcribe(c *fiber.Ctx) error {
	// ファイルを取得
	file, err := c.FormFile("audio")
	if err != nil {
		return c.Status(400).SendString("音声ファイルの取得に失敗しました")
	}

	// 一時ファイルとして保存
	tempFile, err := os.CreateTemp("", "audio-*.wav")
	if err != nil {
		log.Println("一時ファイル作成エラー:", err)
		return c.Status(500).SendString("一時ファイルの作成に失敗しました")
	}
	//defer os.Remove(tempFile.Name())

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

	// ファイル名を取得
	fileName := tempFile.Name()
	fmt.Println("アップロードされたファイル名:", fileName)

	ctx := context.Background()

	token := os.Getenv("SPEECH_TO_TEXT_API_KEY")
	if token == "" {
		log.Println("APIキーが設定されていません")
		return c.Status(500).SendString("APIキーが設定されていません")
	}
	client := openai.NewClient(token)

	req := openai.AudioRequest{
		Model:    openai.Whisper1,
		FilePath: fileName, // ファイルを指定
	}
	res, err := client.CreateTranscription(ctx, req)
	if err != nil {
		log.Fatalf("Error: %s", err.Error())
	}
	fmt.Printf("text: %s", res.Text)

	// ここで音声をテキストに変換する処理（仮）
	transcribedText := res.Text

	return c.JSON(fiber.Map{"text": transcribedText})
}

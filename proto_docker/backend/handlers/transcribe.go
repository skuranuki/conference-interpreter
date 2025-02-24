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

// Transcribe は音声ファイルをテキストに変換し、英語とスペイン語に翻訳する
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
	defer os.Remove(tempFile.Name()) // 処理終了後に削除

	fileData, err := file.Open()
	if err != nil {
		return c.Status(500).SendString("ファイルのオープンに失敗しました")
	}
	defer fileData.Close()

	data, err := ioutil.ReadAll(fileData)
	if err != nil {
		return c.Status(500).SendString("ファイルの読み込みに失敗しました")
	}

	if _, err = tempFile.Write(data); err != nil {
		return c.Status(500).SendString("ファイルの保存に失敗しました")
	}

	fmt.Println("アップロードされたファイル名:", tempFile.Name())

	ctx := context.Background()

	token := os.Getenv("SPEECH_TO_TEXT_API_KEY")
	if token == "" {
		log.Println("APIキーが設定されていません")
		return c.Status(500).SendString("APIキーが設定されていません")
	}
	client := openai.NewClient(token)

	req := openai.AudioRequest{
		Model:    openai.Whisper1,
		FilePath: tempFile.Name(),
	}
	res, err := client.CreateTranscription(ctx, req)
	if err != nil {
		log.Println("文字起こしエラー:", err)
		return c.Status(500).SendString("文字起こし処理中にエラーが発生しました")
	}

	transcribedText := res.Text
	fmt.Printf("Transcribed text: %s\n", transcribedText)

	// 🔹 翻訳処理（英語 & スペイン語）
	englishTranslation, err := TranslateText(client, ctx, transcribedText, "English")
	if err != nil {
		log.Println("英語翻訳エラー:", err)
		return c.Status(500).SendString("英語への翻訳中にエラーが発生しました")
	}

	spanishTranslation, err := TranslateText(client, ctx, transcribedText, "Spanish")
	if err != nil {
		log.Println("スペイン語翻訳エラー:", err)
		return c.Status(500).SendString("スペイン語への翻訳中にエラーが発生しました")
	}

	summaryTranslation, err := SummarizeText(client, ctx, transcribedText)
	if err != nil {
		log.Println("スペイン語翻訳エラー:", err)
		return c.Status(500).SendString("スペイン語への翻訳中にエラーが発生しました")
	}

	fmt.Printf("要約文: %q\n", summaryTranslation)

	// 🔹 JSON レスポンスとして返す
	return c.JSON(fiber.Map{
		"text":           transcribedText,
		"translation_en": englishTranslation,
		"translation_es": spanishTranslation,
		"sum":            summaryTranslation,
	})
}

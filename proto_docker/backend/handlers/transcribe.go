package handlers

import (
	"io/ioutil"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
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

	// ここで音声をテキストに変換する処理（仮）
	transcribedText := "音声認識結果（fu）"

	return c.JSON(fiber.Map{"text": transcribedText})
}

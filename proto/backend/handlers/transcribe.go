package handlers

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

// 音声データをJSONに変換するための構造体
type AudioData struct {
	Filename string `json:"filename"`
	Size     int64  `json:"size"`
	Type     string `json:"type"`
	Text     string `json:"text"`
}

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
	// ファイルが削除されるのはTranscribeの処理がすべて完了した時
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

	// 音声認識処理（）
	transcribedText := "音声認識結果（）"

	// AudioData 構造体を作成
	audioData := AudioData{
		Filename: file.Filename,
		Size:     file.Size,
		Type:     file.Header.Get("Content-Type"),
		Text:     transcribedText,
	}

	// JSON に変換
	response, err := json.Marshal(audioData)
	if err != nil {
		return c.Status(500).SendString("JSON 変換に失敗しました")
	}

	// JSON を返す
	return c.Send(response)
}

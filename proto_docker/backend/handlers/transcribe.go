package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
)

var voskAPIURL = os.Getenv("VOSK_API_URL") // Voskサーバーのエンドポイント

func Transcribe(c *fiber.Ctx) error {
	// アップロードされた音声ファイルを取得
	file, err := c.FormFile("audio")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "音声ファイルの取得に失敗しました"})
	}

	// 一時ファイルを作成
	tempFile, err := os.CreateTemp("", "audio-*.wav")
	if err != nil {
		log.Println("一時ファイル作成エラー:", err)
		return c.Status(500).JSON(fiber.Map{"error": "一時ファイルの作成に失敗しました"})
	}
	defer os.Remove(tempFile.Name()) // 関数終了時に削除

	fileData, err := file.Open()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "ファイルのオープンに失敗しました"})
	}
	defer fileData.Close()

	// ファイルを読み込んで一時ファイルに書き込む
	data, err := io.ReadAll(fileData)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "ファイルの読み込みに失敗しました"})
	}
	if _, err := tempFile.Write(data); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "ファイルの保存に失敗しました"})
	}

	// Vosk APIに送信して音声をテキストに変換
	transcribedText, err := sendToVosk(tempFile.Name())
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "音声認識に失敗しました"})
	}

	// 変換結果をJSONで返す
	return c.JSON(fiber.Map{"text": transcribedText})
}

// ✅ Vosk API にリクエストを送信してテキストを取得する関数
func sendToVosk(audioFilePath string) (string, error) {
	file, err := os.Open(audioFilePath)
	if err != nil {
		log.Println("音声ファイルのオープンエラー:", err)
		return "", err
	}
	defer file.Close()

	// マルチパートフォームデータを作成
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	part, err := writer.CreateFormFile("audio", audioFilePath)
	if err != nil {
		return "", err
	}
	if _, err = io.Copy(part, file); err != nil {
		return "", err
	}
	writer.Close()

	// Vosk API にリクエストを送信
	resp, err := http.Post(voskAPIURL, writer.FormDataContentType(), &buf)
	if err != nil {
		log.Println("Vosk APIリクエストエラー:", err)
		return "", err
	}
	defer resp.Body.Close()

	// 応答を読み取る
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	// JSONパース
	var responseMap map[string]interface{}
	if err := json.Unmarshal(body, &responseMap); err != nil {
		return "", err
	}

	// 結果のテキストを取得
	text, ok := responseMap["text"].(string)
	if !ok {
		return "", err
	}

	return text, nil
}

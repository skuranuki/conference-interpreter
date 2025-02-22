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

	// Voskのモデルを初期化
	modelPath := "path/to/your/vosk/model" // 実際のパスを指定してください
	model, err := vosk.NewModel(modelPath)
	if err != nil {
		log.Println("モデルの読み込みに失敗しました:", err)
		return c.Status(500).SendString("音声認識モデルの読み込みに失敗しました")
	}
	// Voskの認識器を作成
	recognizer, err := vosk.NewRecognizer(model, 16000.0)
	if err != nil {
		log.Println("認識器の作成に失敗しました:", err)
		return c.Status(500).SendString("音声認識器の作成に失敗しました")
	}
	// 後で手動で `recognizer` と `model` のクリーンアップは不要

	// 音声認識処理
	transcribedText := transcribeWithVosk(tempFile.Name(), recognizer)

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

// 音声ファイルをテキストに変換する関数
func transcribeWithVosk(filePath string, recognizer *vosk.Recognizer) string {
	// 音声ファイルを読み取る
	file, err := os.Open(filePath)
	if err != nil {
		log.Println("音声ファイルを開く際のエラー:", err)
		return "音声認識に失敗しました"
	}
	defer file.Close()

	// 認識結果を格納する変数
	var resultText string
	buffer := make([]byte, 4000)
	for {
		// 音声データを読み取る
		n, err := file.Read(buffer)
		if err != nil {
			break
		}

		// 認識した音声を処理
		if recognizer.AcceptWaveform(buffer[:n]) {
			resultText += recognizer.Result() + "\n"
		}
	}

	// 音声認識の最終結果を取得
	finalResult := recognizer.FinalResult()
	resultText += finalResult

	return resultText
}

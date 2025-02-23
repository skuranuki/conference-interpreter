package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

// 環境変数をロードする関数（アプリ起動時に実行）
func init() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Warning: No .env file found or failed to load")
	}
}

// DeepL API を使ってテキストを翻訳する関数
func translateText_tora(text, sourceLang, targetLang string) (string, error) {
	apiURL := "https://api-free.deepl.com/v2/translate"

	// 環境変数から DeepL API キーを取得
	apiKey := os.Getenv("DEEPL_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("DeepL APIキーが設定されていません")
	}

	params := url.Values{}
	params.Set("auth_key", apiKey)
	params.Set("source_lang", sourceLang)
	params.Set("target_lang", targetLang)
	params.Set("text", text)

	res, err := http.Get(apiURL + "?" + params.Encode())
	if err != nil {
		return "", fmt.Errorf("failed to send translation request: %v", err)
	}
	defer res.Body.Close()

	var result struct {
		Translations []struct {
			Text string `json:"text"`
		} `json:"translations"`
	}

	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to parse translation response: %v", err)
	}
	if len(result.Translations) == 0 {
		return "", fmt.Errorf("no translations found")
	}

	return result.Translations[0].Text, nil
}

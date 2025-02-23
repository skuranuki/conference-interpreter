package handlers

import (
	"context"
	"log"

	"github.com/sashabaranov/go-openai"
)

// SummarizeText は与えられたテキストを要約します。
func SummarizeText(client *openai.Client, ctx context.Context, text string) (string, error) {
	// 要約のためのプロンプトを作成
	prompt := "Please summarize the following text in the form of meeting minutes in japanese: " + text

	// OpenAI GPT-4 を使って要約リクエストを送信
	summarizeResp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: openai.GPT4,
		Messages: []openai.ChatCompletionMessage{
			{Role: "user", Content: prompt},
		},
	})
	if err != nil {
		log.Println("要約エラー:", err) // エラーログを出力
		return "", err             // エラーを返す
	}

	// 要約されたテキストを返す
	return summarizeResp.Choices[0].Message.Content, nil
}

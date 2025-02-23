// handlers/translate.go

package handlers

import (
	"context"
	"log"

	"github.com/sashabaranov/go-openai"
)

// TranslateText は与えられたテキストを指定した言語に翻訳します。
func TranslateText(client *openai.Client, ctx context.Context, text, targetLang string) (string, error) {
	prompt := "Translate the following text into " + targetLang + ": " + text

	translateResp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: openai.GPT4,
		Messages: []openai.ChatCompletionMessage{
			{Role: "user", Content: prompt},
		},
	})
	if err != nil {
		log.Println("翻訳エラー:", err)
		return "", err
	}

	return translateResp.Choices[0].Message.Content, nil
}

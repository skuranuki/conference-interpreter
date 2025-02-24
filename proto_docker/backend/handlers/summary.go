package handlers

import (
	"context"
	"log"

	"github.com/sashabaranov/go-openai"
)

// SummarizeText は与えられたテキストを要約します。
func SummarizeText(client *openai.Client, ctx context.Context, text string) (string, error) {
	// 要約のためのプロンプトを作成
	prompt := "
	あなたは、会議レポート作成が得意なビジネスマンです。
以下の文字起こしテキストから、会議のレポートを生成してください。

# 目的
* 会議に参加出来なかった人が効率的に内容を把握できる状態にする。

# 期待する挙動
* 主要な議題をピックアップする。
* 各議題について以下の情報を整理する。

  * 提起者  
  * カテゴリー（進捗共有・相談・提案・雑談）  
  * タイムスタンプ  
  * 議題に対する具体的な議論内容  
  * 結論  
  * ネクストアクション  

# 出力フォーマット
以下のフォーマットで Markdown 形式で出力してください。  
**各セクションの間に必ず1行以上の改行を入れてください。**  

for 議題 in 議題リスト:

## {議題タイトル}

提起者： {提起者}  

カテゴリー： {カテゴリー}  

議論内容  
{具体的な議論内容}  

結論  
{結論}  

ネクストアクション 
{ネクストアクション}  

---

以下のテキストから要約してください：
	" + text

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

// "use client";

// import { useState } from "react";
// import Recorder from "@/components/Recorder"; // 修正ポイント

// export default function Home() {
//   const [transcribedText, setTranscribedText] = useState("");

//   return (
//     <div>
//       <h1>音声認識アプリ</h1>
//       <Recorder onTranscribe={setTranscribedText} />
//       <p>結果: {transcribedText}</p>
//     </div>
//   );
// }
// //onTranscribeとして渡されたsetTranscribedText関数が呼ばれ、
// // transcribedText(言語化された文字列)が更新

"use client";

import { useState } from "react";
import Recorder from "@/components/Recorder";

export default function Home() {
  const [transcribedText, setTranscribedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [minutesText, setMinutesText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState(false);

  // 翻訳を実行する関数
  const handleTranslate = async (targetLang: string) => {
    setIsTranslating(true);
    try {
      // ここにAPI通信の処理を追加
      console.log(`Translating to ${targetLang}`);
      // 仮の実装として元のテキストをそのまま使用
      setTranslatedText(transcribedText);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 議事録を生成する関数
  const handleGenerateMinutes = async (style: string) => {
    setIsGeneratingMinutes(true);
    try {
      // ここにAPI通信の処理を追加
      console.log(`Generating minutes in ${style} style`);
      // 仮の実装として元のテキストをそのまま使用
      setMinutesText(transcribedText);
    } catch (error) {
      console.error('Minutes generation failed:', error);
    } finally {
      setIsGeneratingMinutes(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8">
      {/* ヘッダー部分 */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          音声文字起こしアプリ
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          話しかけるだけで、自動的に文字に変換します
        </p>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 録音セクション */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">録音</h2>
          <Recorder 
            onTranscribe={setTranscribedText}
            onTranscribing={setIsTranscribing}
          />
        </div>

        {/* 文字起こし結果セクション */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">文字起こし結果</h2>
          <div className="relative min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {isTranscribing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">文字起こし中...</p>
                </div>
              </div>
            )}
            {transcribedText ? (
              <p className="whitespace-pre-wrap">{transcribedText}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                録音を開始すると、ここに文字起こし結果が表示されます
              </p>
            )}
          </div>
        </div>

        {/* 翻訳結果セクション */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">翻訳結果</h2>
            <div className="flex gap-2">
              <select 
                className="px-3 py-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                defaultValue="en"
              >
                <option value="en">英語</option>
                <option value="zh">中国語</option>
                <option value="ko">韓国語</option>
              </select>
              <button
                onClick={() => handleTranslate('en')}
                disabled={!transcribedText || isTranslating}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                翻訳
              </button>
            </div>
          </div>
          <div className="relative min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">翻訳中...</p>
                </div>
              </div>
            )}
            {translatedText ? (
              <p className="whitespace-pre-wrap">{translatedText}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                翻訳ボタンを押すと、ここに翻訳結果が表示されます
              </p>
            )}
          </div>
        </div>

        {/* 議事録セクション */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">議事録</h2>
            <div className="flex gap-2">
              <select 
                className="px-3 py-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                defaultValue="formal"
              >
                <option value="formal">フォーマル</option>
                <option value="casual">カジュアル</option>
                <option value="bullet">箇条書き</option>
              </select>
              <button
                onClick={() => handleGenerateMinutes('formal')}
                disabled={!transcribedText || isGeneratingMinutes}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                生成
              </button>
            </div>
          </div>
          <div className="relative min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {isGeneratingMinutes && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">議事録を生成中...</p>
                </div>
              </div>
            )}
            {minutesText ? (
              <p className="whitespace-pre-wrap">{minutesText}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                生成ボタンを押すと、ここに議事録が表示されます
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
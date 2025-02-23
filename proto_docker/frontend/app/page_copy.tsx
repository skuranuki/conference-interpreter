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

// ----------------------------------------------------------------------
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

  const handleGenerateMinutes = async () => {
    setIsGeneratingMinutes(true);
    try {
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
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            音声文字起こし
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            録音ボタンを押して話しかけてください
          </p>
        </div>

        {/* 録音セクション */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                録音
              </h2>
              <Recorder
                onTranscribe={setTranscribedText}
                onTranscribing={setIsTranscribing}
              />
            </div>
          </div>
        </div>

        {/* 文字起こし結果 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            文字起こし結果
          </h2>
          <div className="relative min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {isTranscribing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-lg">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}
            {transcribedText ? (
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {transcribedText}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                録音を開始すると、ここに文字起こし結果が表示されます
              </p>
            )}
          </div>
        </div>

        {/* 翻訳セクション */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              翻訳
            </h2>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                defaultValue="en"
              >
                <option value="en">英語</option>
                <option value="zh">中国語</option>
                <option value="ko">韓国語</option>
              </select>
              <button
                onClick={() => handleTranslate('en')}
                disabled={!transcribedText || isTranslating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                翻訳
              </button>
            </div>
          </div>
          <div className="relative min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-lg">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}
            {translatedText ? (
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {translatedText}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                翻訳ボタンを押すと、ここに翻訳結果が表示されます
              </p>
            )}
          </div>
        </div>

        {/* 議事録セクション */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            議事録生成
          </h2>
          <button
            onClick={handleGenerateMinutes}
            disabled={!transcribedText || isGeneratingMinutes}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            生成
          </button>
        </div>
        <div className="relative min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {isGeneratingMinutes && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-lg">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
          {minutesText ? (
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {minutesText}
            </p>
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
import { Card } from "./ui/Card";

interface TranslationCardProps {
  text: string;
  isLoading: boolean;
  onTranslate: (lang: string) => void;
  disabled: boolean;
}

export function TranslationCard({ text, isLoading, onTranslate, disabled }: TranslationCardProps) {
    return (
      <Card title="翻訳">
        <div className="flex justify-end mb-4">  {/* justify-endで右寄せ */}
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
              onClick={() => onTranslate('en')}
              disabled={disabled || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              翻訳
            </button>
          </div>
        </div>
        <div className="relative min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 rounded-lg">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
          {text ? (
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{text}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              翻訳ボタンを押すと、ここに翻訳結果が表示されます
            </p>
          )}
        </div>
      </Card>
    );
  }
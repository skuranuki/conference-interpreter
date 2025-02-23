import { Card } from "./ui/Card";

interface MinutesCardProps {
  text: string;
  isLoading: boolean;
  onGenerate: () => void;
  disabled: boolean;
}

export function MinutesCard({ text, isLoading, onGenerate, disabled }: MinutesCardProps) {
    return (
      <Card title="議事録生成">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="mb-4">
          <button
            onClick={onGenerate}
            disabled={disabled || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            生成
          </button>
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
            生成ボタンを押すと、ここに議事録が表示されます
          </p>
        )}
      </div>
    </Card>
  );
}
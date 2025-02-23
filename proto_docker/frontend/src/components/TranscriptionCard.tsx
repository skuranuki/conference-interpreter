import { Card } from "./ui/Card";

interface TranscriptionCardProps {
  text: string;
  isLoading: boolean;
}

export function TranscriptionCard({ text, isLoading }: TranscriptionCardProps) {
  return (
    <Card title="文字起こし結果">
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
            録音を開始すると、ここに文字起こし結果が表示されます
          </p>
        )}
      </div>
    </Card>
  );
}
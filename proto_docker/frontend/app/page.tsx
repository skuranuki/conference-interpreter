"use client";

import { useState } from "react";
import Recorder from "@/components/Recorder";
import { TranscriptionCard } from "@/components/TranscriptionCard";
import { TranslationCard } from "@/components/TranslationCard";
import { MinutesCard } from "@/components/MinutesCard";
import { Card } from "@/components/ui/Card";

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
      console.log(`Translating to ${targetLang}`);
      setTranslatedText(transcribedText);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateMinutes = async () => {
    setIsGeneratingMinutes(true);
    try {
      setMinutesText(transcribedText);
    } finally {
      setIsGeneratingMinutes(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            音声文字起こし
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            録音ボタンを押して話しかけてください
          </p>
        </div>

        <Card title="録音">
          <Recorder
            onTranscribe={setTranscribedText}
            onTranscribing={setIsTranscribing}
          />
        </Card>

        <TranscriptionCard 
          text={transcribedText}
          isLoading={isTranscribing}
        />

        <TranslationCard
          text={translatedText}
          isLoading={isTranslating}
          onTranslate={handleTranslate}
          disabled={!transcribedText}
        />

        <MinutesCard
          text={minutesText}
          isLoading={isGeneratingMinutes}
          onGenerate={handleGenerateMinutes}
          disabled={!transcribedText}
        />
      </div>
    </main>
  );
}
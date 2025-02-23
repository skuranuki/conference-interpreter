"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Recorder } from "@/components/Recorder";
import { TranscriptionCard } from "@/components/TranscriptionCard";
import { TranslationCard } from "@/components/TranslationCard";
import { MinutesCard } from "@/components/MinutesCard";

export default function Home() {
  // 状態管理
  const [transcribedText, setTranscribedText] = useState("");  // 文字起こしテキスト
  const [translatedText, setTranslatedText] = useState("");    // 翻訳後テキスト
  const [minutesText, setMinutesText] = useState("");         // 議事録テキスト
  const [isTranscribing, setIsTranscribing] = useState(false); // 文字起こし中
  const [isTranslating, setIsTranslating] = useState(false);   // 翻訳中
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState(false); // 議事録生成中

  // 翻訳処理
  const handleTranslate = async (targetLang: string) => {
    setIsTranslating(true);
    try {
      setTranslatedText(transcribedText); // 仮の実装
    } finally {
      setIsTranslating(false);
    }
  };

  // 議事録生成処理
  const handleGenerateMinutes = async () => {
    setIsGeneratingMinutes(true);
    try {
      setMinutesText(transcribedText); // 仮の実装
    } finally {
      setIsGeneratingMinutes(false);
    }
  };

  return (
    <Box as="main" minH="100vh" py={8} px={4}>
      <Container maxW="2xl">
        <VStack spacing={8}>
          {/* ヘッダー */}
          <Box textAlign="center">
            <Heading mb={2}>音声文字起こし</Heading>
            <Text color="gray.600">
              録音ボタンを押して話しかけてください
            </Text>
          </Box>

          {/* 各機能コンポーネント */}
          <Recorder
            onTranscribe={setTranscribedText}
            onTranscribing={setIsTranscribing}
          />

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
        </VStack>
      </Container>
    </Box>
  );
}
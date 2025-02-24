"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  
  Flex,
   
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from 'react';
import { Recorder } from "@/components/Recorder";
import { TranscriptionCard } from "@/components/TranscriptionCard";
import { TranslationCard } from "@/components/TranslationCard";
import { MinutesCard } from "@/components/MinutesCard";


// ✅ フッターコンポーネント
const Footer: FC = () => {
  return (
    <Box as="footer" bg="gray.100" py={4} textAlign="center" >
      <Text fontSize="sm" color="gray.600">
        © 2025 VOICING. All rights reserved.
      </Text>
    </Box>
  );
};

export default function Home() {
  // 状態管理
  const [transcribedText, setTranscribedText] = useState("");  
  const [translatedEnglish, setTranslatedEnglish] = useState("");    
  const [translatedSpanish, setTranslatedSpanish] = useState("");    
  const [minutesText, setMinutesText] = useState("");         
  
  const [isTranscribing, setIsTranscribing] = useState(false); 
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState(false);

   // 🎤 音声データの送信と文字起こし & 翻訳処理
   const handleAudioUploadAndTranscribe = async (audioBlob: Blob) => {
     setIsTranscribing(true);

     try {
       const formData = new FormData();
       formData.append("audio", audioBlob, "recording.wav");

       const response = await fetch("http://localhost:3001/transcribe", {
         method: "POST",
         body: formData,
         headers: { Accept: "application/json" },
         mode: "cors",
       });

       if (!response.ok) throw new Error("Failed to transcribe");

       // 🔹 JSON レスポンスを取得
       const result = await response.json();

       // 🔹 各言語の翻訳結果をセット
       setTranscribedText(result.text);
       setTranslatedEnglish(result.translation_en);
       setTranslatedSpanish(result.translation_es);
       setMinutesText(result.sum);
     } catch (error) {
       console.error("Transcription failed:", error);
     } finally {
       setIsTranscribing(false);
     }
   };

   return (
    <><Box px={4} bgColor="white">
       <Container maxW="container.lg">
         <Flex as="header" py="4" justifyContent="space-between"  alignItems="center">
           <NextLink href="/" passHref>
             <Heading as='h1' fontSize="1xl" cursor="pointer" color="blue.300">
              SPARTA
             </Heading>
             
           </NextLink>
         </Flex>
       </Container>
     </Box><Box as="main" py={8} px={4} bgColor="blue.300" display="flex" flexDirection="column">
     <Container maxW="2xl" flex="1">
           <VStack spacing={8}>
             {/* ヘッダー */}
             <Box textAlign="center">
             <Heading mb={2} color="white" fontStyle="italic">𝕧𝕠𝕚𝕔𝕚𝕟𝕘</Heading>
             <Text color="gray.600">録音ボタンを押して話しかけてください</Text>
             </Box>

             {/* 各機能コンポーネント */}
             <Recorder onRecordComplete={handleAudioUploadAndTranscribe} />

             {/* 日本語の文字起こし結果 */}
             <TranscriptionCard text={transcribedText} isLoading={isTranscribing} />

             {/* 翻訳 */}
             <TranslationCard
               translatedEnglish={translatedEnglish}
               translatedSpanish={translatedSpanish}
               isLoading={isTranscribing}
               disabled={!transcribedText} />

             {/* 議事録生成カード */}
             <MinutesCard
               text={minutesText}
               isLoading={isGeneratingMinutes}
               onGenerate={() => setMinutesText(minutesText)}
               disabled={!transcribedText} />
           </VStack>
         </Container>
       </Box>
       <Footer/>
       </>
   );
 }
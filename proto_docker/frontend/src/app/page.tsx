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
  const [transcribedText, setTranscribedText] = useState("");  
  const [translatedText, setTranslatedText] = useState("");    
  const [minutesText, setMinutesText] = useState("");         
  
  const [isTranscribing, setIsTranscribing] = useState(false); 
  const [isTranslating, setIsTranslating] = useState(false);   
  
const [isGeneratingMinutes, setIsGeneratingMinutes] =
useState(false);

   // 音声データの送信と文字起こし処理
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

       const result = await response.json();
       setTranscribedText(result.text);
     } catch (error) {
       console.error("Transcription failed:", error);
     } finally {
       setIsTranscribing(false);
     }
   };

   return (
     <Box as="main" minH="100vh" py={8} px={4}>
       <Container maxW="2xl">
         <VStack spacing={8}>
           {/* ヘッダー */}
           <Box textAlign="center">
             <Heading mb={2}>音声文字起こし</Heading>
             <Text color="gray.600">録音ボタンを押して話しかけてください</Text>
           </Box>

           {/* 各機能コンポーネント */}
           <Recorder onRecordComplete={handleAudioUploadAndTranscribe} />

                     <TranscriptionCard text={transcribedText} isLoading={isTranscribing} />

           <TranslationCard 
             text={translatedText}
             isLoading={isTranslating}
             onTranslate={(lang) => setTranslatedText(transcribedText)} 
             disabled={!transcribedText}
           />

           <MinutesCard 
             text={minutesText}
             isLoading={isGeneratingMinutes}
             onGenerate={() => setMinutesText(transcribedText)}
             disabled={!transcribedText}
           />
         </VStack>
       </Container>
     </Box>
   );
 }
"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  Box,
  IconButton,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { MdMic, MdStop } from "react-icons/md";

interface RecorderProps {
  onTranscribe: (text: string) => void;
  onTranscribing: (isTranscribing: boolean) => void;
}

export function Recorder({ onTranscribe, onTranscribing }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // 録音開始処理
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];

    // 音声データ取得時
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    // 録音停止時
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      try {
        onTranscribing(true);
        const response = await fetch("http://localhost:3001/transcribe", {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" },
          mode: "cors",
        });

        const result = await response.json();
        onTranscribe(result.text);
      } catch (error) {
        console.error("Transcription failed:", error);
      } finally {
        onTranscribing(false);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <Card w="full">
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md">録音</Heading>
          <IconButton
            aria-label={recording ? "録音停止" : "録音開始"}
            icon={recording ? <MdStop /> : <MdMic />}
            onClick={recording ? stopRecording : startRecording}
            colorScheme={recording ? "red" : "blue"}
            isRound
            size="lg"
          />
        </Flex>
      </CardHeader>
    </Card>
  );
}
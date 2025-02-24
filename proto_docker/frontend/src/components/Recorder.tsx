"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  Flex,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { MdMic, MdStop } from "react-icons/md";

interface RecorderProps {
  onRecordComplete: (audioBlob: Blob) => void;
}

export function Recorder({ onRecordComplete }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // 🔹 audioChunks を useRef に変更
  const streamRef = useRef<MediaStream | null>(null); // 🔹 マイクストリーム管理用

  // 🎤 録音開始処理
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // 🔹 ストリームを保存

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = []; // 🔹 前回のデータをクリア

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        onRecordComplete(audioBlob);

        // 🎤 マイクストリームを停止してリソース解放
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("マイクへのアクセスに失敗しました:", error);
    }
  };

  // ⏹️ 録音停止処理
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <Card w="full"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.2)' }}
            cursor="pointer"
        >
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
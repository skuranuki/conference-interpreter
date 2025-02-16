"use client";

import { useState, useRef } from "react";

const Recorder = ({ onTranscribe }: { onTranscribe: (text: string) => void }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      try {
        const response = await fetch("http://localhost:3001/transcribe", {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
          },
          mode: "cors",//corsを殺す
        });

        const result = await response.json();
        onTranscribe(result.text);
      } catch (error) {
        console.error("Transcription failed:", error);
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
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "録音停止" : "録音開始"}
      </button>
    </div>
  );
};

export default Recorder;

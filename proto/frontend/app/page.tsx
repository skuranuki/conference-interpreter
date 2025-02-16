"use client";

import { useState } from "react";
import Recorder from "@/components/Recorder"; // 修正ポイント

export default function Home() {
  const [transcribedText, setTranscribedText] = useState("");

  return (
    <div>
      <h1>音声認識アプリ</h1>
      <Recorder onTranscribe={setTranscribedText} />
      <p>結果: {transcribedText}</p>
    </div>
  );
}

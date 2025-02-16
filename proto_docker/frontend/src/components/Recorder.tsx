"use client";

import { useState, useRef } from "react";

// Recorderコンポーネントの定義
//関数型を含むので難しい書き方になっている
const Recorder = ({ onTranscribe }: { onTranscribe: (text: string) => void }) => {
  const [recording, setRecording] = useState(false); // 録音状態を管理するステート
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // MediaRecorderの参照を保持

  // 録音開始関数
  const startRecording = async () => {
    // マイクの音声ストリームを取得
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // MediaRecorderを作成
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = []; // 音声データのチャンクを保持する配列

    // 音声データが利用可能になったときのイベントハンドラ
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data); // 音声データのチャンクを配列に追加
    };

    // 録音が停止したときのイベントハンドラ
    mediaRecorder.onstop = async () => {
      // チャンクを結合してBlobを作成この辺はよう分からん
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      // フォームデータに音声ファイルを追加
      formData.append("audio", audioBlob, "recording.wav");

      try {
        // サーバーに音声ファイルを送信
        const response = await fetch("http://localhost:3001/transcribe", {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
          },
          mode: "cors", // CORS設定
        });

        // サーバーからのレスポンスをJSONとしてパース
        const result = await response.json();
        // テキストをコールバック関数に渡す
        onTranscribe(result.text);
      } catch (error) {
        console.error("Transcription failed:", error); // エラーハンドリング
      }
    };

    mediaRecorder.start(); // 録音開始
    setRecording(true); // 録音状態を更新
  };

  // 録音停止関数
  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); // 録音停止
    setRecording(false); // 録音状態を更新
  };

  return (
    <div>
      {/* 録音状態に応じてボタンの表示を切り替え */}
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "録音停止" : "録音開始"}
      </button>
    </div>
  );
};

export default Recorder;

# フォルダ校正
```
project-root/
├── backend/            # Go (Fiber) のバックエンド
│   ├── main.go         # エントリーポイント
│   ├── handlers/       # ルーティング & API処理
│   │   └── transcribe.go  # Whisper APIを呼び出し
│   ├── config/         # 設定ファイル
│   │   └── env.go      # 環境変数の読み込み
│   ├── go.mod          # Goモジュール
│   ├── go.sum          # 依存管理
│
├── frontend/           # Next.js (TypeScript) のフロントエンド
│   ├── public/         # 音声ファイル保存用
│   ├── src/           
│   │   ├── pages/      # ルーティング
│   │   │   └── index.tsx   # フロントのメインページ
│   │   ├── components/ # UIコンポーネント
│   │   │   └── Recorder.tsx  # 音声録音コンポーネント
│   │   ├── utils/      # API通信関連
│   │       └── api.ts  # Whisper API通信処理
│   ├── package.json    # フロントエンドの依存管理
│   ├── tsconfig.json   # TypeScript設定
│
└── docker-compose.yml  # コンテナ管理（後で追加可）
```
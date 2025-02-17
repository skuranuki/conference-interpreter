# To do
```
・dockerの導入
・音声（あらかじめ用意した）をテキストに変換
・フロントでテキストを表示
```

# install
```
Goのinstall（後でdockerで実装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

この行いらない？
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile

eval "$(/opt/homebrew/bin/brew shellenv)"

which brew

brew install go

cd backend
go mod init project-root/backend

APIのinstall
go get github.com/gofiber/fiber/v2

go get github.com/go-resty/resty/v2

nodeのinstall（いらんかも）
brew install node

実行
go run main.go
rm -rf .next  
npm run dev
```

# フォルダ構成
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

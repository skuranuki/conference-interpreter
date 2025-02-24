import { Providers } from './providers'

// src/app/layout.tsx
export const metadata = {
  title: "VOICING",
  description: "音声を自動で文字に起こすアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
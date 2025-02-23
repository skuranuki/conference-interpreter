// src/theme/index.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// ColorModeの設定
const config: ThemeConfig = {
  initialColorMode: 'light', // 初期カラーモード
  useSystemColorMode: true,  // システムのカラーモードを使用
}

// カスタムカラーやその他の設定
const theme = extendTheme({
  config,
  // カラーの設定
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      900: '#0d47a1',
    },
  },
  // フォントの設定
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  // コンポーネントのデフォルトスタイル
  components: {
    Button: {
      defaultProps: {
        size: 'sm',         // ボタンのデフォルトサイズ
        variant: 'solid',   // ボタンのデフォルトスタイル
      },
    },
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'white',
          borderRadius: 'xl',
          boxShadow: 'lg',
        },
      },
    },
  },
})

export { theme }
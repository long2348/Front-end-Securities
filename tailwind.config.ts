import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Stock/Ceiling — giá trần
        ceil: '#FF00FF',
        'ceil-alt': '#BA68C8',
        // Stock/Floor — giá sàn
        floor: '#00FFFF',
        'floor-alt': '#4DD0E1',
        // Stock/Reference — giá tham chiếu
        ref: '#FFD600',
        // Stock/Up — giá tăng
        up: '#00E676',
        // Stock/Down — giá giảm
        down: '#FF1744',
        // Bg/Table — nền bảng giá
        'board-bg': '#0A0E17',
        'board-bg-alt': '#121620',
        // Structural
        'board-row': '#0d1526',
        'board-row-alt': '#111827',
        'board-border': '#1e2d45',
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config

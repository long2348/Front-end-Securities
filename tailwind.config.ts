import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ceil: '#b042ff',    // giá trần - tím
        floor: '#00c2c7',   // giá sàn - xanh lam
        up: '#00c853',      // tăng - xanh lá
        down: '#ff3d3d',    // giảm - đỏ
        ref: '#f5c518',     // tham chiếu - vàng
        'board-bg': '#0a0e1a',
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

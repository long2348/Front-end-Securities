# Task 1: Khởi tạo dự án (Project Scaffolding)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`
- Create: `tailwind.config.ts`, `src/index.css`, `src/main.tsx`, `src/App.tsx`
- Create: `index.html`

**Interfaces:**
- Produces: môi trường dev chạy được tại `http://localhost:5173`

---

## Steps

- [ ] **Step 1: Scaffold Vite project**

```bash
cd c:\MyReact\Securities
npm create vite@latest . -- --template react-ts
npm install
```

- [ ] **Step 2: Cài TailwindCSS**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: Cập nhật `tailwind.config.ts`**

```ts
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
```

- [ ] **Step 4: Cập nhật `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-board-bg text-white font-mono;
}
```

- [ ] **Step 5: Cập nhật `src/App.tsx` tạm**

```tsx
export default function App() {
  return <div className="p-4 text-white">Securities Phase 1</div>
}
```

- [ ] **Step 6: Cài Vitest + React Testing Library**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 7: Cập nhật `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
})
```

- [ ] **Step 8: Tạo `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Chạy dev server xác nhận**

```bash
npm run dev
```
Expected: server khởi động tại `http://localhost:5173`, hiển thị "Securities Phase 1"

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "chore: khởi tạo dự án Vite React TS TailwindCSS Vitest"
```

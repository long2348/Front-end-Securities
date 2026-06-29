# Phase 1 – Bảng Giá Chứng Khoán (Stock Price Board) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng bảng giá chứng khoán thời gian thực trên frontend với React TypeScript + TailwindCSS, hỗ trợ các sàn HOSE, HNX, UPCOM với đầy đủ màu sắc theo chuẩn Việt Nam.

**Architecture:** Single-page React application sử dụng Vite làm build tool, dữ liệu ban đầu dùng mock data tĩnh (pha sau sẽ kết nối WebSocket/REST API). Components được tổ chức theo feature-folder, state quản lý bằng React hooks thuần, không dùng Redux ở phase này.

**Tech Stack:** React 18, TypeScript 5, TailwindCSS 3, Vite 5, Vitest, React Testing Library

---

## Mục Tiêu & Phạm Vi Phase 1

### Mục tiêu
- Hiển thị bảng giá cổ phiếu theo chuẩn giao diện sàn chứng khoán Việt Nam
- Hỗ trợ 3 sàn: HOSE, HNX, UPCOM
- Màu sắc chuẩn: Tím (Trần), Xanh lá (Tăng), Đỏ (Giảm), Vàng (Tham chiếu), Xanh lam (Sàn)
- Tìm kiếm, lọc, sắp xếp dữ liệu phía client
- Responsive cho desktop (1280px+) và tablet (768px+)

### Ngoài phạm vi Phase 1
- Kết nối WebSocket / REST API thật
- Authentication / Authorization
- Biểu đồ nến (candlestick chart)
- Watchlist cá nhân
- Đặt lệnh mua/bán

---

## Yêu Cầu Chức Năng (Functional Requirements)

| ID   | Yêu cầu |
|------|---------|
| FR-01 | Hiển thị thanh thị trường tổng quan (VN-Index, HNX-Index, UPCOM-Index) với giá trị, thay đổi, %thay đổi |
| FR-02 | Bảng giá có các cột: Mã CK, Trần, TC, Sàn, Mở cửa, Cao nhất, Thấp nhất, Giá hiện tại, Thay đổi (+/-), %Thay đổi, KL Khớp |
| FR-03 | Mỗi ô giá được tô màu theo quy tắc: Tím=Trần, Xanh lá=Tăng, Đỏ=Giảm, Vàng=Tham chiếu, Xanh lam=Sàn |
| FR-04 | Chuyển tab giữa 3 sàn HOSE / HNX / UPCOM |
| FR-05 | Tìm kiếm cổ phiếu theo mã hoặc tên công ty (client-side) |
| FR-06 | Sắp xếp bảng theo bất kỳ cột nào (tăng/giảm) |
| FR-07 | Bộ lọc nhanh: Tất cả / Tăng / Giảm / Trần / Sàn / Tham chiếu |
| FR-08 | Hiển thị số liệu tổng hợp cuối bảng: Tổng KL, số mã Tăng/Giảm/Đứng |
| FR-09 | Phân trang hoặc virtual scroll khi danh sách > 50 mã |
| FR-10 | Nút "Làm mới dữ liệu" (simulate refresh với mock data mới) |

---

## Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

| ID    | Yêu cầu |
|-------|---------|
| NFR-01 | First Contentful Paint < 1.5s trên localhost |
| NFR-02 | Render bảng 200 mã cổ phiếu mượt mà, không giật lag |
| NFR-03 | TypeScript strict mode — không có `any` tường minh |
| NFR-04 | Test coverage > 80% cho logic nghiệp vụ (màu sắc, sắp xếp, lọc) |
| NFR-05 | Responsive: desktop (≥1280px), tablet (≥768px) |
| NFR-06 | Không dùng thư viện UI component bên ngoài (chỉ TailwindCSS) |
| NFR-07 | Accessibility: bảng dùng `<table>` semantics với `aria-sort` |

---

## Global Constraints

- React 18.x, TypeScript 5.x, TailwindCSS 3.x, Vite 5.x
- Node.js >= 18.x
- Vitest cho unit tests, React Testing Library cho component tests
- Không dùng `any` trong TypeScript
- Không dùng thư viện UI (MUI, Ant Design, Chakra…)
- Commit nhỏ, thường xuyên sau mỗi task
- Tiền tố commit: `feat:`, `test:`, `chore:`, `fix:`

---

## Cấu Trúc Thư Mục Dự Án

```
securities/                          ← root (Vite project)
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                     ← entry point
│   ├── App.tsx                      ← root component, routing giữa các trang
│   ├── index.css                    ← Tailwind directives
│   │
│   ├── types/
│   │   └── stock.ts                 ← StockQuote, MarketIndex, Exchange enum, FilterType enum
│   │
│   ├── constants/
│   │   └── colors.ts                ← PRICE_COLOR_MAP, Tailwind class helpers
│   │
│   ├── utils/
│   │   ├── priceColor.ts            ← getPriceColorClass(price, ref, ceil, floor)
│   │   ├── formatNumber.ts          ← formatVolume, formatPrice, formatChange
│   │   └── sortStocks.ts            ← sortBy(stocks, column, direction)
│   │
│   ├── data/
│   │   └── mockStocks.ts            ← mock data 50+ mã cho HOSE, HNX, UPCOM
│   │
│   ├── hooks/
│   │   ├── usePriceBoard.ts         ← state: stocks, sort, filter, search, tab
│   │   └── useMarketSummary.ts      ← tính tổng KL, đếm tăng/giảm/đứng
│   │
│   └── components/
│       ├── MarketOverview/
│       │   ├── MarketOverview.tsx   ← thanh tổng quan VN-Index, HNX-Index, UPCOM
│       │   ├── IndexCard.tsx        ← 1 card index
│       │   └── MarketOverview.test.tsx
│       │
│       ├── PriceBoard/
│       │   ├── PriceBoard.tsx       ← container: kết hợp toolbar + table + summary
│       │   ├── ExchangeTabs.tsx     ← tab HOSE / HNX / UPCOM
│       │   ├── Toolbar.tsx          ← ô tìm kiếm + bộ lọc nhanh + nút làm mới
│       │   ├── StockTable.tsx       ← <table> với header có sort, body là list StockRow
│       │   ├── StockRow.tsx         ← 1 hàng cổ phiếu, nhận StockQuote prop
│       │   ├── PriceCell.tsx        ← 1 ô giá với màu sắc động
│       │   ├── BoardSummary.tsx     ← tổng KL, tổng tăng/giảm/đứng
│       │   └── PriceBoard.test.tsx
│       │
│       └── shared/
│           ├── SortIcon.tsx         ← icon mũi tên sort (up/down/neutral)
│           └── Badge.tsx            ← badge màu cho filter buttons
│
├── docs/
│   └── superpowers/
│       └── plans/
│           └── 2026-06-29-phase1-price-board.md   ← file này
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

---

## Lộ Trình & Chia Nhỏ Công Việc

### Task 1: Khởi tạo dự án (Project Scaffolding)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`
- Create: `tailwind.config.ts`, `src/index.css`, `src/main.tsx`, `src/App.tsx`
- Create: `index.html`

**Interfaces:**
- Produces: môi trường dev chạy được tại `http://localhost:5173`

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

---

### Task 2: Định nghĩa Types & Constants

**Files:**
- Create: `src/types/stock.ts`
- Create: `src/constants/colors.ts`

**Interfaces:**
- Produces:
  - `StockQuote` interface
  - `MarketIndex` interface
  - `Exchange` enum: `'HOSE' | 'HNX' | 'UPCOM'`
  - `SortDirection` type: `'asc' | 'desc' | null`
  - `FilterType` type: `'ALL' | 'UP' | 'DOWN' | 'CEIL' | 'FLOOR' | 'REF'`
  - `PRICE_COLOR` constant map

- [ ] **Step 1: Viết tests cho constants**

Tạo `src/constants/colors.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getPriceColorClass } from '../utils/priceColor'

describe('getPriceColorClass', () => {
  it('trả về màu tím khi giá = trần', () => {
    expect(getPriceColorClass(105, 100, 105, 95)).toBe('text-ceil bg-ceil/10')
  })
  it('trả về màu xanh lam khi giá = sàn', () => {
    expect(getPriceColorClass(95, 100, 105, 95)).toBe('text-floor bg-floor/10')
  })
  it('trả về màu xanh lá khi giá > tham chiếu', () => {
    expect(getPriceColorClass(102, 100, 105, 95)).toBe('text-up')
  })
  it('trả về màu đỏ khi giá < tham chiếu', () => {
    expect(getPriceColorClass(98, 100, 105, 95)).toBe('text-down')
  })
  it('trả về màu vàng khi giá = tham chiếu', () => {
    expect(getPriceColorClass(100, 100, 105, 95)).toBe('text-ref')
  })
})
```

- [ ] **Step 2: Chạy test xác nhận FAIL**

```bash
npm run test -- colors.test.ts
```
Expected: FAIL — `getPriceColorClass` chưa tồn tại

- [ ] **Step 3: Tạo `src/types/stock.ts`**

```ts
export type Exchange = 'HOSE' | 'HNX' | 'UPCOM'
export type SortDirection = 'asc' | 'desc' | null
export type FilterType = 'ALL' | 'UP' | 'DOWN' | 'CEIL' | 'FLOOR' | 'REF'
export type SortColumn = keyof Pick<
  StockQuote,
  'ticker' | 'currentPrice' | 'change' | 'changePercent' | 'volume' |
  'open' | 'high' | 'low' | 'referencePrice'
>

export interface StockQuote {
  ticker: string          // Mã CK
  companyName: string     // Tên công ty
  exchange: Exchange
  referencePrice: number  // TC - Tham chiếu
  ceilingPrice: number    // Trần
  floorPrice: number      // Sàn
  open: number            // Mở cửa
  high: number            // Cao nhất
  low: number             // Thấp nhất
  currentPrice: number    // Giá hiện tại
  change: number          // +/-
  changePercent: number   // % thay đổi
  volume: number          // Khối lượng khớp
}

export interface MarketIndex {
  name: string            // 'VN-Index' | 'HNX-Index' | 'UPCOM-Index'
  value: number
  change: number
  changePercent: number
  volume: number
}
```

- [ ] **Step 4: Tạo `src/utils/priceColor.ts`**

```ts
export function getPriceColorClass(
  price: number,
  ref: number,
  ceil: number,
  floor: number,
): string {
  if (price >= ceil) return 'text-ceil bg-ceil/10'
  if (price <= floor) return 'text-floor bg-floor/10'
  if (price > ref) return 'text-up'
  if (price < ref) return 'text-down'
  return 'text-ref'
}
```

- [ ] **Step 5: Tạo `src/constants/colors.ts`**

```ts
export const FILTER_LABELS: Record<string, string> = {
  ALL: 'Tất cả',
  UP: 'Tăng',
  DOWN: 'Giảm',
  CEIL: 'Trần',
  FLOOR: 'Sàn',
  REF: 'Tham chiếu',
}
```

- [ ] **Step 6: Chạy test xác nhận PASS**

```bash
npm run test -- colors.test.ts
```
Expected: 5 tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/types src/utils/priceColor.ts src/constants
git commit -m "feat: định nghĩa types, FilterType, getPriceColorClass"
```

---

### Task 3: Utility Functions (Format & Sort)

**Files:**
- Create: `src/utils/formatNumber.ts`
- Create: `src/utils/sortStocks.ts`
- Create: `src/utils/formatNumber.test.ts`
- Create: `src/utils/sortStocks.test.ts`

**Interfaces:**
- Consumes: `StockQuote` từ Task 2
- Produces:
  - `formatPrice(n: number): string` — "102.5" → "102.50"
  - `formatVolume(n: number): string` — 1500000 → "1,500,000"
  - `formatChange(n: number): string` — 2.5 → "+2.50", -1.3 → "-1.30"
  - `formatPercent(n: number): string` — 2.5 → "+2.50%"
  - `sortStocks(stocks: StockQuote[], col: SortColumn, dir: SortDirection): StockQuote[]`

- [ ] **Step 1: Viết failing tests cho formatNumber**

Tạo `src/utils/formatNumber.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { formatPrice, formatVolume, formatChange, formatPercent } from './formatNumber'

describe('formatPrice', () => {
  it('định dạng 2 chữ số thập phân', () => {
    expect(formatPrice(102.5)).toBe('102.50')
    expect(formatPrice(100)).toBe('100.00')
  })
})

describe('formatVolume', () => {
  it('thêm dấu phẩy phân cách nghìn', () => {
    expect(formatVolume(1500000)).toBe('1,500,000')
    expect(formatVolume(500)).toBe('500')
  })
})

describe('formatChange', () => {
  it('thêm dấu + khi dương', () => {
    expect(formatChange(2.5)).toBe('+2.50')
  })
  it('giữ dấu - khi âm', () => {
    expect(formatChange(-1.3)).toBe('-1.30')
  })
  it('trả về 0.00 khi bằng 0', () => {
    expect(formatChange(0)).toBe('0.00')
  })
})

describe('formatPercent', () => {
  it('thêm dấu + và ký hiệu %', () => {
    expect(formatPercent(2.5)).toBe('+2.50%')
    expect(formatPercent(-1.3)).toBe('-1.30%')
  })
})
```

- [ ] **Step 2: Chạy test xác nhận FAIL**

```bash
npm run test -- formatNumber.test.ts
```
Expected: FAIL

- [ ] **Step 3: Implement `src/utils/formatNumber.ts`**

```ts
export function formatPrice(n: number): string {
  return n.toFixed(2)
}

export function formatVolume(n: number): string {
  return n.toLocaleString('en-US')
}

export function formatChange(n: number): string {
  if (n === 0) return '0.00'
  return (n > 0 ? '+' : '') + n.toFixed(2)
}

export function formatPercent(n: number): string {
  return formatChange(n) + '%'
}
```

- [ ] **Step 4: Chạy test xác nhận PASS**

```bash
npm run test -- formatNumber.test.ts
```
Expected: PASS

- [ ] **Step 5: Viết failing tests cho sortStocks**

Tạo `src/utils/sortStocks.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sortStocks } from './sortStocks'
import type { StockQuote } from '../types/stock'

const makeStock = (ticker: string, currentPrice: number, volume: number): StockQuote => ({
  ticker, companyName: ticker, exchange: 'HOSE',
  referencePrice: 100, ceilingPrice: 107, floorPrice: 93,
  open: 100, high: currentPrice, low: currentPrice,
  currentPrice, change: currentPrice - 100,
  changePercent: ((currentPrice - 100) / 100) * 100,
  volume,
})

const stocks = [makeStock('AAA', 105, 3000), makeStock('BBB', 95, 1000), makeStock('CCC', 100, 2000)]

describe('sortStocks', () => {
  it('sắp xếp tăng dần theo currentPrice', () => {
    const result = sortStocks(stocks, 'currentPrice', 'asc')
    expect(result.map(s => s.ticker)).toEqual(['BBB', 'CCC', 'AAA'])
  })
  it('sắp xếp giảm dần theo volume', () => {
    const result = sortStocks(stocks, 'volume', 'desc')
    expect(result.map(s => s.ticker)).toEqual(['AAA', 'CCC', 'BBB'])
  })
  it('trả về bản sao, không mutate mảng gốc', () => {
    const original = [...stocks]
    sortStocks(stocks, 'currentPrice', 'asc')
    expect(stocks).toEqual(original)
  })
  it('trả về nguyên bản khi dir = null', () => {
    const result = sortStocks(stocks, 'currentPrice', null)
    expect(result).toEqual(stocks)
  })
})
```

- [ ] **Step 6: Chạy test xác nhận FAIL**

```bash
npm run test -- sortStocks.test.ts
```
Expected: FAIL

- [ ] **Step 7: Implement `src/utils/sortStocks.ts`**

```ts
import type { StockQuote, SortColumn, SortDirection } from '../types/stock'

export function sortStocks(
  stocks: StockQuote[],
  col: SortColumn,
  dir: SortDirection,
): StockQuote[] {
  if (!dir) return stocks
  return [...stocks].sort((a, b) => {
    const av = a[col]
    const bv = b[col]
    if (typeof av === 'string' && typeof bv === 'string') {
      return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    }
    return dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
  })
}
```

- [ ] **Step 8: Chạy toàn bộ tests**

```bash
npm run test
```
Expected: tất cả PASS

- [ ] **Step 9: Commit**

```bash
git add src/utils
git commit -m "feat: thêm formatNumber và sortStocks utilities"
```

---

### Task 4: Mock Data

**Files:**
- Create: `src/data/mockStocks.ts`
- Create: `src/data/mockIndexes.ts`

**Interfaces:**
- Consumes: `StockQuote`, `MarketIndex`, `Exchange` từ Task 2
- Produces:
  - `MOCK_STOCKS: StockQuote[]` — 60 mã (20 HOSE, 20 HNX, 20 UPCOM)
  - `MOCK_INDEXES: MarketIndex[]` — 3 chỉ số

- [ ] **Step 1: Tạo `src/data/mockStocks.ts`**

```ts
import type { StockQuote } from '../types/stock'

function makeQuote(
  ticker: string,
  company: string,
  exchange: StockQuote['exchange'],
  ref: number,
  current: number,
  volume: number,
): StockQuote {
  const ceil = parseFloat((ref * 1.07).toFixed(2))
  const floor = parseFloat((ref * 0.93).toFixed(2))
  return {
    ticker, companyName: company, exchange,
    referencePrice: ref, ceilingPrice: ceil, floorPrice: floor,
    open: ref,
    high: Math.max(ref, current),
    low: Math.min(ref, current),
    currentPrice: current,
    change: parseFloat((current - ref).toFixed(2)),
    changePercent: parseFloat(((current - ref) / ref * 100).toFixed(2)),
    volume,
  }
}

export const MOCK_STOCKS: StockQuote[] = [
  // HOSE
  makeQuote('VNM', 'Vinamilk', 'HOSE', 75.0, 78.5, 2_500_000),
  makeQuote('VIC', 'Vingroup', 'HOSE', 45.0, 45.0, 1_800_000),
  makeQuote('HPG', 'Hoa Phat Group', 'HOSE', 28.5, 26.0, 5_300_000),
  makeQuote('MSN', 'Masan Group', 'HOSE', 62.0, 65.0, 980_000),
  makeQuote('VHM', 'Vinhomes', 'HOSE', 35.0, parseFloat((35 * 1.07).toFixed(2)), 3_200_000),
  makeQuote('BID', 'BIDV', 'HOSE', 42.0, 40.0, 4_100_000),
  makeQuote('CTG', 'Vietinbank', 'HOSE', 33.5, 33.5, 2_700_000),
  makeQuote('VCB', 'Vietcombank', 'HOSE', 88.0, 91.0, 1_500_000),
  makeQuote('TCB', 'Techcombank', 'HOSE', 52.0, 49.0, 3_900_000),
  makeQuote('MBB', 'MB Bank', 'HOSE', 24.5, 26.0, 6_200_000),
  makeQuote('ACB', 'Asia Commercial Bank', 'HOSE', 23.0, 22.5, 4_500_000),
  makeQuote('STB', 'Sacombank', 'HOSE', 18.0, 18.0, 7_800_000),
  makeQuote('FPT', 'FPT Corp', 'HOSE', 95.0, 101.0, 890_000),
  makeQuote('MWG', 'The Gioi Di Dong', 'HOSE', 55.0, parseFloat((55 * 0.93).toFixed(2)), 2_100_000),
  makeQuote('SSI', 'SSI Securities', 'HOSE', 28.0, 29.5, 5_600_000),
  makeQuote('VND', 'VNDirect', 'HOSE', 19.5, 21.0, 8_300_000),
  makeQuote('DXG', 'Dat Xanh Group', 'HOSE', 12.0, 11.0, 9_100_000),
  makeQuote('PDR', 'Phat Dat Real', 'HOSE', 22.0, 23.5, 4_400_000),
  makeQuote('KDH', 'Khang Dien House', 'HOSE', 30.5, 30.5, 1_600_000),
  makeQuote('REE', 'REE Corp', 'HOSE', 65.0, 68.0, 720_000),
  // HNX
  makeQuote('SHS', 'Saigon-Hanoi Securities', 'HNX', 15.5, 16.5, 3_200_000),
  makeQuote('HUT', 'Tasco', 'HNX', 8.0, 7.5, 5_600_000),
  makeQuote('PVS', 'PetroVietnam Technical', 'HNX', 35.0, 37.0, 2_100_000),
  makeQuote('NVB', 'Navibank', 'HNX', 12.0, 12.0, 1_900_000),
  makeQuote('SCI', 'SCI Group', 'HNX', 18.5, 19.0, 880_000),
  makeQuote('HBS', 'HBS Securities', 'HNX', 10.0, 10.7, 4_300_000),
  makeQuote('VCS', 'Vicostone', 'HNX', 180.0, 185.0, 150_000),
  makeQuote('TNG', 'TNG Garment', 'HNX', 22.0, 20.5, 2_700_000),
  makeQuote('IDC', 'Idico Corp', 'HNX', 55.0, 57.5, 630_000),
  makeQuote('PVI', 'PVI Holdings', 'HNX', 42.0, 42.0, 410_000),
  makeQuote('BVS', 'BaoViet Securities', 'HNX', 16.0, 16.5, 1_500_000),
  makeQuote('MBS', 'MB Securities', 'HNX', 20.5, 22.0, 2_900_000),
  makeQuote('CEO', 'C.E.O Group', 'HNX', 9.5, 9.0, 4_100_000),
  makeQuote('KLF', 'KLF Corp', 'HNX', 5.0, 5.0, 8_900_000),
  makeQuote('PGS', 'PGS Corp', 'HNX', 25.0, 27.0, 670_000),
  makeQuote('SD5', 'Song Da 5', 'HNX', 14.5, 13.5, 3_300_000),
  makeQuote('VGC', 'Viglacera', 'HNX', 38.0, 40.5, 1_100_000),
  makeQuote('HLD', 'Hoa Lam Dalat', 'HNX', 7.5, 8.0, 5_500_000),
  makeQuote('NTP', 'Nhon Trach Plastic', 'HNX', 72.0, 75.0, 390_000),
  makeQuote('LUT', 'Luong Tai Construction', 'HNX', 11.0, 10.2, 2_200_000),
  // UPCOM
  makeQuote('ABI', 'Agribank Insurance', 'UPCOM', 30.0, 32.0, 450_000),
  makeQuote('BSR', 'Binh Son Refining', 'UPCOM', 22.0, 23.5, 3_100_000),
  makeQuote('VEA', 'Vietnam Engine', 'UPCOM', 45.0, 45.0, 290_000),
  makeQuote('MVB', 'Military Bank', 'UPCOM', 19.5, 18.0, 1_800_000),
  makeQuote('VTP', 'Vietnam Post', 'UPCOM', 58.0, 61.0, 210_000),
  makeQuote('MCH', 'Masan Consumer', 'UPCOM', 155.0, 160.0, 80_000),
  makeQuote('HAH', 'Hai An Transport', 'UPCOM', 42.0, 44.0, 560_000),
  makeQuote('VGT', 'Vinatex', 'UPCOM', 11.5, 11.0, 2_400_000),
  makeQuote('LPB', 'LienViet Bank', 'UPCOM', 18.0, 19.0, 4_200_000),
  makeQuote('VIB', 'Vietnam Int Bank', 'UPCOM', 22.5, 22.5, 1_700_000),
  makeQuote('OCB', 'Orient Commercial Bank', 'UPCOM', 16.0, 15.0, 3_600_000),
  makeQuote('KBC', 'Kinh Bac City', 'UPCOM', 28.0, 29.5, 2_900_000),
  makeQuote('HDC', 'Binh Duong Housing', 'UPCOM', 35.0, parseFloat((35 * 0.93).toFixed(2)), 980_000),
  makeQuote('DIG', 'DIC Corp', 'UPCOM', 18.5, 20.0, 5_100_000),
  makeQuote('QNS', 'Quang Ngai Sugar', 'UPCOM', 40.0, 42.5, 360_000),
  makeQuote('VHC', 'Vinh Hoan Corp', 'UPCOM', 78.0, 78.0, 510_000),
  makeQuote('ANV', 'Nam Viet Corp', 'UPCOM', 25.0, 27.0, 1_200_000),
  makeQuote('IDI', 'IDI Corp', 'UPCOM', 12.5, 12.0, 4_800_000),
  makeQuote('PAN', 'PAN Group', 'UPCOM', 22.0, 23.5, 670_000),
  makeQuote('GTN', 'GTN Foods', 'UPCOM', 14.0, 14.0, 2_300_000),
]
```

- [ ] **Step 2: Tạo `src/data/mockIndexes.ts`**

```ts
import type { MarketIndex } from '../types/stock'

export const MOCK_INDEXES: MarketIndex[] = [
  { name: 'VN-Index', value: 1285.43, change: 8.72, changePercent: 0.68, volume: 523_450_000 },
  { name: 'HNX-Index', value: 228.15, change: -1.34, changePercent: -0.58, volume: 98_230_000 },
  { name: 'UPCOM-Index', value: 91.72, change: 0.0, changePercent: 0.0, volume: 42_110_000 },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data
git commit -m "feat: thêm mock data 60 mã cổ phiếu và 3 chỉ số thị trường"
```

---

### Task 5: Custom Hooks (usePriceBoard & useMarketSummary)

**Files:**
- Create: `src/hooks/usePriceBoard.ts`
- Create: `src/hooks/useMarketSummary.ts`
- Create: `src/hooks/usePriceBoard.test.ts`

**Interfaces:**
- Consumes: `MOCK_STOCKS`, `StockQuote`, `Exchange`, `FilterType`, `SortColumn`, `SortDirection`, `sortStocks`
- Produces:
  - `usePriceBoard()` → `{ stocks, activeExchange, setActiveExchange, sortCol, sortDir, toggleSort, searchQuery, setSearchQuery, activeFilter, setActiveFilter, refresh }`
  - `useMarketSummary(stocks)` → `{ totalVolume, countUp, countDown, countRef }`

- [ ] **Step 1: Viết failing tests**

Tạo `src/hooks/usePriceBoard.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePriceBoard } from './usePriceBoard'

describe('usePriceBoard', () => {
  it('mặc định hiển thị sàn HOSE', () => {
    const { result } = renderHook(() => usePriceBoard())
    expect(result.current.activeExchange).toBe('HOSE')
  })

  it('lọc đúng sàn khi đổi exchange', () => {
    const { result } = renderHook(() => usePriceBoard())
    act(() => result.current.setActiveExchange('HNX'))
    result.current.stocks.forEach(s => expect(s.exchange).toBe('HNX'))
  })

  it('lọc theo searchQuery', () => {
    const { result } = renderHook(() => usePriceBoard())
    act(() => result.current.setSearchQuery('VNM'))
    expect(result.current.stocks.every(s =>
      s.ticker.includes('VNM') || s.companyName.toLowerCase().includes('vnm')
    )).toBe(true)
  })

  it('lọc UP chỉ trả mã tăng', () => {
    const { result } = renderHook(() => usePriceBoard())
    act(() => result.current.setActiveFilter('UP'))
    result.current.stocks.forEach(s => expect(s.change).toBeGreaterThan(0))
  })

  it('toggleSort thay đổi direction đúng thứ tự: null → asc → desc → null', () => {
    const { result } = renderHook(() => usePriceBoard())
    expect(result.current.sortDir).toBeNull()
    act(() => result.current.toggleSort('currentPrice'))
    expect(result.current.sortDir).toBe('asc')
    act(() => result.current.toggleSort('currentPrice'))
    expect(result.current.sortDir).toBe('desc')
    act(() => result.current.toggleSort('currentPrice'))
    expect(result.current.sortDir).toBeNull()
  })
})
```

- [ ] **Step 2: Chạy test xác nhận FAIL**

```bash
npm run test -- usePriceBoard.test.ts
```

- [ ] **Step 3: Implement `src/hooks/usePriceBoard.ts`**

```ts
import { useState, useMemo, useCallback } from 'react'
import { MOCK_STOCKS } from '../data/mockStocks'
import { sortStocks } from '../utils/sortStocks'
import type { Exchange, FilterType, SortColumn, SortDirection, StockQuote } from '../types/stock'

export function usePriceBoard() {
  const [activeExchange, setActiveExchange] = useState<Exchange>('HOSE')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL')
  const [sortCol, setSortCol] = useState<SortColumn>('ticker')
  const [sortDir, setSortDir] = useState<SortDirection>(null)
  const [seed, setSeed] = useState(0)

  const toggleSort = useCallback((col: SortColumn) => {
    if (sortCol !== col) {
      setSortCol(col)
      setSortDir('asc')
    } else {
      setSortDir(prev => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null))
    }
  }, [sortCol])

  const refresh = useCallback(() => setSeed(s => s + 1), [])

  const stocks = useMemo((): StockQuote[] => {
    void seed
    let result = MOCK_STOCKS.filter(s => s.exchange === activeExchange)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.ticker.toLowerCase().includes(q) ||
        s.companyName.toLowerCase().includes(q)
      )
    }

    if (activeFilter !== 'ALL') {
      result = result.filter(s => {
        switch (activeFilter) {
          case 'UP': return s.change > 0
          case 'DOWN': return s.change < 0
          case 'CEIL': return s.currentPrice >= s.ceilingPrice
          case 'FLOOR': return s.currentPrice <= s.floorPrice
          case 'REF': return s.change === 0
          default: return true
        }
      })
    }

    return sortStocks(result, sortCol, sortDir)
  }, [activeExchange, searchQuery, activeFilter, sortCol, sortDir, seed])

  return { stocks, activeExchange, setActiveExchange, sortCol, sortDir, toggleSort, searchQuery, setSearchQuery, activeFilter, setActiveFilter, refresh }
}
```

- [ ] **Step 4: Implement `src/hooks/useMarketSummary.ts`**

```ts
import { useMemo } from 'react'
import type { StockQuote } from '../types/stock'

export function useMarketSummary(stocks: StockQuote[]) {
  return useMemo(() => ({
    totalVolume: stocks.reduce((sum, s) => sum + s.volume, 0),
    countUp: stocks.filter(s => s.change > 0).length,
    countDown: stocks.filter(s => s.change < 0).length,
    countRef: stocks.filter(s => s.change === 0).length,
  }), [stocks])
}
```

- [ ] **Step 5: Chạy test xác nhận PASS**

```bash
npm run test -- usePriceBoard.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/hooks
git commit -m "feat: usePriceBoard và useMarketSummary hooks"
```

---

### Task 6: Shared Components (PriceCell, SortIcon, Badge)

**Files:**
- Create: `src/components/shared/PriceCell.tsx`
- Create: `src/components/shared/SortIcon.tsx`
- Create: `src/components/shared/Badge.tsx`
- Create: `src/components/shared/PriceCell.test.tsx`

**Interfaces:**
- Consumes: `getPriceColorClass` từ Task 2
- Produces:
  - `<PriceCell price ref ceil floor formatted? />` — ô giá có màu
  - `<SortIcon col sortCol sortDir />` — icon sort
  - `<Badge active onClick children />` — filter badge

- [ ] **Step 1: Viết failing tests cho PriceCell**

Tạo `src/components/shared/PriceCell.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceCell } from './PriceCell'

describe('PriceCell', () => {
  it('hiển thị giá trị được format', () => {
    render(<PriceCell price={105} ref={100} ceil={107} floor={93} formatted="105.00" />)
    expect(screen.getByText('105.00')).toBeInTheDocument()
  })

  it('có class màu tím khi giá = trần', () => {
    const { container } = render(
      <PriceCell price={107} ref={100} ceil={107} floor={93} formatted="107.00" />
    )
    expect(container.firstChild).toHaveClass('text-ceil')
  })

  it('có class màu đỏ khi giá < tham chiếu', () => {
    const { container } = render(
      <PriceCell price={95} ref={100} ceil={107} floor={93} formatted="95.00" />
    )
    expect(container.firstChild).toHaveClass('text-down')
  })
})
```

- [ ] **Step 2: Chạy test xác nhận FAIL**

```bash
npm run test -- PriceCell.test.tsx
```

- [ ] **Step 3: Implement `src/components/shared/PriceCell.tsx`**

```tsx
import { getPriceColorClass } from '../../utils/priceColor'

interface PriceCellProps {
  price: number
  ref: number
  ceil: number
  floor: number
  formatted?: string
}

export function PriceCell({ price, ref, ceil, floor, formatted }: PriceCellProps) {
  const colorClass = getPriceColorClass(price, ref, ceil, floor)
  return (
    <span className={`inline-block px-1 rounded text-right font-mono text-sm ${colorClass}`}>
      {formatted ?? price.toFixed(2)}
    </span>
  )
}
```

- [ ] **Step 4: Implement `src/components/shared/SortIcon.tsx`**

```tsx
import type { SortColumn, SortDirection } from '../../types/stock'

interface SortIconProps {
  col: SortColumn
  sortCol: SortColumn
  sortDir: SortDirection
}

export function SortIcon({ col, sortCol, sortDir }: SortIconProps) {
  if (sortCol !== col || sortDir === null) return <span className="ml-1 text-gray-600">⇅</span>
  return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
}
```

- [ ] **Step 5: Implement `src/components/shared/Badge.tsx`**

```tsx
interface BadgeProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function Badge({ active, onClick, children }: BadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
        active
          ? 'bg-blue-600 border-blue-500 text-white'
          : 'bg-transparent border-board-border text-gray-400 hover:border-gray-500'
      }`}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 6: Chạy test xác nhận PASS**

```bash
npm run test -- PriceCell.test.tsx
```

- [ ] **Step 7: Commit**

```bash
git add src/components/shared
git commit -m "feat: PriceCell, SortIcon, Badge shared components"
```

---

### Task 7: MarketOverview Component

**Files:**
- Create: `src/components/MarketOverview/IndexCard.tsx`
- Create: `src/components/MarketOverview/MarketOverview.tsx`
- Create: `src/components/MarketOverview/MarketOverview.test.tsx`

**Interfaces:**
- Consumes: `MOCK_INDEXES`, `MarketIndex`, `formatChange`, `formatPercent`, `formatVolume`
- Produces: `<MarketOverview />` — thanh 3 chỉ số thị trường

- [ ] **Step 1: Viết failing tests**

Tạo `src/components/MarketOverview/MarketOverview.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarketOverview } from './MarketOverview'

describe('MarketOverview', () => {
  it('hiển thị đủ 3 chỉ số: VN-Index, HNX-Index, UPCOM-Index', () => {
    render(<MarketOverview />)
    expect(screen.getByText('VN-Index')).toBeInTheDocument()
    expect(screen.getByText('HNX-Index')).toBeInTheDocument()
    expect(screen.getByText('UPCOM-Index')).toBeInTheDocument()
  })

  it('hiển thị giá trị VN-Index', () => {
    render(<MarketOverview />)
    expect(screen.getByText('1,285.43')).toBeInTheDocument()
  })

  it('IndexCard tăng có class text-up', () => {
    render(<MarketOverview />)
    const vnIndexCard = screen.getByText('VN-Index').closest('[data-testid]')
    expect(vnIndexCard).toHaveClass('text-up')
  })
})
```

- [ ] **Step 2: Chạy test xác nhận FAIL**

```bash
npm run test -- MarketOverview.test.tsx
```

- [ ] **Step 3: Implement `src/components/MarketOverview/IndexCard.tsx`**

```tsx
import type { MarketIndex } from '../../types/stock'
import { formatChange, formatPercent } from '../../utils/formatNumber'

interface IndexCardProps {
  index: MarketIndex
}

export function IndexCard({ index }: IndexCardProps) {
  const isUp = index.change > 0
  const isDown = index.change < 0
  const colorClass = isUp ? 'text-up' : isDown ? 'text-down' : 'text-ref'

  return (
    <div
      data-testid={`index-${index.name}`}
      className={`flex flex-col px-4 py-2 border-r border-board-border last:border-r-0 ${colorClass}`}
    >
      <span className="text-xs text-gray-400">{index.name}</span>
      <span className="text-lg font-bold">{index.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      <span className="text-xs">
        {formatChange(index.change)} ({formatPercent(index.changePercent)})
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Implement `src/components/MarketOverview/MarketOverview.tsx`**

```tsx
import { MOCK_INDEXES } from '../../data/mockIndexes'
import { IndexCard } from './IndexCard'

export function MarketOverview() {
  return (
    <div className="flex items-stretch bg-board-row border border-board-border rounded mb-3">
      {MOCK_INDEXES.map(idx => <IndexCard key={idx.name} index={idx} />)}
    </div>
  )
}
```

- [ ] **Step 5: Chạy test xác nhận PASS**

```bash
npm run test -- MarketOverview.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/components/MarketOverview
git commit -m "feat: MarketOverview component với 3 chỉ số thị trường"
```

---

### Task 8: ExchangeTabs & Toolbar

**Files:**
- Create: `src/components/PriceBoard/ExchangeTabs.tsx`
- Create: `src/components/PriceBoard/Toolbar.tsx`

**Interfaces:**
- Consumes: `Exchange`, `FilterType`, `FILTER_LABELS`, `Badge`
- Produces:
  - `<ExchangeTabs active onChange />` — 3 tab HOSE/HNX/UPCOM
  - `<Toolbar search onSearch filter onFilter onRefresh />` — thanh công cụ

- [ ] **Step 1: Implement `src/components/PriceBoard/ExchangeTabs.tsx`**

```tsx
import type { Exchange } from '../../types/stock'

const EXCHANGES: Exchange[] = ['HOSE', 'HNX', 'UPCOM']

interface ExchangeTabsProps {
  active: Exchange
  onChange: (e: Exchange) => void
}

export function ExchangeTabs({ active, onChange }: ExchangeTabsProps) {
  return (
    <div className="flex gap-1 mb-3">
      {EXCHANGES.map(ex => (
        <button
          key={ex}
          onClick={() => onChange(ex)}
          className={`px-4 py-2 text-sm font-semibold rounded-t transition-colors ${
            active === ex
              ? 'bg-blue-700 text-white border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white hover:bg-board-row'
          }`}
        >
          {ex}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Implement `src/components/PriceBoard/Toolbar.tsx`**

```tsx
import { FILTER_LABELS } from '../../constants/colors'
import { Badge } from '../shared/Badge'
import type { FilterType } from '../../types/stock'

const FILTERS = Object.keys(FILTER_LABELS) as FilterType[]

interface ToolbarProps {
  search: string
  onSearch: (v: string) => void
  filter: FilterType
  onFilter: (f: FilterType) => void
  onRefresh: () => void
}

export function Toolbar({ search, onSearch, filter, onFilter, onRefresh }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <input
        type="text"
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="Tìm mã CK hoặc công ty..."
        className="bg-board-row border border-board-border text-white text-sm px-3 py-1.5 rounded w-56 focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
      />
      <div className="flex gap-1 flex-wrap">
        {FILTERS.map(f => (
          <Badge key={f} active={filter === f} onClick={() => onFilter(f)}>
            {FILTER_LABELS[f]}
          </Badge>
        ))}
      </div>
      <button
        onClick={onRefresh}
        className="ml-auto px-3 py-1.5 text-xs bg-board-row border border-board-border text-gray-400 rounded hover:text-white hover:border-gray-500 transition-colors"
      >
        ↻ Làm mới
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PriceBoard/ExchangeTabs.tsx src/components/PriceBoard/Toolbar.tsx
git commit -m "feat: ExchangeTabs và Toolbar components"
```

---

### Task 9: StockTable & StockRow Components

**Files:**
- Create: `src/components/PriceBoard/StockRow.tsx`
- Create: `src/components/PriceBoard/StockTable.tsx`
- Create: `src/components/PriceBoard/PriceBoard.test.tsx`

**Interfaces:**
- Consumes: `StockQuote`, `SortColumn`, `SortDirection`, `PriceCell`, `SortIcon`, `formatPrice`, `formatChange`, `formatPercent`, `formatVolume`
- Produces:
  - `<StockRow stock />` — 1 hàng bảng giá
  - `<StockTable stocks sortCol sortDir onSort />` — bảng đầy đủ

- [ ] **Step 1: Viết failing tests**

Tạo `src/components/PriceBoard/PriceBoard.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StockTable } from './StockTable'
import type { StockQuote } from '../../types/stock'

const stocks: StockQuote[] = [
  {
    ticker: 'VNM', companyName: 'Vinamilk', exchange: 'HOSE',
    referencePrice: 75, ceilingPrice: 80.25, floorPrice: 69.75,
    open: 75, high: 78.5, low: 74, currentPrice: 78.5,
    change: 3.5, changePercent: 4.67, volume: 2_500_000,
  },
  {
    ticker: 'HPG', companyName: 'Hoa Phat', exchange: 'HOSE',
    referencePrice: 28.5, ceilingPrice: 30.5, floorPrice: 26.5,
    open: 28.5, high: 28.5, low: 26, currentPrice: 26,
    change: -2.5, changePercent: -8.77, volume: 5_300_000,
  },
]

describe('StockTable', () => {
  it('render đúng số hàng cổ phiếu', () => {
    render(<StockTable stocks={stocks} sortCol="ticker" sortDir={null} onSort={() => {}} />)
    expect(screen.getByText('VNM')).toBeInTheDocument()
    expect(screen.getByText('HPG')).toBeInTheDocument()
  })

  it('gọi onSort khi click header cột', () => {
    const onSort = vi.fn()
    render(<StockTable stocks={stocks} sortCol="ticker" sortDir={null} onSort={onSort} />)
    fireEvent.click(screen.getByText(/Giá/i))
    expect(onSort).toHaveBeenCalledWith('currentPrice')
  })

  it('hiển thị đúng màu cho cổ phiếu tăng', () => {
    render(<StockTable stocks={stocks} sortCol="ticker" sortDir={null} onSort={() => {}} />)
    const upCells = document.querySelectorAll('.text-up')
    expect(upCells.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Chạy test xác nhận FAIL**

```bash
npm run test -- PriceBoard.test.tsx
```

- [ ] **Step 3: Implement `src/components/PriceBoard/StockRow.tsx`**

```tsx
import type { StockQuote } from '../../types/stock'
import { PriceCell } from '../shared/PriceCell'
import { formatPrice, formatChange, formatPercent, formatVolume } from '../../utils/formatNumber'

interface StockRowProps {
  stock: StockQuote
  index: number
}

export function StockRow({ stock: s, index }: StockRowProps) {
  const isEven = index % 2 === 0
  const changeColor = s.change > 0 ? 'text-up' : s.change < 0 ? 'text-down' : 'text-ref'

  return (
    <tr className={`${isEven ? 'bg-board-row' : 'bg-board-row-alt'} hover:bg-blue-900/20 transition-colors`}>
      <td className="px-2 py-1 text-sm font-bold text-white sticky left-0 bg-inherit">{s.ticker}</td>
      <td className="px-2 py-1 text-xs text-gray-400 max-w-[180px] truncate">{s.companyName}</td>
      <td className="px-2 py-1 text-right"><PriceCell price={s.ceilingPrice} ref={s.referencePrice} ceil={s.ceilingPrice} floor={s.floorPrice} formatted={formatPrice(s.ceilingPrice)} /></td>
      <td className="px-2 py-1 text-right"><PriceCell price={s.referencePrice} ref={s.referencePrice} ceil={s.ceilingPrice} floor={s.floorPrice} formatted={formatPrice(s.referencePrice)} /></td>
      <td className="px-2 py-1 text-right"><PriceCell price={s.floorPrice} ref={s.referencePrice} ceil={s.ceilingPrice} floor={s.floorPrice} formatted={formatPrice(s.floorPrice)} /></td>
      <td className="px-2 py-1 text-right text-gray-300 text-sm">{formatPrice(s.open)}</td>
      <td className="px-2 py-1 text-right text-gray-300 text-sm">{formatPrice(s.high)}</td>
      <td className="px-2 py-1 text-right text-gray-300 text-sm">{formatPrice(s.low)}</td>
      <td className="px-2 py-1 text-right font-bold"><PriceCell price={s.currentPrice} ref={s.referencePrice} ceil={s.ceilingPrice} floor={s.floorPrice} formatted={formatPrice(s.currentPrice)} /></td>
      <td className={`px-2 py-1 text-right text-sm font-semibold ${changeColor}`}>{formatChange(s.change)}</td>
      <td className={`px-2 py-1 text-right text-sm font-semibold ${changeColor}`}>{formatPercent(s.changePercent)}</td>
      <td className="px-2 py-1 text-right text-gray-300 text-xs">{formatVolume(s.volume)}</td>
    </tr>
  )
}
```

- [ ] **Step 4: Implement `src/components/PriceBoard/StockTable.tsx`**

```tsx
import type { StockQuote, SortColumn, SortDirection } from '../../types/stock'
import { SortIcon } from '../shared/SortIcon'
import { StockRow } from './StockRow'

interface StockTableProps {
  stocks: StockQuote[]
  sortCol: SortColumn
  sortDir: SortDirection
  onSort: (col: SortColumn) => void
}

const HEADERS: { label: string; col: SortColumn; align: string }[] = [
  { label: 'Mã CK', col: 'ticker', align: 'text-left' },
  { label: 'Công ty', col: 'ticker', align: 'text-left' },
  { label: 'Trần', col: 'ticker', align: 'text-right' },
  { label: 'TC', col: 'referencePrice', align: 'text-right' },
  { label: 'Sàn', col: 'ticker', align: 'text-right' },
  { label: 'Mở cửa', col: 'open', align: 'text-right' },
  { label: 'Cao', col: 'high', align: 'text-right' },
  { label: 'Thấp', col: 'low', align: 'text-right' },
  { label: 'Giá', col: 'currentPrice', align: 'text-right' },
  { label: '+/-', col: 'change', align: 'text-right' },
  { label: '%', col: 'changePercent', align: 'text-right' },
  { label: 'KL Khớp', col: 'volume', align: 'text-right' },
]

export function StockTable({ stocks, sortCol, sortDir, onSort }: StockTableProps) {
  return (
    <div className="overflow-x-auto rounded border border-board-border">
      <table className="w-full border-collapse text-sm" aria-label="Bảng giá cổ phiếu">
        <thead className="bg-board-row border-b border-board-border sticky top-0 z-10">
          <tr>
            {HEADERS.map(h => (
              <th
                key={`${h.label}-${h.col}`}
                onClick={() => onSort(h.col)}
                className={`px-2 py-2 font-semibold text-gray-400 cursor-pointer hover:text-white select-none whitespace-nowrap ${h.align}`}
                aria-sort={sortCol === h.col ? (sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none') : 'none'}
              >
                {h.label}
                <SortIcon col={h.col} sortCol={sortCol} sortDir={sortDir} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.length === 0 ? (
            <tr>
              <td colSpan={HEADERS.length} className="py-8 text-center text-gray-600">
                Không có dữ liệu phù hợp
              </td>
            </tr>
          ) : (
            stocks.map((s, i) => <StockRow key={s.ticker} stock={s} index={i} />)
          )}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 5: Chạy test xác nhận PASS**

```bash
npm run test -- PriceBoard.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/components/PriceBoard/StockRow.tsx src/components/PriceBoard/StockTable.tsx src/components/PriceBoard/PriceBoard.test.tsx
git commit -m "feat: StockRow và StockTable components với màu sắc chuẩn"
```

---

### Task 10: BoardSummary & PriceBoard Container

**Files:**
- Create: `src/components/PriceBoard/BoardSummary.tsx`
- Create: `src/components/PriceBoard/PriceBoard.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: tất cả components và hooks đã tạo
- Produces: `<PriceBoard />` — container hoàn chỉnh, `<App />` tích hợp toàn bộ

- [ ] **Step 1: Implement `src/components/PriceBoard/BoardSummary.tsx`**

```tsx
import { formatVolume } from '../../utils/formatNumber'

interface BoardSummaryProps {
  totalVolume: number
  countUp: number
  countDown: number
  countRef: number
  total: number
}

export function BoardSummary({ totalVolume, countUp, countDown, countRef, total }: BoardSummaryProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-3 px-2 py-2 bg-board-row border border-board-border rounded text-xs text-gray-400">
      <span>Tổng: <strong className="text-white">{total}</strong> mã</span>
      <span>Tăng: <strong className="text-up">{countUp}</strong></span>
      <span>Giảm: <strong className="text-down">{countDown}</strong></span>
      <span>Đứng: <strong className="text-ref">{countRef}</strong></span>
      <span className="ml-auto">Tổng KL: <strong className="text-white">{formatVolume(totalVolume)}</strong></span>
    </div>
  )
}
```

- [ ] **Step 2: Implement `src/components/PriceBoard/PriceBoard.tsx`**

```tsx
import { usePriceBoard } from '../../hooks/usePriceBoard'
import { useMarketSummary } from '../../hooks/useMarketSummary'
import { ExchangeTabs } from './ExchangeTabs'
import { Toolbar } from './Toolbar'
import { StockTable } from './StockTable'
import { BoardSummary } from './BoardSummary'

export function PriceBoard() {
  const {
    stocks, activeExchange, setActiveExchange,
    sortCol, sortDir, toggleSort,
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    refresh,
  } = usePriceBoard()

  const summary = useMarketSummary(stocks)

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-lg font-bold text-white mb-3 tracking-wide">
        BẢNG GIÁ CHỨNG KHOÁN
      </h1>
      <ExchangeTabs active={activeExchange} onChange={setActiveExchange} />
      <Toolbar
        search={searchQuery}
        onSearch={setSearchQuery}
        filter={activeFilter}
        onFilter={setActiveFilter}
        onRefresh={refresh}
      />
      <StockTable
        stocks={stocks}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={toggleSort}
      />
      <BoardSummary
        {...summary}
        total={stocks.length}
      />
    </div>
  )
}
```

- [ ] **Step 3: Cập nhật `src/App.tsx`**

```tsx
import { MarketOverview } from './components/MarketOverview/MarketOverview'
import { PriceBoard } from './components/PriceBoard/PriceBoard'

export default function App() {
  return (
    <div className="min-h-screen bg-board-bg">
      <header className="px-4 pt-4">
        <MarketOverview />
      </header>
      <main>
        <PriceBoard />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Chạy toàn bộ tests**

```bash
npm run test
```
Expected: tất cả tests PASS

- [ ] **Step 5: Chạy dev server kiểm tra giao diện**

```bash
npm run dev
```
Kiểm tra:
- Thanh thị trường VN-Index/HNX-Index/UPCOM-Index hiển thị đúng màu
- Bảng giá tab HOSE có 20 mã, HNX có 20 mã, UPCOM có 20 mã
- Màu sắc cột giá đúng chuẩn (tím/xanh lá/đỏ/vàng/xanh lam)
- Tìm kiếm "VNM" lọc đúng
- Sort bằng click vào header cột
- Bộ lọc Tăng/Giảm/Trần/Sàn hoạt động

- [ ] **Step 6: Build kiểm tra production**

```bash
npm run build
```
Expected: build thành công, không có lỗi TypeScript

- [ ] **Step 7: Commit cuối**

```bash
git add .
git commit -m "feat: hoàn thành Phase 1 - bảng giá chứng khoán đầy đủ"
```

---

## Tổng Kết Phase 1

| Task | Mô tả | Output |
|------|-------|--------|
| 1 | Project scaffolding | Dự án chạy được |
| 2 | Types & color utils | Type-safe domain model |
| 3 | Format & sort utils | Tiện ích format số & sort |
| 4 | Mock data | 60 mã, 3 chỉ số |
| 5 | Custom hooks | Logic tách biệt khỏi UI |
| 6 | Shared components | PriceCell, SortIcon, Badge |
| 7 | MarketOverview | Thanh chỉ số thị trường |
| 8 | ExchangeTabs + Toolbar | Điều hướng & tìm kiếm |
| 9 | StockTable + StockRow | Bảng giá chính |
| 10 | BoardSummary + wiring | Tích hợp hoàn chỉnh |

**Phase 2 có thể tiếp nối:** Kết nối WebSocket real-time, thêm cột dư mua/dư bán, biểu đồ mini sparkline, watchlist cá nhân.

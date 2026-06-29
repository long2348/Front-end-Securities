# Phase 1 – Bảng Giá Chứng Khoán: Progress Tracker

**Plan:** [docs/superpowers/plans/2026-06-29-phase1-price-board.md](docs/superpowers/plans/2026-06-29-phase1-price-board.md)

---

## Task Status

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Project Scaffolding (Vite + React TS + TailwindCSS + Vitest) | ✅ Done | `590476a` |
| 2 | Types & Constants (`StockQuote`, `Exchange`, `getPriceColorClass`) | ✅ Done | `4f14f5e` |
| 3 | Utility Functions (`formatNumber`, `sortStocks`) | ⬜ Pending | — |
| 4 | Mock Data (60 stocks, 3 indexes) | ⬜ Pending | — |
| 5 | Custom Hooks (`usePriceBoard`, `useMarketSummary`) | ⬜ Pending | — |
| 6 | Shared Components (`PriceCell`, `SortIcon`, `Badge`) | ⬜ Pending | — |
| 7 | `MarketOverview` Component | ⬜ Pending | — |
| 8 | `ExchangeTabs` & `Toolbar` | ⬜ Pending | — |
| 9 | `StockTable` & `StockRow` | ⬜ Pending | — |
| 10 | `BoardSummary` & `PriceBoard` Container + App wiring | ⬜ Pending | — |

---

## Task 2 – Deliverables

**Completed:** 2026-06-29 | **Commits:** `4f14f5e` (types & utils), `pending` (integration tests)

**Files created:**

| File | Description |
|------|-------------|
| `src/types/stock.ts` | `Exchange`, `SortDirection`, `FilterType`, `SortColumn`, `StockQuote`, `MarketIndex` |
| `src/utils/priceColor.ts` | `getPriceColorClass(price, ref, ceil, floor)` — 5 color states |
| `src/constants/colors.ts` | `FILTER_LABELS` map (ALL / UP / DOWN / CEIL / FLOOR / REF) |
| `src/constants/colors.test.ts` | 5 unit tests — all passing ✅ |
| `test/integration/task2.integration.test.ts` | 10 integration tests — all passing ✅ |
| `docs/task-2-brief.md` | Task brief / specification |
| `docs/task-2-report.md` | Completion report |

**Test results:** 15/15 total — 5 unit + 10 integration, all PASS ✅

---

## Notes

- TypeScript strict mode enforced — no `any`
- Color convention: Tím (Trần) · Xanh lá (Tăng) · Đỏ (Giảm) · Vàng (Tham chiếu) · Xanh lam (Sàn)
- Exchange values: `'HOSE' | 'HNX' | 'UPCOM'`

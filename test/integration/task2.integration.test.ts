/**
 * Integration tests for Task 2: Types + Constants + getPriceColorClass
 *
 * These tests verify that StockQuote objects (typed via stock.ts) flow correctly
 * through getPriceColorClass and that FilterType values resolve to FILTER_LABELS.
 * Unit tests cover individual branches; these tests cover realistic data scenarios.
 */
import { describe, it, expect } from 'vitest'
import type { StockQuote, FilterType } from '../../src/types/stock'
import { getPriceColorClass } from '../../src/utils/priceColor'
import { FILTER_LABELS } from '../../src/constants/colors'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStock(
  ticker: string,
  ref: number,
  current: number,
  exchange: StockQuote['exchange'] = 'HOSE',
): StockQuote {
  const ceil = parseFloat((ref * 1.07).toFixed(2))
  const floor = parseFloat((ref * 0.93).toFixed(2))
  return {
    ticker,
    companyName: `${ticker} Corp`,
    exchange,
    referencePrice: ref,
    ceilingPrice: ceil,
    floorPrice: floor,
    open: ref,
    high: Math.max(ref, current),
    low: Math.min(ref, current),
    currentPrice: current,
    change: parseFloat((current - ref).toFixed(2)),
    changePercent: parseFloat(((current - ref) / ref * 100).toFixed(2)),
    volume: 1_000_000,
  }
}

// ---------------------------------------------------------------------------
// StockQuote → getPriceColorClass integration
// ---------------------------------------------------------------------------

describe('StockQuote + getPriceColorClass integration', () => {
  it('cổ phiếu đạt trần (ceiling) → màu tím', () => {
    const stock = makeStock('VHM', 35, parseFloat((35 * 1.07).toFixed(2)))
    const colorClass = getPriceColorClass(
      stock.currentPrice,
      stock.referencePrice,
      stock.ceilingPrice,
      stock.floorPrice,
    )
    expect(colorClass).toBe('text-ceil bg-ceil/10')
  })

  it('cổ phiếu chạm sàn (floor) → màu xanh lam', () => {
    const stock = makeStock('MWG', 55, parseFloat((55 * 0.93).toFixed(2)))
    const colorClass = getPriceColorClass(
      stock.currentPrice,
      stock.referencePrice,
      stock.ceilingPrice,
      stock.floorPrice,
    )
    expect(colorClass).toBe('text-floor bg-floor/10')
  })

  it('cổ phiếu tăng nhẹ → màu xanh lá', () => {
    const stock = makeStock('VNM', 75, 78.5)
    const colorClass = getPriceColorClass(
      stock.currentPrice,
      stock.referencePrice,
      stock.ceilingPrice,
      stock.floorPrice,
    )
    expect(colorClass).toBe('text-up')
  })

  it('cổ phiếu giảm → màu đỏ', () => {
    // 27 < ref(28.5) nhưng > floor(26.50) → text-down, không phải text-floor
    const stock = makeStock('HPG', 28.5, 27)
    const colorClass = getPriceColorClass(
      stock.currentPrice,
      stock.referencePrice,
      stock.ceilingPrice,
      stock.floorPrice,
    )
    expect(colorClass).toBe('text-down')
  })

  it('cổ phiếu đứng giá (tham chiếu) → màu vàng', () => {
    const stock = makeStock('VIC', 45, 45)
    const colorClass = getPriceColorClass(
      stock.currentPrice,
      stock.referencePrice,
      stock.ceilingPrice,
      stock.floorPrice,
    )
    expect(colorClass).toBe('text-ref')
  })

  it('danh sách hỗn hợp: mỗi cổ phiếu nhận đúng màu', () => {
    const cases: Array<{ stock: StockQuote; expected: string }> = [
      { stock: makeStock('A', 100, 107), expected: 'text-ceil bg-ceil/10' },
      { stock: makeStock('B', 100, 93),  expected: 'text-floor bg-floor/10' },
      { stock: makeStock('C', 100, 105), expected: 'text-up' },
      { stock: makeStock('D', 100, 95),  expected: 'text-down' },
      { stock: makeStock('E', 100, 100), expected: 'text-ref' },
    ]

    for (const { stock, expected } of cases) {
      expect(
        getPriceColorClass(stock.currentPrice, stock.referencePrice, stock.ceilingPrice, stock.floorPrice),
        `${stock.ticker}: giá ${stock.currentPrice}`,
      ).toBe(expected)
    }
  })
})

// ---------------------------------------------------------------------------
// FilterType → FILTER_LABELS integration
// ---------------------------------------------------------------------------

describe('FilterType + FILTER_LABELS integration', () => {
  const filterTypes: FilterType[] = ['ALL', 'UP', 'DOWN', 'CEIL', 'FLOOR', 'REF']

  it('mỗi FilterType đều có nhãn tiếng Việt trong FILTER_LABELS', () => {
    for (const type of filterTypes) {
      expect(FILTER_LABELS[type], `nhãn cho "${type}" phải tồn tại`).toBeDefined()
      expect(FILTER_LABELS[type].length, `nhãn cho "${type}" không được rỗng`).toBeGreaterThan(0)
    }
  })

  it('nhãn đúng nội dung cho từng FilterType', () => {
    expect(FILTER_LABELS['ALL']).toBe('Tất cả')
    expect(FILTER_LABELS['UP']).toBe('Tăng')
    expect(FILTER_LABELS['DOWN']).toBe('Giảm')
    expect(FILTER_LABELS['CEIL']).toBe('Trần')
    expect(FILTER_LABELS['FLOOR']).toBe('Sàn')
    expect(FILTER_LABELS['REF']).toBe('Tham chiếu')
  })

  it('số lượng nhãn khớp với số lượng FilterType', () => {
    const labelKeys = Object.keys(FILTER_LABELS)
    expect(labelKeys).toHaveLength(filterTypes.length)
  })
})

// ---------------------------------------------------------------------------
// Exchange type integration
// ---------------------------------------------------------------------------

describe('Exchange type integration', () => {
  it('StockQuote trên ba sàn đều nhận màu đúng', () => {
    const exchanges: StockQuote['exchange'][] = ['HOSE', 'HNX', 'UPCOM']

    for (const exchange of exchanges) {
      const rising = makeStock('XX', 100, 103, exchange)
      const colorClass = getPriceColorClass(
        rising.currentPrice,
        rising.referencePrice,
        rising.ceilingPrice,
        rising.floorPrice,
      )
      expect(colorClass, `sàn ${exchange}: cổ phiếu tăng phải xanh lá`).toBe('text-up')
    }
  })
})

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

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

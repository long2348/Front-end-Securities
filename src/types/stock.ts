export type Exchange = 'HOSE' | 'HNX' | 'UPCOM'
export type SortDirection = 'asc' | 'desc' | null
export type FilterType = 'ALL' | 'UP' | 'DOWN' | 'CEIL' | 'FLOOR' | 'REF'

export interface StockQuote {
  ticker: string
  companyName: string
  exchange: Exchange
  referencePrice: number
  ceilingPrice: number
  floorPrice: number
  open: number
  high: number
  low: number
  currentPrice: number
  change: number
  changePercent: number
  volume: number
}

export type SortColumn = keyof Pick<
  StockQuote,
  'ticker' | 'currentPrice' | 'change' | 'changePercent' | 'volume' |
  'open' | 'high' | 'low' | 'referencePrice'
>

export interface MarketIndex {
  name: string
  value: number
  change: number
  changePercent: number
  volume: number
}

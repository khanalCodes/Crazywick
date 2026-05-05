import { NextResponse } from 'next/server'

const SYMBOLS = [
  { label: 'S&P 500', symbol: 'SPX' },
  { label: 'Nasdaq', symbol: 'NDX' },
  { label: 'Dow Jones', symbol: 'DJI' },
  { label: 'Bitcoin', symbol: 'BINANCE:BTCUSDT' },
  { label: 'Ethereum', symbol: 'BINANCE:ETHUSDT' },
  { label: 'Apple', symbol: 'AAPL' },
  { label: 'Nvidia', symbol: 'NVDA' },
  { label: 'Meta', symbol: 'META' },
  { label: 'Google', symbol: 'GOOGL' },
  { label: 'Microsoft', symbol: 'MSFT' },
  { label: 'Tesla', symbol: 'TSLA' },
  { label: 'Amazon', symbol: 'AMZN' },
  { label: 'Berkshire', symbol: 'BRK.B' },
]

const API_KEY = process.env.FINNHUB_API_KEY

export async function GET() {
  const results = await Promise.all(
    SYMBOLS.map(async (s) => {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${s.symbol}&token=${API_KEY}`,
          { next: { revalidate: 60 } }
        )
        const json = await res.json()
        const price = json?.c  // current price
        const prev = json?.pc  // previous close
        const change = price && prev ? ((price - prev) / prev) * 100 : null

        return {
          label: s.label,
          price: price ? price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--',
          change: change !== null ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%` : '--',
          up: (change ?? 0) >= 0,
        }
      } catch {
        return { label: s.label, price: '--', change: '--', up: true }
      }
    })
  )
  return NextResponse.json(results)
}
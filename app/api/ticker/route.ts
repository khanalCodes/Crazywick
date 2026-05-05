import { NextResponse } from 'next/server'

const SYMBOLS = [
  { label: 'S&P 500', symbol: 'SPX', type: 'index' },
  { label: 'Nasdaq', symbol: 'NDX', type: 'index' },
  { label: 'Dow Jones', symbol: 'DJI', type: 'index' },
  { label: 'Bitcoin', symbol: 'BINANCE:BTCUSDT', type: 'crypto' },
  { label: 'Ethereum', symbol: 'BINANCE:ETHUSDT', type: 'crypto' },
  { label: 'Apple', symbol: 'AAPL', type: 'stock' },
  { label: 'Nvidia', symbol: 'NVDA', type: 'stock' },
  { label: 'Gold', symbol: 'OANDA:XAUUSD', type: 'forex' },
  { label: 'Silver', symbol: 'OANDA:XAGUSD', type: 'forex' },
  { label: 'EUR/USD', symbol: 'OANDA:EUR_USD', type: 'forex' },
  { label: 'GBP/USD', symbol: 'OANDA:GBP_USD', type: 'forex' },
  { label: 'USD/JPY', symbol: 'OANDA:USD_JPY', type: 'forex' },
  { label: 'USD/INR', symbol: 'OANDA:USD_INR', type: 'forex' },
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
import { NextResponse } from 'next/server'

const SYMBOLS = [
  { label: 'S&P 500', yahoo: '%5EGSPC' },
  { label: 'Nasdaq', yahoo: '%5EIXIC' },
  { label: 'Dow Jones', yahoo: '%5EDJI' },
  { label: 'Nifty 50', yahoo: '%5ENSEI' },
  { label: 'Bank Nifty', yahoo: '%5ENSEBANK' },
  { label: 'Bitcoin', yahoo: 'BTC-USD' },
  { label: 'Ethereum', yahoo: 'ETH-USD' },
  { label: 'Gold', yahoo: 'GC%3DF' },
  { label: 'Silver', yahoo: 'SI%3DF' },
  { label: 'Crude Oil', yahoo: 'CL%3DF' },
  { label: 'Nat Gas', yahoo: 'NG%3DF' },
  { label: 'Copper', yahoo: 'HG%3DF' },
  { label: 'USD/NPR', yahoo: 'NPR%3DX' },
  { label: 'USD/INR', yahoo: 'INR%3DX' },
  { label: 'EUR/USD', yahoo: 'EURUSD%3DX' },
  { label: 'GBP/USD', yahoo: 'GBPUSD%3DX' },
  { label: 'USD/JPY', yahoo: 'JPY%3DX' },
  { label: 'Apple', yahoo: 'AAPL' },
  { label: 'Nvidia', yahoo: 'NVDA' },
]

export async function GET() {
  const results = await Promise.all(
    SYMBOLS.map(async (s) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${s.yahoo}?interval=1d&range=1d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'application/json',
            },
            next: { revalidate: 60 },
          }
        )
        const json = await res.json()
        const meta = json?.chart?.result?.[0]?.meta
        const price = meta?.regularMarketPrice
        const prev = meta?.chartPreviousClose ?? meta?.previousClose
        const change = price && prev ? ((price - prev) / prev) * 100 : null
        return {
          label: s.label,
          price: price ? price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—',
          change: change !== null ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}%` : '—',
          up: (change ?? 0) >= 0,
        }
      } catch {
        return { label: s.label, price: '—', change: '—', up: true }
      }
    })
  )
  return NextResponse.json(results)
}
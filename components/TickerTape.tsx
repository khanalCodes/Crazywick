'use client'
import { useEffect, useState } from 'react'

const SYMBOLS = [
  { label: 'S&P 500',    yahoo: '%5EGSPC' },
  { label: 'Nasdaq',     yahoo: '%5EIXIC' },
  { label: 'Dow Jones',  yahoo: '%5EDJI' },
  { label: 'Nifty 50',   yahoo: '%5ENSEI' },
  { label: 'Bank Nifty', yahoo: '%5ENSEBANK' },
  { label: 'Bitcoin',    yahoo: 'BTC-USD' },
  { label: 'Ethereum',   yahoo: 'ETH-USD' },
  { label: 'Gold',       yahoo: 'GC%3DF' },
  { label: 'Silver',     yahoo: 'SI%3DF' },
  { label: 'Crude Oil',  yahoo: 'CL%3DF' },
  { label: 'Nat Gas',    yahoo: 'NG%3DF' },
  { label: 'Copper',     yahoo: 'HG%3DF' },
  { label: 'USD/NPR',    yahoo: 'NPR%3DX' },
  { label: 'USD/INR',    yahoo: 'INR%3DX' },
  { label: 'EUR/USD',    yahoo: 'EURUSD%3DX' },
  { label: 'GBP/USD',    yahoo: 'GBPUSD%3DX' },
  { label: 'USD/JPY',    yahoo: 'JPY%3DX' },
  { label: 'Apple',      yahoo: 'AAPL' },
  { label: 'Nvidia',     yahoo: 'NVDA' },
]

type TickerItem = {
  label: string
  price: string
  change: string
  up: boolean
}

export default function TickerTape() {
  const [tickers, setTickers] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchPrices() {
    try {
      const results: TickerItem[] = await Promise.all(
        SYMBOLS.map(async (s) => {
          try {
            const res = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${s.yahoo}?interval=1d&range=1d`,
              { headers: { 'Accept': 'application/json' } }
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
      setTickers(results)
    } catch {
      console.error('Ticker fetch failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const items = loading
    ? Array(10).fill({ label: '...', price: '—', change: '—', up: true })
    : [...tickers, ...tickers]

  return (
    <div style={{
      background: '#f7f6f3',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      overflow: 'hidden',
      height: '42px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          align-items: center;
          animation: ticker 60s linear infinite;
          width: max-content;
        }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="ticker-track">
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0 20px', borderRight: '1px solid rgba(0,0,0,0.07)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a18', letterSpacing: '0.03em' }}>
              {item.label}
            </span>
            <span style={{ fontSize: '12px', color: '#444', fontVariantNumeric: 'tabular-nums' }}>
              {item.price}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: item.up ? '#1D9E75' : '#E24B4A' }}>
              {item.up ? '▲' : '▼'} {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
'use client'
import { useEffect, useState } from 'react'

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
      const res = await fetch('/api/ticker')
      const results = await res.json()
      setTickers(results)
    } catch {
      console.error('Ticker fetch failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const items = loading
    ? Array(10).fill({ label: '...', price: '-', change: '-', up: true })
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
'use client'
import { useState } from 'react'

const CHARTS = [
  {
    asset: 'S&P 500',
    symbol: 'SPX',
    embedUrl: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_spx&symbol=FOREXCOM%3ASPXUSD&interval=D&theme=light&style=1&locale=en',
    note: 'Paste your published TradingView chart URL here after you publish your analysis.',
  },
  {
    asset: 'Bitcoin',
    symbol: 'BTC',
    embedUrl: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_btc&symbol=BITSTAMP%3ABTCUSD&interval=D&theme=light&style=1&locale=en',
    note: 'Paste your published TradingView chart URL here after you publish your analysis.',
  },
  {
    asset: 'Gold',
    symbol: 'GOLD',
    embedUrl: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_gold&symbol=FOREXCOM%3AGOLD&interval=D&theme=light&style=1&locale=en',
    note: '',
  },
  {
    asset: 'Nifty 50',
    symbol: 'NIFTY',
    embedUrl: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_nifty&symbol=NSE%3ANIFTY&interval=D&theme=light&style=1&locale=en',
    note: '',
  },
  {
    asset: 'Nasdaq',
    symbol: 'NDX',
    embedUrl: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_ndx&symbol=FOREXCOM%3ANSXUSD&interval=D&theme=light&style=1&locale=en',
    note: '',
  },
  {
    asset: 'USD/NPR',
    symbol: 'USDNPR',
    embedUrl: 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_usdnpr&symbol=FX_IDC%3AUSDNPR&interval=D&theme=light&style=1&locale=en',
    note: '',
  },
]

export default function AnalysisPage() {
  const [selected, setSelected] = useState(CHARTS[0])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
          Live charts · My drawings & analysis
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Chart Analysis
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '14px', lineHeight: 1.7, maxWidth: '520px' }}>
          My live technical analysis — support/resistance levels, trend lines, and key zones drawn directly on the chart. Updated before every major prediction.
        </p>
      </div>

      {/* Asset selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CHARTS.map(c => (
          <button
            key={c.symbol}
            onClick={() => setSelected(c)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: selected.symbol === c.symbol
                ? '1px solid #1D9E75'
                : '1px solid rgba(0,0,0,0.1)',
              background: selected.symbol === c.symbol ? '#f0faf6' : '#fff',
              color: selected.symbol === c.symbol ? '#0F6E56' : '#6b6b63',
              fontSize: '13px',
              fontWeight: selected.symbol === c.symbol ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
            }}
          >
            {c.asset}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        background: '#f7f6f3',
      }}>
        <iframe
          key={selected.symbol}
          src={selected.embedUrl}
          style={{ width: '100%', height: '520px', border: 'none', display: 'block' }}
          allowTransparency
          allowFullScreen
        />
      </div>

      {/* Analysis note */}
      <div style={{
        background: '#f7f6f3',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '12px',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0' }}>
            My analysis — {selected.asset}
          </p>
          <span style={{
            fontSize: '11px', background: '#f0faf6',
            color: '#1D9E75', padding: '3px 10px', borderRadius: '20px', fontWeight: 500,
          }}>
            Updated live
          </span>
        </div>
        <p style={{ fontSize: '14px', color: '#6b6b63', lineHeight: 1.7, fontStyle: 'italic' }}>
          {selected.note || `To add your analysis for ${selected.asset}: publish your chart on TradingView, paste the embed URL in the CHARTS array in app/analysis/page.tsx, and add your written notes here.`}
        </p>
      </div>

      {/* How to update guide */}
      <div style={{
        background: '#fffbf0',
        border: '1px solid rgba(245,166,35,0.2)',
        borderRadius: '10px',
        padding: '1rem 1.5rem',
      }}>
        <p style={{ fontSize: '12px', color: '#92400E', fontWeight: 500, marginBottom: '4px' }}>
          📌 How to update your chart analysis
        </p>
        <p style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.6 }}>
          1. Draw on TradingView → click Share → Publish Chart → copy embed URL
          &nbsp;&nbsp;2. Open <code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>app/analysis/page.tsx</code>
          &nbsp;&nbsp;3. Replace the <code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>embedUrl</code> for that asset
          &nbsp;&nbsp;4. Add your written notes in the <code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>note</code> field
          &nbsp;&nbsp;5. git push → live in 30 seconds
        </p>
      </div>
    </div>
  )
}
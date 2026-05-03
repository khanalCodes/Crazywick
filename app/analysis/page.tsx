'use client'
import { useState } from 'react'
import Image from 'next/image'

const CHARTS = [
  {
    asset: 'S&P 500',
    symbol: 'SPX',
    bias: 'bearish' as const,
    lastUpdated: '2026-05-03',
    image: null, // replace with '/analysis/spx.png' after uploading screenshot
    keyLevels: {
      support: ['4,950', '5,000'],
      resistance: ['5,250', '5,400'],
    },
    thesis: 'Breadth is deteriorating — less than 40% of S&P components are above their 50-day MA even as the index holds near highs. This classic divergence, combined with widening high-yield spreads, points to a retest of the 5,000 level before any sustained rally. I am watching for a break below 5,100 to confirm.',
    watchFor: 'Break below 5,100 confirms thesis. Close above 5,400 with volume invalidates.',
  },
  {
    asset: 'Bitcoin',
    symbol: 'BTC',
    bias: 'bullish' as const,
    lastUpdated: '2026-05-01',
    image: null,
    keyLevels: {
      support: ['88,000', '82,000'],
      resistance: ['98,000', '105,000'],
    },
    thesis: 'BTC is consolidating above the key 88k support after a strong Q1. The weekly structure remains bullish — higher lows intact. Institutional accumulation visible in on-chain data. Looking for a breakout above 98k to target the 105k-110k range.',
    watchFor: 'Weekly close above 98k = long signal. Drop below 82k = reassess.',
  },
  {
    asset: 'Gold',
    symbol: 'GOLD',
    bias: 'bullish' as const,
    lastUpdated: '2026-04-28',
    image: null,
    keyLevels: {
      support: ['2,280', '2,200'],
      resistance: ['2,400', '2,500'],
    },
    thesis: 'Central bank buying remains the structural floor. Gold has broken out of a multi-year consolidation — this is not a trade, it is a regime change. Every pullback to the 2,280-2,300 zone is an accumulation opportunity.',
    watchFor: 'Hold above 2,280 = bullish. Monthly close below 2,200 = caution.',
  },
  {
    asset: 'Nifty 50',
    symbol: 'NIFTY',
    bias: 'neutral' as const,
    lastUpdated: '2026-04-25',
    image: null,
    keyLevels: {
      support: ['21,500', '20,800'],
      resistance: ['23,000', '24,000'],
    },
    thesis: 'Nifty is range-bound between 21,500 and 23,000. FII flows have been inconsistent. Waiting for a clear directional break before taking a strong view. Domestic consumption stocks look stronger than IT within this range.',
    watchFor: 'Break above 23,000 = bullish. Break below 21,500 = bearish.',
  },
  {
    asset: 'Nasdaq',
    symbol: 'NDX',
    bias: 'bearish' as const,
    lastUpdated: '2026-04-22',
    image: null,
    keyLevels: {
      support: ['17,500', '16,800'],
      resistance: ['19,000', '20,000'],
    },
    thesis: 'Tech valuations remain stretched relative to rates. The AI trade has concentrated risk in 5-6 names. If rates stay higher for longer, the multiple compression story plays out. Watching 17,500 as the key level.',
    watchFor: 'Break below 17,500 = short signal. Fed pivot = invalidation.',
  },
  {
    asset: 'USD/NPR',
    symbol: 'USDNPR',
    bias: 'neutral' as const,
    lastUpdated: '2026-04-20',
    image: null,
    keyLevels: {
      support: ['132', '130'],
      resistance: ['135', '137'],
    },
    thesis: 'NPR closely tracks INR given the pegged relationship. Dollar strength globally keeps upward pressure on the pair. Remittance flows provide some support for NPR. Range-bound between 132-135 near term.',
    watchFor: 'USD weakness globally = NPR strengthens. Watch Fed signals.',
  },
]

const BIAS_CONFIG = {
  bullish: { label: '▲ Bullish', color: '#1D9E75', bg: '#f0faf6', border: '#c3e9d8' },
  bearish: { label: '▼ Bearish', color: '#E24B4A', bg: '#fef2f2', border: '#fecaca' },
  neutral: { label: '◆ Neutral', color: '#92400E', bg: '#fffbf0', border: '#fde68a' },
}

export default function AnalysisPage() {
  const [selected, setSelected] = useState(CHARTS[0])
  const bias = BIAS_CONFIG[selected.bias]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
          Technical analysis · My views
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Chart Analysis
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '14px', lineHeight: 1.7, maxWidth: '500px' }}>
          My technical analysis on key assets — key levels, bias, and thesis. Screenshots updated after every major analysis session on TradingView.
        </p>
      </div>

      {/* Asset tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {CHARTS.map(c => (
          <button
            key={c.symbol}
            onClick={() => setSelected(c)}
            style={{
              padding: '7px 18px',
              borderRadius: '20px',
              border: selected.symbol === c.symbol ? '1px solid #1D9E75' : '1px solid rgba(0,0,0,0.1)',
              background: selected.symbol === c.symbol ? '#f0faf6' : '#fff',
              color: selected.symbol === c.symbol ? '#0F6E56' : '#6b6b63',
              fontSize: '13px',
              fontWeight: selected.symbol === c.symbol ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              transition: 'all 0.15s',
            }}
          >
            {c.asset}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left — chart screenshot */}
        <div>
          <div style={{
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '14px',
            overflow: 'hidden',
            background: '#f7f6f3',
            aspectRatio: '16/10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {selected.image ? (
              <img
                src={selected.image}
                alt={`${selected.asset} analysis`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a18', marginBottom: '0.5rem' }}>
                  {selected.asset} Chart
                </p>
                <p style={{ fontSize: '12px', color: '#aaa9a0', lineHeight: 1.6, maxWidth: '260px' }}>
                  Draw your analysis on TradingView → take a screenshot → save as{' '}
                  <code style={{ background: '#e8e6e0', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>
                    public/{selected.symbol.toLowerCase()}.png
                  </code>
                </p>
              </div>
            )}
          </div>

          {/* Key levels */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '10px', marginTop: '1rem',
          }}>
            <div style={{
              background: '#f0faf6', border: '1px solid #c3e9d8',
              borderRadius: '10px', padding: '1rem',
            }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '0.5rem' }}>
                Support
              </p>
              {selected.keyLevels.support.map(l => (
                <p key={l} style={{ fontSize: '14px', fontWeight: 600, color: '#1D9E75', fontVariantNumeric: 'tabular-nums' }}>
                  {l}
                </p>
              ))}
            </div>
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '10px', padding: '1rem',
            }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#991B1B', marginBottom: '0.5rem' }}>
                Resistance
              </p>
              {selected.keyLevels.resistance.map(l => (
                <p key={l} style={{ fontSize: '14px', fontWeight: 600, color: '#E24B4A', fontVariantNumeric: 'tabular-nums' }}>
                  {l}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right — analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Bias */}
          <div style={{
            background: bias.bg, border: `1px solid ${bias.border}`,
            borderRadius: '12px', padding: '1rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '4px' }}>
                Current bias
              </p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: bias.color, fontFamily: 'var(--serif)' }}>
                {bias.label}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', color: '#aaa9a0', marginBottom: '2px' }}>Last updated</p>
              <p style={{ fontSize: '12px', color: '#6b6b63', fontWeight: 500 }}>{selected.lastUpdated}</p>
            </div>
          </div>

          {/* Thesis */}
          <div style={{
            background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: '12px', padding: '1.25rem',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
              My thesis
            </p>
            <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.75 }}>
              {selected.thesis}
            </p>
          </div>

          {/* Watch for */}
          <div style={{
            background: '#fffbf0', border: '1px solid #fde68a',
            borderRadius: '12px', padding: '1.25rem',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#92400E', marginBottom: '0.75rem' }}>
              ⚡ Watch for
            </p>
            <p style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.7 }}>
              {selected.watchFor}
            </p>
          </div>

          {/* Disclaimer */}
          <p style={{ fontSize: '11px', color: '#aaa9a0', lineHeight: 1.6, padding: '0 0.25rem' }}>
            This is my personal analysis for documentation purposes. Not financial advice. Always do your own research.
          </p>
        </div>
      </div>

      {/* How to add screenshot */}
      <div style={{
        marginTop: '2.5rem', background: '#f7f6f3',
        border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px',
        padding: '1rem 1.5rem',
      }}>
        <p style={{ fontSize: '12px', color: '#6b6b63', fontWeight: 500, marginBottom: '4px' }}>
          📌 To update your chart screenshot
        </p>
        <p style={{ fontSize: '12px', color: '#aaa9a0', lineHeight: 1.6 }}>
          Draw on TradingView → screenshot → save to <code style={{ background: '#e8e6e0', padding: '1px 4px', borderRadius: '3px' }}>public/spx.png</code> (or btc.png, gold.png etc.) → update the <code style={{ background: '#e8e6e0', padding: '1px 4px', borderRadius: '3px' }}>image</code> field in the CHARTS array → git push
        </p>
      </div>
    </div>
  )
}
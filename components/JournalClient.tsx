'use client'

import { useState } from 'react'

type Entry = {
  id: string
  asset: string
  market: string
  direction: string
  result: string | null
  entryPrice: number
  exitPrice: number | null
  stopLoss: number | null
  takeProfit: number | null
  pnl: number | null
  reasoning: string | null
  mistakes: string | null
  lessons: string | null
  psychology: string | null
  setup: string | null
  openedAt: string
  closedAt: string | null
}

const RESULT_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  WIN:       { color: '#1D9E75', bg: '#f0faf6', border: '#c3e9d8' },
  LOSS:      { color: '#E24B4A', bg: '#fef2f2', border: '#fecaca' },
  BREAKEVEN: { color: '#92400E', bg: '#fffbf0', border: '#fde68a' },
  OPEN:      { color: '#c07a00', bg: '#fff8e6', border: '#fde68a' },
}

export default function JournalClient({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div style={{
        padding: '64px 24px', textAlign: 'center',
        border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14,
        background: '#f7f6f3',
      }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📒</p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 600, color: '#1a1a18', marginBottom: 6 }}>
          No journal entries yet
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#aaa9a0' }}>
          Trades will appear here once added from the admin panel.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {entries.map((entry, i) => (
        <JournalBlock key={entry.id || `entry-${i}`} entry={entry} />
      ))}
    </div>
  )
}

function JournalBlock({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false)

  const directionColor = entry.direction === 'LONG' || entry.direction === 'long' ? '#1D9E75' : '#E24B4A'
  const resultKey = entry.result ?? (entry.closedAt ? 'BREAKEVEN' : 'OPEN')
  const resultStyle = RESULT_STYLES[resultKey] ?? RESULT_STYLES.OPEN
  const pnlColor = entry.pnl === null ? '#aaa9a0' : entry.pnl >= 0 ? '#1D9E75' : '#E24B4A'

  return (
    <div style={{
      border: '1px solid rgba(0,0,0,0.08)',
      borderLeft: `3px solid ${directionColor}`,
      borderRadius: 12,
      padding: '20px 24px',
      background: '#fff',
    }}>

      {/* TOP ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <strong style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#1a1a18' }}>
            {entry.asset}
          </strong>
          <span style={{ fontSize: 11, fontWeight: 700, color: directionColor, fontFamily: 'var(--sans)', letterSpacing: '0.05em' }}>
            {entry.direction.toUpperCase()}
          </span>
          <span style={{ fontSize: 11, color: '#aaa9a0', fontFamily: 'var(--sans)' }}>
            {entry.market}
          </span>
          {entry.result && (
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
              background: resultStyle.bg, color: resultStyle.color,
              border: `1px solid ${resultStyle.border}`,
              fontFamily: 'var(--sans)',
            }}>
              {resultKey}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {entry.pnl !== null && (
            <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: pnlColor }}>
              {entry.pnl >= 0 ? '+' : ''}{entry.pnl.toFixed(2)}%
            </span>
          )}
          <button
            onClick={() => setOpen(!open)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.1)',
              background: open ? '#1D9E75' : '#f7f6f3',
              color: open ? '#fff' : '#1a1a18',
              fontSize: 20, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease', flexShrink: 0,
            }}
          >
            {open ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* PRICE ROW */}
      <div style={{ display: 'flex', gap: 20, marginTop: 10, fontSize: 13, color: '#6b6b63', fontFamily: 'var(--sans)', flexWrap: 'wrap' }}>
        <span>Entry: <strong style={{ color: '#1a1a18' }}>{entry.entryPrice}</strong></span>
        {entry.exitPrice && <span>Exit: <strong style={{ color: '#1a1a18' }}>{entry.exitPrice}</strong></span>}
        {entry.stopLoss && <span>SL: <strong style={{ color: '#E24B4A' }}>{entry.stopLoss}</strong></span>}
        {entry.takeProfit && <span>TP: <strong style={{ color: '#1D9E75' }}>{entry.takeProfit}</strong></span>}
        <span style={{ marginLeft: 'auto', color: '#aaa9a0' }}>
          {new Date(entry.openedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {entry.closedAt && ` → ${new Date(entry.closedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        </span>
      </div>

      {/* EXPANDED */}
      {open && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entry.setup && <Section label="Setup" value={entry.setup} />}
          {entry.reasoning && <Section label="Reasoning" value={entry.reasoning} />}
          {entry.psychology && <Section label="Psychology" value={entry.psychology} color="#6b6b63" />}
          {entry.mistakes && <Section label="Mistakes" value={entry.mistakes} color="#E24B4A" bg="#fef2f2" border="#fecaca" />}
          {entry.lessons && <Section label="Lessons" value={entry.lessons} color="#0F6E56" bg="#f0faf6" border="#c3e9d8" />}
        </div>
      )}
    </div>
  )
}

function Section({
  label, value, color = '#333', bg = '#f7f6f3', border = 'rgba(0,0,0,0.07)',
}: {
  label: string
  value: string
  color?: string
  bg?: string
  border?: string
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '12px 14px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: 6, fontFamily: 'var(--sans)' }}>
        {label}
      </p>
      <p style={{ fontSize: 14, color, lineHeight: 1.7, margin: 0, fontFamily: 'var(--sans)' }}>
        {value}
      </p>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Image from 'next/image'

type Analysis = {
  id: string
  asset: string
  symbol: string
  bias: string
  thesis: string
  watchFor: string
  imageUrl: string | null
  supportLevels: string[]
  resistanceLevels: string[]
  createdAt: string
}

const BIAS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  BULLISH:          { label: '▲ Bullish',          color: '#1D9E75', bg: '#f0faf6', border: '#c3e9d8' },
  BEARISH:          { label: '▼ Bearish',          color: '#E24B4A', bg: '#fef2f2', border: '#fecaca' },
  NEUTRAL:          { label: '◆ Neutral',          color: '#92400E', bg: '#fffbf0', border: '#fde68a' },
  STRONGLY_BULLISH: { label: '▲▲ Strongly Bullish', color: '#0F6E56', bg: '#f0faf6', border: '#c3e9d8' },
  STRONGLY_BEARISH: { label: '▼▼ Strongly Bearish', color: '#991B1B', bg: '#fef2f2', border: '#fecaca' },
}

export default function AnalysisClient({ analyses }: { analyses: Analysis[] }) {
  const [selected, setSelected] = useState(analyses[0])
  const bias = BIAS_CONFIG[selected.bias] ?? BIAS_CONFIG.NEUTRAL

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {analyses.map(a => (
          <button
            key={a.id}
            onClick={() => setSelected(a)}
            style={{
              padding: '7px 18px',
              borderRadius: '20px',
              border: selected.id === a.id ? '1px solid #1D9E75' : '1px solid rgba(0,0,0,0.1)',
              background: selected.id === a.id ? '#f0faf6' : '#fff',
              color: selected.id === a.id ? '#0F6E56' : '#6b6b63',
              fontSize: '13px',
              fontWeight: selected.id === a.id ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
            }}
          >
            {a.asset}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div style={{
            border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px',
            overflow: 'hidden', background: '#f7f6f3', aspectRatio: '16/10',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            {selected.imageUrl ? (
              <Image src={selected.imageUrl} alt={`${selected.asset} analysis`} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a18' }}>{selected.asset} Chart</p>
                <p style={{ fontSize: '12px', color: '#aaa9a0', lineHeight: 1.6 }}>No screenshot uploaded yet.</p>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1rem' }}>
            <div style={{ background: '#f0faf6', border: '1px solid #c3e9d8', borderRadius: '10px', padding: '1rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '0.5rem' }}>
                Support
              </p>
              {selected.supportLevels.map((l: string) => (
                <p key={l} style={{ fontSize: '14px', fontWeight: 600, color: '#1D9E75' }}>{l}</p>
              ))}
            </div>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#991B1B', marginBottom: '0.5rem' }}>
                Resistance
              </p>
              {selected.resistanceLevels.map((l: string) => (
                <p key={l} style={{ fontSize: '14px', fontWeight: 600, color: '#E24B4A' }}>{l}</p>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              <p style={{ fontSize: '12px', color: '#6b6b63', fontWeight: 500 }}>
                {new Date(selected.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div style={{ background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
              My thesis
            </p>
            <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.75 }}>{selected.thesis}</p>
          </div>

          {selected.watchFor && (
            <div style={{ background: '#fffbf0', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.25rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#92400E', marginBottom: '0.75rem' }}>
                ⚡ Watch for
              </p>
              <p style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.7 }}>{selected.watchFor}</p>
            </div>
          )}

          <p style={{ fontSize: '11px', color: '#aaa9a0', lineHeight: 1.6, padding: '0 0.25rem' }}>
            Personal analysis for documentation only. Not financial advice.
          </p>
        </div>
      </div>
    </>
  )
}
import { getAllPredictions } from '@/lib/articles'
import Link from 'next/link'

function DirectionBadge({ dir }: { dir: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    bullish: { label: '▲ Bullish', color: '#1D9E75', bg: '#f0faf6' },
    bearish: { label: '▼ Bearish', color: '#E24B4A', bg: '#fef2f2' },
    neutral: { label: '◆ Neutral', color: '#92400E', bg: '#fffbf0' },
    likely: { label: '● Likely', color: '#1D9E75', bg: '#f0faf6' },
    unlikely: { label: '○ Unlikely', color: '#E24B4A', bg: '#fef2f2' },
    uncertain: { label: '? Uncertain', color: '#92400E', bg: '#fffbf0' },
  }
  const s = map[dir] ?? map.neutral
  return (
    <span style={{ fontSize: '11px', fontWeight: 500, color: s.color, background: s.bg, padding: '3px 10px', borderRadius: '20px' }}>
      {s.label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    open: { label: '● Open', color: '#aaa9a0' },
    correct: { label: '✓ Correct', color: '#1D9E75' },
    incorrect: { label: '✗ Missed', color: '#E24B4A' },
  }
  const s = map[status] ?? map.open
  return <span style={{ fontSize: '11px', color: s.color, fontWeight: 500 }}>{s.label}</span>
}

function ProbabilityBar({ value }: { value: number }) {
  const color = value >= 60 ? '#1D9E75' : value >= 35 ? '#F5A623' : '#E24B4A'
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: '#aaa9a0' }}>Probability</span>
        <span style={{ fontSize: '11px', fontWeight: 600, color }}>{value}%</span>
      </div>
      <div style={{ height: '4px', background: '#e8e6e0', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '99px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

export default function PredictionsPage() {
  const predictions = getAllPredictions()
  const market = predictions.filter(p => (p as any).type !== 'geopolitical')
  const geopolitical = predictions.filter(p => (p as any).type === 'geopolitical')
  const open = predictions.filter(p => p.status === 'open')
  const closed = predictions.filter(p => p.status !== 'open')
  const correct = closed.filter(p => p.status === 'correct').length
  const accuracy = closed.length ? Math.round((correct / closed.length) * 100) : null

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
          Tracked & timestamped
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Predictions
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '14px', lineHeight: 1.7, maxWidth: '480px' }}>
          Every prediction is published before it happens — market calls and geopolitical forecasts. The track record is public, including the wrong ones.
        </p>
      </div>

      {/* Stats */}
      {predictions.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', background: 'rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px',
          overflow: 'hidden', marginBottom: '3rem',
        }}>
          {[
            { label: 'Total', value: predictions.length },
            { label: 'Open', value: open.length },
            { label: accuracy !== null ? `${accuracy}% accuracy` : 'Accuracy', value: accuracy !== null ? `${correct}/${closed.length}` : '—' },
          ].map(s => (
            <div key={s.label} style={{ background: '#f7f6f3', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, color: '#1a1a18' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#aaa9a0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Market Predictions */}
      {market.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '1rem' }}>
            📈 Market Predictions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {market.map(p => (
              <div key={p.slug} style={{
                background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px', padding: '1.25rem 1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: '15px', color: '#1a1a18', marginBottom: '4px' }}>{p.title}</p>
                    <p style={{ fontSize: '12px', color: '#6b6b63' }}>
                      {p.asset} · Target: <strong style={{ color: '#1a1a18' }}>{p.target}</strong> · {p.timeframe}
                    </p>
                    {(p as any).probability && <ProbabilityBar value={(p as any).probability} />}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <DirectionBadge dir={p.direction} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                {p.excerpt && <p style={{ fontSize: '13px', color: '#6b6b63', marginTop: '0.75rem', lineHeight: 1.6 }}>{p.excerpt}</p>}
                <p style={{ fontSize: '11px', color: '#aaa9a0', marginTop: '0.75rem' }}>Published {p.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geopolitical Predictions */}
      {geopolitical.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '1rem' }}>
            🌍 Geopolitical Forecasts
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {geopolitical.map(p => (
              <div key={p.slug} style={{
                background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '10px', padding: '1.25rem 1.5rem',
                borderLeft: '3px solid #185FA5',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: '15px', color: '#1a1a18', marginBottom: '4px' }}>{p.title}</p>
                    <p style={{ fontSize: '12px', color: '#6b6b63' }}>Timeframe: {p.timeframe}</p>
                    {(p as any).probability && <ProbabilityBar value={(p as any).probability} />}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <DirectionBadge dir={p.direction} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                {p.excerpt && <p style={{ fontSize: '13px', color: '#6b6b63', marginTop: '0.75rem', lineHeight: 1.6 }}>{p.excerpt}</p>}
                <p style={{ fontSize: '11px', color: '#aaa9a0', marginTop: '0.75rem' }}>Published {p.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {predictions.length === 0 && (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#aaa9a0' }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No predictions yet.</p>
          <p style={{ fontSize: '13px' }}>Add .mdx files to <code style={{ background: '#f0efe9', padding: '2px 6px', borderRadius: '4px' }}>content/predictions/</code></p>
        </div>
      )}
    </div>
  )
}
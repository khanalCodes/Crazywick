import { getAllPredictions } from '@/lib/articles'
import Link from 'next/link'

function DirectionBadge({ dir }: { dir: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    bullish: { label: '▲ Bullish', color: '#1D9E75', bg: '#0d2018' },
    bearish: { label: '▼ Bearish', color: '#E24B4A', bg: '#200d0d' },
    neutral: { label: '◆ Neutral', color: '#888880', bg: '#1a1a1a' },
  }
  const s = map[dir] ?? map.neutral
  return (
    <span style={{
      fontSize: '11px', fontWeight: 500, color: s.color,
      background: s.bg, padding: '3px 10px', borderRadius: '20px',
    }}>
      {s.label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    open: { label: '● Open', color: '#888880' },
    correct: { label: '✓ Correct', color: '#1D9E75' },
    incorrect: { label: '✗ Missed', color: '#E24B4A' },
  }
  const s = map[status] ?? map.open
  return <span style={{ fontSize: '11px', color: s.color, fontWeight: 500 }}>{s.label}</span>
}

export default function PredictionsPage() {
  const predictions = getAllPredictions()
  const open = predictions.filter(p => p.status === 'open')
  const closed = predictions.filter(p => p.status !== 'open')
  const correct = closed.filter(p => p.status === 'correct').length
  const accuracy = closed.length ? Math.round((correct / closed.length) * 100) : null

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
          Tracked & timestamped
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '1rem' }}>
          Predictions
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px' }}>
          Every prediction is published before the move happens. The track record is public — including the wrong ones.
          This is how trust is built.
        </p>
      </div>

      {/* Stats */}
      {predictions.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px',
          overflow: 'hidden', marginBottom: '3rem',
        }}>
          {[
            { label: 'Total predictions', value: predictions.length },
            { label: 'Open', value: open.length },
            { label: accuracy !== null ? `${accuracy}% accuracy` : 'Accuracy', value: accuracy !== null ? `${correct}/${closed.length}` : '—' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Open predictions */}
      {open.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
            Open positions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {open.map(p => (
              <div key={p.slug} style={{
                background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '1.25rem 1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '15px', marginBottom: '4px' }}>{p.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {p.asset} · Target: <strong style={{ color: 'var(--text)' }}>{p.target}</strong> · {p.timeframe}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <DirectionBadge dir={p.direction} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                {p.excerpt && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>{p.excerpt}</p>
                )}
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '0.75rem' }}>Published {p.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closed predictions */}
      {closed.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
            Closed
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {closed.map(p => (
              <div key={p.slug} style={{
                background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '1.25rem 1.5rem', opacity: 0.75,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>{p.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {p.asset} · Target: {p.target} · {p.timeframe}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <DirectionBadge dir={p.direction} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '0.5rem' }}>{p.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {predictions.length === 0 && (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-dim)' }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No predictions yet.</p>
          <p style={{ fontSize: '13px' }}>Add <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>.mdx</code> files to <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>content/predictions/</code></p>
        </div>
      )}
    </div>
  )
}

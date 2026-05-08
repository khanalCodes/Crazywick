import { prisma } from '@/lib/prisma'

function DirectionBadge({ dir }: { dir: string }) {
  const map: Record<string, { label: string; color: string }> = {
    BULLISH: { label: '▲ Bullish', color: '#1D9E75' },
    BEARISH: { label: '▼ Bearish', color: '#E24B4A' },
    NEUTRAL: { label: '◆ Neutral', color: '#888' },
    LIKELY: { label: '● Likely', color: '#1D9E75' },
    UNLIKELY: { label: '● Unlikely', color: '#E24B4A' },
    UNCERTAIN: { label: '◆ Uncertain', color: '#888' },
  }
  const d = map[dir] ?? map.NEUTRAL
  return <span style={{ fontSize: '11px', color: d.color, fontWeight: 500 }}>{d.label}</span>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    OPEN: { label: 'Open', bg: '#f0faf6', color: '#1D9E75' },
    CORRECT: { label: '✓ Correct', bg: '#f0faf6', color: '#1D9E75' },
    INCORRECT: { label: '✗ Missed', bg: '#fef2f2', color: '#E24B4A' },
    CANCELLED: { label: 'Cancelled', bg: '#f7f6f3', color: '#888' },
    EXPIRED: { label: 'Expired', bg: '#f7f6f3', color: '#888' },
  }
  const s = map[status] ?? map.OPEN
  return (
    <span style={{ fontSize: '10px', fontWeight: 500, background: s.bg, color: s.color, padding: '2px 8px', borderRadius: '20px' }}>
      {s.label}
    </span>
  )
}

export const dynamic = 'force-dynamic'

export default async function PredictionsPage() {
  const predictions = await prisma.prediction.findMany({
    where: { deletedAt: null },
    orderBy: { publishedAt: 'desc' },
  })

 const market = predictions.filter((p: any) => ['MARKET', 'CRYPTO', 'COMMODITY', 'MACRO'].includes(p.type))
const geopolitical = predictions.filter((p: any) => p.type === 'GEOPOLITICAL')

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '0.75rem' }}>
          Track record
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '1rem', color: '#1a1a18' }}>
          Predictions
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.7 }}>
          Every call documented before it happens. Win or lose — it's all on record.
        </p>
      </div>

      {predictions.length === 0 ? (
        <p style={{ color: '#aaa9a0', fontSize: '14px' }}>No predictions yet.</p>
      ) : (
        <>
          {market.length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '1rem' }}>
                Market & Crypto
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               {geopolitical.map((p: any) => (
                  <div key={p.id} style={{
                    background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '10px', padding: '1.25rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a18' }}>{p.title}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b6b63', marginBottom: '10px', lineHeight: 1.6 }}>{p.thesis}</p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <DirectionBadge dir={p.direction} />
                      <span style={{ fontSize: '12px', color: '#aaa9a0' }}>{p.asset}</span>
                      <span style={{ fontSize: '12px', color: '#aaa9a0' }}>{p.timeframe}</span>
                      {p.target && <span style={{ fontSize: '12px', color: '#aaa9a0' }}>Target: {p.target}</span>}
                      {p.probability && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '80px', height: '4px', background: '#e5e5e5', borderRadius: '2px' }}>
                            <div style={{ width: `${p.probability}%`, height: '100%', background: '#1D9E75', borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '11px', color: '#aaa9a0' }}>{p.probability}%</span>
                        </div>
                      )}
                      <span style={{ fontSize: '11px', color: '#aaa9a0', marginLeft: 'auto' }}>
                        {new Date(p.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {geopolitical.length > 0 && (
            <section>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0', marginBottom: '1rem' }}>
                Geopolitical
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {geopolitical.map((p: any) => (
                  <div key={p.id} style={{
                    background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '10px', padding: '1.25rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a18' }}>{p.title}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b6b63', marginBottom: '10px', lineHeight: 1.6 }}>{p.thesis}</p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <DirectionBadge dir={p.direction} />
                      <span style={{ fontSize: '12px', color: '#aaa9a0' }}>{p.timeframe}</span>
                      {p.probability && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '80px', height: '4px', background: '#e5e5e5', borderRadius: '2px' }}>
                            <div style={{ width: `${p.probability}%`, height: '100%', background: '#1D9E75', borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '11px', color: '#aaa9a0' }}>{p.probability}%</span>
                        </div>
                      )}
                      <span style={{ fontSize: '11px', color: '#aaa9a0', marginLeft: 'auto' }}>
                        {new Date(p.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
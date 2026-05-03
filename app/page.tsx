import Link from 'next/link'
import { getAllArticles, getAllPredictions } from '@/lib/articles'

const CATEGORY_COLORS: Record<string, string> = {
  Geopolitics: '#185FA5',
  Markets: '#3B6D11',
  Prediction: '#853808',
  Analysis: '#534AB7',
  Nepal: '#993556',
  Macro: '#0F6E56',
  Spirituality: '#7B5EA7',
  Fintech: '#0E7490',
}

function CategoryBadge({ cat }: { cat: string }) {
  const color = CATEGORY_COLORS[cat] ?? '#555'
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', color,
    }}>
      {cat}
    </span>
  )
}

function DirectionBadge({ dir }: { dir: string }) {
  const map: Record<string, { label: string; color: string }> = {
    bullish: { label: '▲ Bullish', color: '#1D9E75' },
    bearish: { label: '▼ Bearish', color: '#E24B4A' },
    neutral: { label: '◆ Neutral', color: '#888' },
  }
  const { label, color } = map[dir] ?? map.neutral
  return <span style={{ fontSize: '11px', color, fontWeight: 500 }}>{label}</span>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    open: { label: 'Open', bg: '#f0faf6', color: '#1D9E75' },
    correct: { label: '✓ Correct', bg: '#f0faf6', color: '#1D9E75' },
    incorrect: { label: '✗ Missed', bg: '#fef2f2', color: '#E24B4A' },
  }
  const s = map[status] ?? map.open
  return (
    <span style={{
      fontSize: '10px', fontWeight: 500, background: s.bg,
      color: s.color, padding: '2px 8px', borderRadius: '20px',
    }}>
      {s.label}
    </span>
  )
}

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6)
  const predictions = getAllPredictions().slice(0, 4)
  const heroArticles = articles.slice(0, 3)
  const rest = articles.slice(3)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

      {/* HERO */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '5rem',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        alignItems: 'center',
      }}>

        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: '#f0faf6', border: '1px solid #c3e9d8',
            borderRadius: '20px', padding: '5px 14px',
            fontSize: '11px', fontWeight: 500, color: '#0F6E56',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            marginBottom: '2rem',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#1D9E75', display: 'inline-block',
            }} />
            Live Analysis
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: '3.6rem',
            lineHeight: 1.12,
            marginBottom: '1.5rem',
            color: '#1a1a18',
            fontWeight: 700,
            letterSpacing: '-0.5px',
          }}>
            Finance &amp;{' '}
            geopolitics,
            <br />
            <em style={{ color: '#1D9E75', fontStyle: 'italic' }}>
              before the crowd
            </em>
            <br />
            catches on.
          </h1>

          <p style={{
            color: '#6b6b63', fontSize: '1rem',
            maxWidth: '400px', lineHeight: 1.8,
            marginBottom: '2.5rem',
          }}>
            Deep-dive articles, market predictions, and geopolitical intelligence — built for people who want to understand the world before they invest in it.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/articles" style={{
              background: '#1D9E75', color: '#fff',
              padding: '11px 24px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 500,
            }}>
              Read articles →
            </Link>
            <Link href="/predictions" style={{
              border: '1px solid rgba(0,0,0,0.12)', color: '#6b6b63',
              padding: '11px 24px', borderRadius: '8px', fontSize: '13px',
            }}>
              View predictions
            </Link>
          </div>
        </div>

        {/* Right — article cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {heroArticles.length === 0 ? (
            <p style={{ color: '#aaa9a0', fontSize: '13px' }}>Articles will appear here.</p>
          ) : heroArticles.map(a => (
            <Link key={a.slug} href={`/articles/${a.slug}`} style={{ display: 'block' }}>
              <div style={{
                background: '#f7f6f3',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '12px',
                padding: '1.1rem 1.4rem',
              }}>
                <CategoryBadge cat={a.category} />
                <h3 style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1a1a18',
                  lineHeight: 1.5,
                  margin: '6px 0 5px',
                }}>
                  {a.title}
                </h3>
                <p style={{ fontSize: '11px', color: '#aaa9a0' }}>
                  {a.readingTime} · {a.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* More articles */}
      {rest.length > 0 && (
        <section style={{ padding: '2.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0' }}>More</p>
            <Link href="/articles" style={{ fontSize: '13px', color: '#1D9E75' }}>All articles →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {rest.map(a => (
              <Link key={a.slug} href={`/articles/${a.slug}`} style={{ display: 'block' }}>
                <div style={{
                  background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '10px', padding: '1.25rem',
                }}>
                  <CategoryBadge cat={a.category} />
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', lineHeight: 1.35, margin: '6px 0 6px', color: '#1a1a18' }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#aaa9a0' }}>{a.date} · {a.readingTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Predictions */}
      {predictions.length > 0 && (
        <section style={{ padding: '2.5rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0' }}>
              Predictions — documented &amp; tracked
            </p>
            <Link href="/predictions" style={{ fontSize: '13px', color: '#1D9E75' }}>All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {predictions.map(p => (
              <div key={p.slug} style={{
                background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '10px', padding: '1rem 1.25rem',
                display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ fontWeight: 500, fontSize: '14px', color: '#1a1a18', marginBottom: '2px' }}>{p.title}</p>
                  <p style={{ fontSize: '12px', color: '#6b6b63' }}>{p.asset} · {p.timeframe} · Target: {p.target}</p>
                </div>
                <DirectionBadge dir={p.direction} />
                <StatusBadge status={p.status} />
                <span style={{ fontSize: '11px', color: '#aaa9a0' }}>{p.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
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
  'Economy & Politics': '#92400E',
  'Book Notes': '#065F46',
  'Fed & CPI': '#9D174D',
  'Institutional Research': '#1E3A5F',
  'Company Analysis': '#14532D',
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
    BULLISH: { label: '▲ Bullish', color: '#1D9E75' },
    BEARISH: { label: '▼ Bearish', color: '#E24B4A' },
    NEUTRAL: { label: '◆ Neutral', color: '#888' },
  }
  const { label, color } = map[dir] ?? map.NEUTRAL
  return <span style={{ fontSize: '11px', color, fontWeight: 500 }}>{label}</span>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    OPEN: { label: 'Open', bg: '#f0faf6', color: '#1D9E75' },
    CORRECT: { label: '✓ Correct', bg: '#f0faf6', color: '#1D9E75' },
    INCORRECT: { label: '✗ Missed', bg: '#fef2f2', color: '#E24B4A' },
  }
  const s = map[status] ?? map.OPEN
  return (
    <span style={{
      fontSize: '10px', fontWeight: 500, background: s.bg,
      color: s.color, padding: '2px 8px', borderRadius: '20px',
    }}>
      {s.label}
    </span>
  )
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const allArticles = await getAllArticles()
  const predictions = (await getAllPredictions()).slice(0, 4)
  const shuffled = shuffleArray(allArticles)
  const heroArticles = shuffled.slice(0, 3)
  const rest = shuffled.slice(3, 6)

  return (
    <>
      <style>{`
        .article-card {
          background: #f7f6f3;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 12px;
          padding: 1.1rem 1.4rem;
          transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .article-card:hover {
          border-color: rgba(0,0,0,0.18);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }
        .article-card-sm {
          background: #f7f6f3;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 10px;
          padding: 1.25rem;
          transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .article-card-sm:hover {
          border-color: rgba(0,0,0,0.16);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .prediction-row {
          background: #f7f6f3;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 10px;
          padding: 1rem 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .prediction-row:hover {
          border-color: rgba(0,0,0,0.14);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .hero-btn-primary {
          background: #1D9E75;
          color: #fff;
          padding: 11px 24px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          transition: background 0.15s, transform 0.15s;
          display: inline-block;
        }
        .hero-btn-primary:hover {
          background: #0F6E56;
          transform: translateY(-1px);
        }
        .hero-btn-ghost {
          border: 1px solid rgba(0,0,0,0.12);
          color: #6b6b63;
          padding: 11px 24px;
          border-radius: 8px;
          font-size: 13px;
          transition: border-color 0.15s, color 0.15s, transform 0.15s;
          display: inline-block;
        }
        .hero-btn-ghost:hover {
          border-color: rgba(0,0,0,0.25);
          color: #1a1a18;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="page-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4rem 4rem' }}>

        {/* HERO */}
        <section className="hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5rem',
          padding: '5rem 0 4rem',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: '#f0faf6', border: '1px solid #c3e9d8',
              borderRadius: '20px', padding: '5px 14px',
              fontSize: '11px', fontWeight: 500, color: '#0F6E56',
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: '2rem',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} />
              Live Analysis
            </div>

            <h1 className="hero-heading" style={{
              fontFamily: 'var(--serif)', fontSize: '3.2rem',
              lineHeight: 1.12, marginBottom: '1.5rem',
              color: '#1a1a18', fontWeight: 700, letterSpacing: '-0.5px',
            }}>
              Finance &amp; geopolitics,
              <br />
              <em style={{ color: '#1D9E75', fontStyle: 'italic' }}>before the crowd</em>
              <br />
              catches on.
            </h1>

            <p style={{
              color: '#6b6b63', fontSize: '1rem',
              maxWidth: '400px', lineHeight: 1.8, marginBottom: '2.5rem',
            }}>
              Deep-dive articles, market predictions, and geopolitical intelligence — built for people who want to understand the world before they invest in it.
            </p>

            <div className="hero-buttons" style={{ display: 'flex', gap: '10px' }}>
              <Link href="/articles" className="hero-btn-primary">Read articles →</Link>
              <Link href="/predictions" className="hero-btn-ghost">View predictions</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allArticles.length === 0 ? (
              <div style={{
                background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '12px', padding: '2rem', textAlign: 'center',
              }}>
                <p style={{ color: '#aaa9a0', fontSize: '13px' }}>
                  Your articles will appear here as you write them.
                </p>
              </div>
            ) : heroArticles.map(a => (
              <Link key={a.slug} href={`/articles/${a.slug}`} style={{ display: 'block' }}>
                <div className="article-card">
                  <CategoryBadge cat={a.category} />
                  <h3 style={{
                    fontFamily: 'var(--sans)', fontSize: '14px',
                    fontWeight: 500, color: '#1a1a18',
                    lineHeight: 1.5, margin: '6px 0 5px',
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

        {rest.length > 0 && (
          <section style={{ padding: '2.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa9a0' }}>More reading</p>
              <Link href="/articles" style={{ fontSize: '13px', color: '#1D9E75' }}>All articles →</Link>
            </div>
            <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {rest.map(a => (
                <Link key={a.slug} href={`/articles/${a.slug}`} style={{ display: 'block' }}>
                  <div className="article-card-sm">
                    <CategoryBadge cat={a.category} />
                    <h3 style={{
                      fontFamily: 'var(--serif)', fontSize: '1.05rem',
                      lineHeight: 1.35, margin: '6px 0 6px', color: '#1a1a18',
                    }}>
                      {a.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#aaa9a0' }}>{a.date} · {a.readingTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
                <div key={p.id} className="prediction-row">
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <p style={{ fontWeight: 500, fontSize: '14px', color: '#1a1a18', marginBottom: '2px' }}>{p.title}</p>
                    <p style={{ fontSize: '12px', color: '#6b6b63' }}>{p.asset} · {p.timeframe} · Target: {p.target}</p>
                  </div>
                  <DirectionBadge dir={p.direction} />
                  <StatusBadge status={p.status} />
                  <span style={{ fontSize: '11px', color: '#aaa9a0' }}>{p.publishedAt}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
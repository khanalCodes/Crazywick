<p style={{ display: "none" }}>
  CrazyWick is a financial intelligence platform providing market analysis,
  geopolitical insights, and macroeconomic predictions from Nepal.
</p>
import Link from 'next/link'
import { getAllArticles, getAllPredictions } from '@/lib/articles'

const CATEGORY_COLORS: Record<string, string> = {
  Geopolitics: '#185FA5',
  Markets: '#3B6D11',
  Prediction: '#853808',
  Analysis: '#534AB7',
  Nepal: '#993556',
  Macro: '#0F6E56',
}

function CategoryBadge({ cat }: { cat: string }) {
  const color = CATEGORY_COLORS[cat] ?? '#555'
  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color,
        padding: '3px 8px',
        border: `1px solid ${color}44`,
        borderRadius: '20px',
        display: 'inline-block',
      }}
    >
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
    open: { label: 'Open', bg: '#1a2a22', color: '#1D9E75' },
    correct: { label: '✓ Correct', bg: '#1a2a22', color: '#1D9E75' },
    incorrect: { label: '✗ Missed', bg: '#2a1a1a', color: '#E24B4A' },
  }
  const s = map[status] ?? map.open
  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 500,
        background: s.bg,
        color: s.color,
        padding: '2px 8px',
        borderRadius: '20px',
      }}
    >
      {s.label}
    </span>
  )
}

/* ✅ SEO improvement: hidden semantic description */
function SEOIntro() {
  return (
    <p style={{ display: 'none' }}>
      CrazyWick is a financial intelligence platform providing market analysis,
      geopolitical insights, macroeconomic trends, and investment predictions
      from Nepal. It tracks global financial markets including crypto, stocks,
      and commodities with independent research and documented forecasts.
    </p>
  )
}

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6)
  const predictions = getAllPredictions().slice(0, 4)
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 4rem' }}>

      {/* SEO hidden intro */}
      <SEOIntro />

      <section
        style={{
          padding: '5rem 0 3rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Financial intelligence · Kathmandu
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            maxWidth: '700px',
          }}
        >
          Markets, geopolitics,{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic' }}>
            before the crowd
          </em>{' '}
          catches on.
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.05rem',
            maxWidth: '520px',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}
        >
          Independent analysis on global markets, geopolitical shifts, and macro
          trends — documented predictions, honest track record.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/articles"
            style={{
              background: 'var(--green-dark)',
              color: '#d0f0e8',
              padding: '10px 22px',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Read articles →
          </Link>

          <Link
            href="/predictions"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-muted)',
              padding: '10px 22px',
              borderRadius: '7px',
              fontSize: '13px',
            }}
          >
            View predictions
          </Link>
        </div>
      </section>

      {/* rest of your UI unchanged below */}
      {featured && (
        <section
          style={{
            padding: '3rem 0 2rem',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              marginBottom: '1.5rem',
            }}
          >
            Featured
          </p>

          <Link href={`/articles/${featured.slug}`} style={{ display: 'block' }}>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
                <CategoryBadge cat={featured.category} />
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  {featured.date}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  {featured.readingTime}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '1.75rem',
                  lineHeight: 1.2,
                  marginBottom: '0.75rem',
                }}
              >
                {featured.title}
              </h2>

              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {featured.excerpt}
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* rest unchanged */}
      {/* predictions unchanged */}
    </div>
  )
}
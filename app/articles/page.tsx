import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'

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
    <span style={{
      fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em',
      textTransform: 'uppercase', color, padding: '3px 8px',
      border: `1px solid ${color}44`, borderRadius: '20px', display: 'inline-block',
    }}>
      {cat}
    </span>
  )
}

export default function ArticlesPage() {
  const articles = getAllArticles()
  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))]

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
          All writing
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '1rem' }}>
          Articles
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.7 }}>
          Long-form analysis on global markets, geopolitics, and macro trends. Everything is documented — including the calls I get wrong.
        </p>
      </div>

      {articles.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-dim)' }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No articles yet.</p>
          <p style={{ fontSize: '13px' }}>
            Add <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>.mdx</code> files to{' '}
            <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>content/articles/</code>
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {articles.map((a, i) => (
            <Link key={a.slug} href={`/articles/${a.slug}`}>
              <div
                style={{
                  padding: '1.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'start',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <CategoryBadge cat={a.category} />
                  </div>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', lineHeight: 1.3, marginBottom: '0.4rem' }}>
                    {a.title}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{a.excerpt}</p>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{a.date}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>{a.readingTime}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

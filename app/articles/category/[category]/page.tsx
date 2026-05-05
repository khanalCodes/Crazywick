import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'

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

const SLUG_TO_CATEGORY: Record<string, string> = {
  'spirituality': 'Spirituality',
  'institutional-research': 'Institutional Research',
  'company-analysis': 'Company Analysis',
  'fintech': 'Fintech',
  'economy-politics': 'Economy & Politics',
  'book-notes': 'Book Notes',
  'fed-cpi': 'Fed & CPI',
  'geopolitics': 'Geopolitics',
  'markets': 'Markets',
  'nepal': 'Nepal',
  'macro': 'Macro',
  'analysis': 'Analysis',
}

export async function generateStaticParams() {
  return Object.keys(SLUG_TO_CATEGORY).map(slug => ({ category: slug }))
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = SLUG_TO_CATEGORY[params.category]
  if (!categoryName) notFound()

  const all = getAllArticles()
  const articles = all.filter(a => a.category === categoryName)
  const color = CATEGORY_COLORS[categoryName] ?? '#555'

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

      {/* Back */}
      <Link href="/articles" style={{ fontSize: '13px', color: '#aaa9a0', display: 'inline-block', marginBottom: '2rem' }}>
        ← All articles
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color,
          padding: '4px 10px', border: `1px solid ${color}44`,
          borderRadius: '20px', display: 'inline-block', marginBottom: '1rem',
        }}>
          {categoryName}
        </span>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          {categoryName}
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '14px' }}>
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Articles */}
      {articles.length === 0 ? (
        <div style={{
          padding: '4rem 2rem', textAlign: 'center',
          background: '#f7f6f3', borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: '#1a1a18' }}>
            Nothing here yet.
          </p>
          <p style={{ fontSize: '13px', color: '#aaa9a0' }}>
            Add an MDX file with{' '}
            <code style={{ background: '#e8e6e0', padding: '1px 5px', borderRadius: '3px' }}>
              category: "{categoryName}"
            </code>{' '}
            to show articles here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {articles.map(a => (
            <Link key={a.slug} href={`/articles/${a.slug}`} style={{ display: 'block' }}>
              <div style={{
                padding: '1.5rem 0',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '1rem',
                alignItems: 'start',
              }}>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--serif)', fontSize: '1.2rem',
                    lineHeight: 1.3, marginBottom: '0.4rem', color: '#1a1a18',
                  }}>
                    {a.title}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#6b6b63', lineHeight: 1.6 }}>
                    {a.excerpt}
                  </p>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <p style={{ fontSize: '12px', color: '#aaa9a0' }}>{a.date}</p>
                  <p style={{ fontSize: '11px', color: '#aaa9a0', marginTop: '4px' }}>{a.readingTime}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'

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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

      <Link href="/articles" className="back-link">← All articles</Link>

      <div style={{ marginBottom: '3rem', padding: '2rem', background: '#f0faf6', border: '1px solid #c3e9d8', borderRadius: '14px' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F6E56', padding: '4px 12px', background: '#fff', border: '1px solid #c3e9d8', borderRadius: '20px', display: 'inline-block', marginBottom: '1rem' }}>
          {categoryName}
        </span>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '0.5rem', color: '#1a1a18' }}>
          {categoryName}
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '14px' }}>
          {articles.length === 0 ? 'No articles yet — check back soon.' : `${articles.length} article${articles.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {articles.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f0faf6', borderRadius: '12px', border: '1px solid #c3e9d8' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✍️</p>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: '#1a1a18' }}>Nothing here yet.</p>
          <p style={{ fontSize: '13px', color: '#6b6b63', lineHeight: 1.6 }}>
            Add an MDX file with <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #c3e9d8', color: '#0F6E56' }}>category: "{categoryName}"</code> to show articles here.
          </p>
        </div>
      ) : (
        <div style={{ borderTop: '2px solid #1D9E75' }}>
          {articles.map(a => (
            <Link key={a.slug} href={`/articles/${a.slug}`} style={{ display: 'block' }}>
              <div className="cat-row">
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: '6px' }}>
                    {categoryName}
                  </div>
                  <h2 className="cat-title">{a.title}</h2>
                  <p style={{ fontSize: '13px', color: '#6b6b63', lineHeight: 1.6 }}>{a.excerpt}</p>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <p style={{ fontSize: '12px', color: '#aaa9a0' }}>{a.date}</p>
                  <p style={{ fontSize: '11px', color: '#aaa9a0', marginTop: '4px' }}>{a.readingTime}</p>
                  <p style={{ fontSize: '11px', color: '#1D9E75', marginTop: '6px', fontWeight: 500 }}>Read →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
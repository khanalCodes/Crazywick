import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

const CATEGORY_COLORS: Record<string, string> = {
  Geopolitics: '#185FA5', Markets: '#3B6D11', Prediction: '#853808',
  Analysis: '#534AB7', Macro: '#0F6E56', Spirituality: '#7B5EA7',
  Fintech: '#0E7490', 'Economy & Politics': '#92400E', 'Book Notes': '#065F46',
  'Fed & CPI Watch': '#9D174D', 'Institutional Research': '#1E3A5F',
  'Company Analysis & Valuation': '#14532D',
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params

  const cat = await prisma.category.findUnique({
    where: { slug: category },
  })

  if (!cat) notFound()

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', deletedAt: null, categoryId: cat.id },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  })

  const color = CATEGORY_COLORS[cat.name] ?? '#555'

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
      <Link href="/articles" style={{ fontSize: '13px', color: '#1D9E75', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
        ← All articles
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <span style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color,
          padding: '4px 10px', border: `1px solid ${color}44`,
          borderRadius: '20px', display: 'inline-block', marginBottom: '1rem',
        }}>
          {cat.name}
        </span>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '0.5rem', color: '#1a1a18' }}>
          {cat.name}
        </h1>
        <p style={{ color: '#6b6b63', fontSize: '14px' }}>{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: '#aaa9a0', fontSize: '14px' }}>No articles in this category yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {articles.map((a: any) => (
            <Link key={a.id} href={`/articles/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '1.5rem 0',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '1rem',
                alignItems: 'start',
              }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', lineHeight: 1.3, marginBottom: '0.4rem', color: '#1a1a18' }}>
                    {a.title}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#6b6b63', lineHeight: 1.6 }}>{a.excerpt}</p>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <p style={{ fontSize: '12px', color: '#aaa9a0' }}>
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}
                  </p>
                  <p style={{ fontSize: '11px', color: '#aaa9a0', marginTop: '4px' }}>
                    {Math.ceil(a.content.length / 1000)} min read
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
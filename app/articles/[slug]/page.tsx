import { getAllArticles, getArticleBySlug } from '@/lib/articles'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
  'Fed & CPI Watch': '#9D174D',
  'Institutional Research': '#1E3A5F',
  'Company Analysis & Valuation': '#14532D',
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} — CrazyWick`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const color = CATEGORY_COLORS[article.category] ?? '#555'

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem 8rem' }}>

      <Link href="/articles" style={{
        fontSize: '13px', color: '#1D9E75',
        display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '2.5rem',
        textDecoration: 'none',
      }}>
        ← All articles
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <span style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color,
          padding: '4px 10px', border: `1px solid ${color}44`,
          borderRadius: '20px', display: 'inline-block', marginBottom: '1.25rem',
        }}>
          {article.category}
        </span>

        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          lineHeight: 1.15, marginBottom: '1rem', color: '#1a1a18',
        }}>
          {article.title}
        </h1>

        <p style={{ color: '#6b6b63', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {article.excerpt}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.07)',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#f0faf6', border: '2px solid #c3e9d8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#0F6E56',
            flexShrink: 0,
          }}>
            {article.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a18' }}>{article.author}</p>
            <p style={{ fontSize: '11px', color: '#aaa9a0' }}>
              {new Date(article.date).toLocaleDateString()} · {article.readingTime}
            </p>
          </div>
        </div>
      </div>

      <article className="prose">
        <MDXRemote source={article.content} />
      </article>

      <div style={{
        marginTop: '4rem', padding: '1.5rem',
        background: '#f7f6f3', border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '10px', fontSize: '12px', color: '#aaa9a0', lineHeight: 1.6,
      }}>
        <strong style={{ color: '#6b6b63', display: 'block', marginBottom: '0.25rem' }}>Disclaimer</strong>
        This article is for educational and informational purposes only. Nothing here constitutes financial advice.
        Always do your own research before making any investment decisions.
      </div>
    </div>
  )
}
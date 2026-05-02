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
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: `${article.title} — CrazyWick`,
    description: article.excerpt,
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const color = CATEGORY_COLORS[article.category] ?? '#555'

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem 8rem' }}>
      {/* Back */}
      <Link href="/articles" style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '2.5rem' }}>
        ← All articles
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span style={{
          fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase',
          color, padding: '3px 8px', border: `1px solid ${color}44`, borderRadius: '20px',
          display: 'inline-block', marginBottom: '1.25rem',
        }}>
          {article.category}
        </span>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          lineHeight: 1.15, marginBottom: '1rem',
        }}>
          {article.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {article.excerpt}
        </p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readingTime}</span>
          <span>·</span>
          <span>CrazyWick</span>
        </div>
      </div>

      {/* Content */}
      <article className="prose">
        <MDXRemote source={article.content} />
      </article>

      {/* Footer */}
      <div style={{
        marginTop: '4rem', padding: '1.5rem', background: 'var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px',
        fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Disclaimer</strong>
        This article is for educational and informational purposes only. Nothing here constitutes financial advice.
        Always do your own research before making any investment decisions.
      </div>
    </div>
  )
}

import { getArticleBySlug, getAllArticles } from "@/lib/articles"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import ReactionBar from "@/components/ReactionBar"
import BookmarkButton from "@/components/BookmarkButton"
import CommentSection from "@/components/CommentSection"

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: "Not Found — CrazyWick" }
  return {
    title: `${article.title} — CrazyWick`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      url: `https://crazywick.com/articles/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const dbArticle = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, viewCount: true, commentCount: true },
  })

  if (dbArticle) {
    await prisma.article.update({ where: { slug }, data: { viewCount: { increment: 1 } } })
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "CrazyWick",
      url: "https://crazywick.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://crazywick.com/articles/${slug}`,
    },
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "var(--text-muted)" }}>
        <Link href="/articles" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Articles</Link>
        <span>/</span>
        <span style={{ color: "var(--green-accent)" }}>{article.category}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: "var(--green-light-bg)", color: "var(--green-accent)", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 600, marginBottom: 16, border: "1px solid var(--green-light-border)" }}>
          {article.category}
        </span>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 38, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.25, marginBottom: 16 }}>
          {article.title}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
          {article.excerpt}
        </p>

        {/* Meta + bookmark */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif", flexWrap: "wrap", alignItems: "center" }}>
            <span>{article.author}</span>
            <span>·</span>
            <span>{new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>·</span>
            <span>{article.readingTime}</span>
            {dbArticle && (
              <>
                <span>·</span>
                <span>{dbArticle.viewCount + 1} views</span>
                <span>·</span>
                <span>{dbArticle.commentCount} comments</span>
              </>
            )}
          </div>
          {dbArticle && <BookmarkButton articleId={dbArticle.id} />}
        </div>
      </div>

      {/* Content */}
      <div
        style={{ fontFamily: "DM Sans, sans-serif", fontSize: 17, lineHeight: 1.8, color: "var(--text-primary)" }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Reactions + Comments */}
      {dbArticle && (
        <>
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>
              What did you think?
            </p>
            <ReactionBar articleId={dbArticle.id} />
          </div>
          <CommentSection articleId={dbArticle.id} />
        </>
      )}
    </main>
  )
}
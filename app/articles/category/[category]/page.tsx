import { getArticlesByCategory, getAllArticles } from "@/lib/articles"
import ArticleRow from "@/components/ArticleRow"
import Link from "next/link"

export async function generateStaticParams() {
  const articles = await getAllArticles()
  const slugs = Array.from(new Set(articles.map((a) => a.category.toLowerCase().replace(/\s+/g, "-"))))
  return slugs.map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const label = category.replace(/-/g, " ")
  return {
    title: `${label} — CrazyWick`,
    description: `Articles in ${label}`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const articles = await getArticlesByCategory(category)
  const label = category.replace(/-/g, " ")

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/articles" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
          ← All Articles
        </Link>
      </div>

      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, textTransform: "capitalize" }}>
        {label}
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 40, fontFamily: "DM Sans, sans-serif" }}>
        {articles.length} article{articles.length !== 1 ? "s" : ""}
      </p>

      {articles.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 80 }}>No articles in this category yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {articles.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </div>
      )}
    </main>
  )
}

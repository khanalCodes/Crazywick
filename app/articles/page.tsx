import { getAllArticles } from "@/lib/articles"
import ArticleRow from "@/components/ArticleRow"
import Link from "next/link"

export const metadata = {
  title: "Articles — CrazyWick",
  description: "Financial intelligence, macro analysis, and geopolitical insights.",
}

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  const categories = Array.from(new Set(articles.map((a) => a.category)))

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
        Articles
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 40 }}>
        Global markets, macro analysis, and geopolitical intelligence.
      </p>

      {/* Category filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
        <Link href="/articles" style={{ padding: "6px 14px", borderRadius: 20, background: "var(--green-accent)", color: "#fff", fontSize: 13, textDecoration: "none", fontFamily: "DM Sans, sans-serif" }}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/articles/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`}
            style={{ padding: "6px 14px", borderRadius: 20, background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 13, textDecoration: "none", fontFamily: "DM Sans, sans-serif" }}
          >
            {cat}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 80 }}>No articles published yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {articles.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </div>
      )}
    </main>
  )
}

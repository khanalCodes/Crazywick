import { getAllArticles } from "@/lib/articles"
import ArticleRow from "@/components/ArticleRow"

export const metadata = {
  title: "Geopolitics — CrazyWick",
  description: "Geopolitical analysis and its impact on global markets.",
}

const GEO_CATEGORIES = ["Geopolitics", "Economy & Politics", "Fed & CPI Watch"]

export default async function GeopoliticsPage() {
  const all = await getAllArticles()
  const articles = all.filter((a) => GEO_CATEGORIES.includes(a.category))

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
        Geopolitics
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 40, fontFamily: "DM Sans, sans-serif" }}>
        Power, policy, and macro — from outside the Western financial bubble.
      </p>

      {articles.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 80 }}>No geopolitics content published yet.</p>
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

import Link from "next/link"
import type { Article } from "@/lib/articles"

export default function ArticleRow({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none" }} className="article-row">
      <div style={{ padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--green-accent)", fontFamily: "DM Sans, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {article.category}
              </span>
            </div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
              {article.title}
            </h2>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10 }}>
              {article.excerpt}
            </p>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif" }}>
              <span>{article.author}</span>
              <span>·</span>
              <span>{new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span>·</span>
              <span>{article.readingTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

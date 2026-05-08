import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18" }}>
          Articles
        </h1>
        <Link href="/admin/articles/new" style={{
          backgroundColor: "#1D9E75",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
        }}>
          + New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: "#6b6b63", fontSize: "14px" }}>No articles yet. Write your first one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {articles.map(article => (
            <div key={article.id} style={{
              backgroundColor: "#f7f6f3",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "10px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "#1a1a18", fontSize: "15px", marginBottom: "4px" }}>
                  {article.title}
                </div>
                <div style={{ color: "#6b6b63", fontSize: "13px" }}>
                  {article.category.name} · {article.status} · {new Date(article.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link href={`/admin/articles/${article.id}/edit`} style={{
                  color: "#1D9E75", fontSize: "13px", textDecoration: "none", fontWeight: 500,
                }}>
                  Edit
                </Link>
                <Link href={`/articles/${article.slug}`} target="_blank" style={{
                  color: "#aaa9a0", fontSize: "13px", textDecoration: "none",
                }}>
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
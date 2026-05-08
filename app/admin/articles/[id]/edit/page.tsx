import { prisma } from "@/lib/prisma"
import { updateArticle, deleteArticle } from "../../actions"
import { notFound } from "next/navigation"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!article) notFound()

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18", marginBottom: "32px" }}>
        Edit Article
      </h1>

      <form action={updateArticle} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input type="hidden" name="id" value={article.id} />

        <div>
          <label style={labelStyle}>Title</label>
          <input name="title" required defaultValue={article.title} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Slug</label>
          <input name="slug" required defaultValue={article.slug} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Excerpt</label>
          <input name="excerpt" defaultValue={article.excerpt ?? ""} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Cover Image URL</label>
          <input name="coverImage" defaultValue={article.coverImage ?? ""} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <select name="categoryId" required style={inputStyle} defaultValue={article.categoryId}>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea
            name="content"
            required
            rows={20}
            defaultValue={article.content}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px", resize: "vertical" }}
          />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" style={inputStyle} defaultValue={article.status}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button type="submit" style={{
            backgroundColor: "#1D9E75", color: "#fff",
            padding: "12px 28px", border: "none", borderRadius: "8px",
            fontSize: "15px", fontWeight: 500, cursor: "pointer",
          }}>
            Update Article
          </button>
          <a href="/admin/articles" style={{ padding: "12px 20px", color: "#6b6b63", fontSize: "14px", textDecoration: "none" }}>
            Cancel
          </a>
        </div>
      </form>

      <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <p style={{ fontSize: "13px", color: "#6b6b63", marginBottom: "12px" }}>Danger zone</p>
        <form action={deleteArticle}>
          <input type="hidden" name="id" value={article.id} />
          <button type="submit" style={{
            backgroundColor: "#E24B4A", color: "#fff",
            padding: "10px 20px", border: "none", borderRadius: "8px",
            fontSize: "14px", cursor: "pointer",
          }}>
            Delete Article
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "13px", fontWeight: 600,
  color: "#1a1a18", marginBottom: "6px",
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px",
  fontSize: "14px", color: "#1a1a18", backgroundColor: "#ffffff",
  fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
}
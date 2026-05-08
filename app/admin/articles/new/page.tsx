import { prisma } from "@/lib/prisma"
import { createArticle } from "../actions"

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18", marginBottom: "32px" }}>
        New Article
      </h1>

      <form action={createArticle} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <div>
          <label style={labelStyle}>Title</label>
          <input name="title" required style={inputStyle} placeholder="Your article title" />
        </div>

        <div>
          <label style={labelStyle}>Slug</label>
          <input name="slug" required style={inputStyle} placeholder="your-article-slug" />
        </div>

        <div>
          <label style={labelStyle}>Excerpt</label>
          <input name="excerpt" style={inputStyle} placeholder="Short description (optional)" />
        </div>

        <div>
          <label style={labelStyle}>Cover Image URL</label>
          <input name="coverImage" style={inputStyle} placeholder="https://... (optional)" />
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          {categories.length === 0 ? (
            <p style={{ color: "#E24B4A", fontSize: "13px" }}>
              No categories found. <a href="/admin/categories" style={{ color: "#1D9E75" }}>Seed categories first →</a>
            </p>
          ) : (
            <select name="categoryId" required style={inputStyle}>
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea
            name="content"
            required
            rows={20}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px", resize: "vertical" }}
            placeholder="Write your article in Markdown..."
          />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" style={inputStyle}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={{
            backgroundColor: "#1D9E75",
            color: "#fff",
            padding: "12px 28px",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: "pointer",
          }}>
            Save Article
          </button>
          <a href="/admin/articles" style={{
            padding: "12px 20px",
            color: "#6b6b63",
            fontSize: "14px",
            textDecoration: "none",
          }}>
            Cancel
          </a>
        </div>

      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#1a1a18",
  marginBottom: "6px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#1a1a18",
  backgroundColor: "#ffffff",
  fontFamily: "DM Sans, sans-serif",
  boxSizing: "border-box",
}
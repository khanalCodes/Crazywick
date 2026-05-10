import { prisma } from "@/lib/prisma"
import { createArticle } from "../actions"
import ArticleEditor from "@/components/ArticleEditor"
import CoverImageUpload from "@/components/CoverImageUpload"

type CategoryRow = Awaited<ReturnType<typeof prisma.category.findMany>>[number]

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  return (
    <div style={{ maxWidth: "860px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18", marginBottom: "32px" }}>
        New Article
      </h1>

      <form action={createArticle} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input name="title" required style={inputStyle} placeholder="Your article title" />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input name="slug" required style={inputStyle} placeholder="your-article-slug" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Excerpt</label>
          <input name="excerpt" style={inputStyle} placeholder="Short description shown in article list" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Category</label>
            {categories.length === 0 ? (
              <p style={{ color: "#E24B4A", fontSize: "13px" }}>
                No categories found. <a href="/admin/categories" style={{ color: "#1D9E75" }}>Seed categories first →</a>
              </p>
            ) : (
              <select name="categoryId" required style={inputStyle}>
                <option value="">Select category</option>
                {categories.map((cat: CategoryRow) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" style={inputStyle}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Cover Image</label>
          <p style={{ fontSize: 12, color: "#6b6b63", fontFamily: "DM Sans, sans-serif", marginBottom: 8 }}>
            Used as the article header and OG image for sharing.
          </p>
          <CoverImageUpload name="coverImage" />
        </div>

        <div>
          <label style={labelStyle}>Content</label>
          <p style={{ fontSize: 12, color: "#6b6b63", fontFamily: "DM Sans, sans-serif", marginBottom: 8 }}>
            Use the toolbar to format. Click 🖼️ to upload images from your PC with alt text and captions.
          </p>
          <ArticleEditor name="content" />
        </div>

        <div style={{ display: "flex", gap: "12px", paddingTop: 8 }}>
          <button type="submit" style={{
            backgroundColor: "#1D9E75", color: "#fff", padding: "12px 28px",
            border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 500, cursor: "pointer",
          }}>
            Save Article
          </button>
          <a href="/admin/articles" style={{ padding: "12px 20px", color: "#6b6b63", fontSize: "14px", textDecoration: "none" }}>
            Cancel
          </a>
        </div>

      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "13px", fontWeight: 600, color: "#1a1a18", marginBottom: "6px",
}
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px",
  fontSize: "14px", color: "#1a1a18", backgroundColor: "#ffffff",
  fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
}

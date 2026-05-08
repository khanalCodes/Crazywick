import { prisma } from "@/lib/prisma"
import { seedCategories, deleteCategory } from "./actions"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  })

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18" }}>
          Categories
        </h1>
        <form action={seedCategories}>
          <button type="submit" style={{
            backgroundColor: "#F5A623",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}>
            Seed All 9 Categories
          </button>
        </form>
      </div>

      {categories.length === 0 ? (
        <p style={{ color: "#6b6b63", fontSize: "14px" }}>
          No categories yet. Click "Seed All 9 Categories" to add them.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {categories.map(cat => (
            <div key={cat.id} style={{
              backgroundColor: "#f7f6f3",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "10px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "#1a1a18", fontSize: "14px" }}>{cat.name}</div>
                <div style={{ color: "#aaa9a0", fontSize: "12px" }}>{cat.slug}</div>
              </div>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={cat.id} />
                <button type="submit" style={{
                  background: "none",
                  border: "none",
                  color: "#E24B4A",
                  fontSize: "12px",
                  cursor: "pointer",
                }}>
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
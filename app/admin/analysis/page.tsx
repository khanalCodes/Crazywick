import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { deleteAnalysis } from "./actions"

const BIAS_COLORS: Record<string, { bg: string; color: string }> = {
  BULLISH:          { bg: "#f0faf6", color: "#1D9E75" },
  STRONGLY_BULLISH: { bg: "#e6f7f1", color: "#0F6E56" },
  NEUTRAL:          { bg: "#fff8e6", color: "#c07a00" },
  BEARISH:          { bg: "#fef0f0", color: "#E24B4A" },
  STRONGLY_BEARISH: { bg: "#fde8e8", color: "#9b1c1c" },
}

type AnalysisRow = Awaited<ReturnType<typeof prisma.analysis.findMany>>[number]

export default async function AdminAnalysisPage() {
  const analyses = await prisma.analysis.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, color: "#1a1a18" }}>Analysis</h1>
        <Link href="/admin/analysis/new" style={{
          backgroundColor: "#1D9E75", color: "#fff", padding: "10px 20px",
          borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500,
        }}>
          + New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <p style={{ color: "#6b6b63", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>
          No analysis yet. Create your first one.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {analyses.map((a: AnalysisRow) => {
            const biasStyle    = BIAS_COLORS[a.bias] ?? BIAS_COLORS.NEUTRAL
            const deleteWithId = deleteAnalysis.bind(null, a.id)
            return (
              <div key={a.id} style={{
                backgroundColor: "#f7f6f3", border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 10, padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", flex: 1 }}>
                  {a.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.imageUrl} alt={a.asset} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a1a18", fontSize: 15, marginBottom: 4 }}>
                      {a.asset}
                      <span style={{ marginLeft: 8, fontSize: 13, color: "#6b6b63", fontWeight: 400 }}>{a.symbol}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 12, padding: "2px 8px", borderRadius: 6, fontWeight: 600,
                        background: biasStyle.bg, color: biasStyle.color,
                        fontFamily: "DM Sans, sans-serif",
                      }}>
                        {a.bias.replace("_", " ")}
                      </span>
                      <span style={{ fontSize: 12, color: "#aaa9a0", fontFamily: "DM Sans, sans-serif" }}>
                        {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span style={{ fontSize: 12, color: a.isPublic ? "#1D9E75" : "#aaa9a0", fontFamily: "DM Sans, sans-serif" }}>
                        {a.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Link href={`/admin/analysis/${a.id}/edit`} style={{
                    padding: "7px 14px", borderRadius: 7, border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: 13, color: "#1a1a18", textDecoration: "none", fontFamily: "DM Sans, sans-serif",
                  }}>
                    Edit
                  </Link>
                  <form action={deleteWithId}>
                    <button
                      type="submit"
                      style={{
                        padding: "7px 14px", borderRadius: 7,
                        border: "1px solid rgba(226,75,74,0.3)",
                        background: "#fef0f0", color: "#E24B4A",
                        fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                      }}
                      onClick={(e) => { if (!confirm("Delete this analysis?")) e.preventDefault() }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

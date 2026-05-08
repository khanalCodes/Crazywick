import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminPredictionsPage() {
  const predictions = await prisma.prediction.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18" }}>
          Predictions
        </h1>
        <Link href="/admin/predictions/new" style={{
          backgroundColor: "#1D9E75",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
        }}>
          + New Prediction
        </Link>
      </div>

      {predictions.length === 0 ? (
        <p style={{ color: "#6b6b63", fontSize: "14px" }}>No predictions yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {predictions.map(p => (
            <div key={p.id} style={{
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
                  {p.title}
                </div>
                <div style={{ color: "#6b6b63", fontSize: "13px" }}>
                  {p.asset} · {p.direction} · {p.type} · {p.status}
                </div>
              </div>
              <div style={{
                fontSize: "13px",
                color: p.direction === "BULLISH" ? "#1D9E75" : "#E24B4A",
                fontWeight: 600,
              }}>
                {p.probability ? `${p.probability}%` : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
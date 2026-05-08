import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminJournalPage() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { openedAt: "desc" },
  })

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18" }}>
          Journal
        </h1>
        <Link href="/admin/journal/new" style={{
          backgroundColor: "#1D9E75",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
        }}>
          + New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <p style={{ color: "#6b6b63", fontSize: "14px" }}>No journal entries yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {entries.map((entry: any) => (
            <div key={entry.id} style={{
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
                  {entry.asset} — {entry.direction}
                </div>
                <div style={{ color: "#6b6b63", fontSize: "13px" }}>
                  {entry.market} · Entry: {Number(entry.entryPrice)} · {entry.result} · {new Date(entry.openedAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: entry.result === "WIN" ? "#1D9E75" : entry.result === "LOSS" ? "#E24B4A" : "#F5A623",
              }}>
                {entry.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
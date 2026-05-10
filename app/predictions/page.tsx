import { getAllPredictions } from "@/lib/articles"
import Link from "next/link"
import PredictionVoteBar from "@/components/PredictionVoteBar"
import ReactionBar from "@/components/ReactionBar"

export const metadata = {
  title: "Predictions — CrazyWick",
  description: "Documented market and macro predictions with full track record.",
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  OPEN:      { bg: "#fff8e6",        color: "#c07a00",         label: "Open" },
  CORRECT:   { bg: "#f0faf6",        color: "#1D9E75",         label: "✓ Correct" },
  INCORRECT: { bg: "#fef0f0",        color: "#E24B4A",         label: "✗ Incorrect" },
  EXPIRED:   { bg: "var(--card-bg)", color: "var(--text-dim)", label: "Expired" },
  CANCELLED: { bg: "var(--card-bg)", color: "var(--text-dim)", label: "Cancelled" },
}

const DIR_COLOR: Record<string, string> = {
  BULLISH:   "#1D9E75",
  BEARISH:   "#E24B4A",
  NEUTRAL:   "#F5A623",
  LIKELY:    "#1D9E75",
  UNLIKELY:  "#E24B4A",
  UNCERTAIN: "#F5A623",
}

export default async function PredictionsPage() {
  const predictions = await getAllPredictions()

  const resolved = predictions.filter((p) => ["CORRECT", "INCORRECT"].includes(p.status))
  const correct  = predictions.filter((p) => p.status === "CORRECT").length
  const accuracy = resolved.length > 0 ? Math.round((correct / resolved.length) * 100) : null

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
        Predictions
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 36, fontFamily: "DM Sans, sans-serif" }}>
        Every call documented. Full track record, no cherry-picking.
      </p>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 16, marginBottom: 52, flexWrap: "wrap" }}>
        {[
          { label: "Total",     value: predictions.length },
          { label: "Open",      value: predictions.filter((p) => p.status === "OPEN").length },
          { label: "Correct",   value: correct },
          { label: "Incorrect", value: predictions.filter((p) => p.status === "INCORRECT").length },
          { label: "Accuracy",  value: accuracy !== null ? `${accuracy}%` : "—" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "16px 24px", minWidth: 110, textAlign: "center",
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "DM Sans, sans-serif" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {predictions.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 80, fontFamily: "DM Sans, sans-serif" }}>
          No predictions published yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {predictions.map((p) => {
            const statusStyle = STATUS_STYLES[p.status] ?? STATUS_STYLES.OPEN
            return (
              <Link key={p.id} href={`/predictions/${p.id}`} style={{ textDecoration: "none" }}>
                <div className="prediction-card" style={{
                  background: "var(--card-bg)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "28px", cursor: "pointer",
                }}>

                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
                        {p.asset}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: DIR_COLOR[p.direction] ?? "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>
                        {p.direction}
                      </span>
                      <span style={{
                        fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                        background: statusStyle.bg, color: statusStyle.color, fontFamily: "DM Sans, sans-serif",
                      }}>
                        {statusStyle.label}
                      </span>
                      <span style={{
                        fontSize: 12, padding: "3px 10px", borderRadius: 20,
                        background: "var(--card-bg)", border: "1px solid var(--border)",
                        color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif",
                      }}>
                        {p.type}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif" }}>
                      {new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>

                  {/* Title + thesis */}
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 21, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 16 }}>
                    {p.thesis}
                  </p>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif", flexWrap: "wrap", marginBottom: 16 }}>
                    <span>⏱ {p.timeframe}</span>
                    {p.target && <span>🎯 Target: {p.target}</span>}
                    {p.probability !== null && <span>📊 Confidence: {p.probability}%</span>}
                    {p.resolvedAt && (
                      <span>✅ Resolved: {new Date(p.resolvedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    )}
                    {p.articleSlug && (
                      <Link href={`/articles/${p.articleSlug}`} onClick={(e) => e.stopPropagation()} style={{ color: "var(--green-accent)", textDecoration: "none", fontWeight: 600 }}>
                        Read full thesis →
                      </Link>
                    )}
                  </div>

                  {/* Outcome note */}
                  {p.outcomeNote && (
                    <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, background: "#f0faf6", border: "1px solid var(--green-light-border)", fontSize: 13, color: "var(--green-dark)", fontFamily: "DM Sans, sans-serif" }}>
                      <strong>Outcome:</strong> {p.outcomeNote}
                    </div>
                  )}

                  {/* Vote bar */}
                  <PredictionVoteBar
                    predictionId={p.id}
                    initialAgree={p.agreeCount}
                    initialDisagree={p.disagreeCount}
                  />

                  {/* Reactions */}
                  <ReactionBar predictionId={p.id} />

                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
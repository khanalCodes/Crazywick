import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import PredictionVoteBar from "@/components/PredictionVoteBar"
import ReactionBar from "@/components/ReactionBar"

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  OPEN:      { bg: "#fff8e6",  color: "#c07a00", label: "Open" },
  CORRECT:   { bg: "#f0faf6",  color: "#1D9E75", label: "✓ Correct" },
  INCORRECT: { bg: "#fef0f0",  color: "#E24B4A", label: "✗ Incorrect" },
  EXPIRED:   { bg: "#f5f5f3",  color: "#aaa9a0", label: "Expired" },
  CANCELLED: { bg: "#f5f5f3",  color: "#aaa9a0", label: "Cancelled" },
}

const DIR_COLOR: Record<string, string> = {
  BULLISH:   "#1D9E75",
  BEARISH:   "#E24B4A",
  NEUTRAL:   "#F5A623",
  LIKELY:    "#1D9E75",
  UNLIKELY:  "#E24B4A",
  UNCERTAIN: "#F5A623",
}

export default async function PredictionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const p = await prisma.prediction.findUnique({
    where: { id },
    include: { author: true },
  })

  if (!p) notFound()

  const statusStyle = STATUS_STYLES[p.status] ?? STATUS_STYLES.OPEN

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>

      {/* Back link */}
      <Link href="/predictions" style={{
        fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "var(--text-muted)",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32,
      }}>
        ← All Predictions
      </Link>

      {/* Badges */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
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

      {/* Title */}
      <h1 style={{
        fontFamily: "Playfair Display, serif", fontSize: 34, fontWeight: 700,
        color: "var(--text-primary)", marginBottom: 12, lineHeight: 1.3,
      }}>
        {p.title}
      </h1>

      {/* Meta row */}
      <div style={{
        display: "flex", gap: 20, fontSize: 13, color: "var(--text-dim)",
        fontFamily: "DM Sans, sans-serif", flexWrap: "wrap", marginBottom: 28,
      }}>
        <span>{new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        <span>⏱ {p.timeframe}</span>
        {p.target      && <span>🎯 Target: {p.target}</span>}
        {p.probability !== null && <span>📊 Confidence: {p.probability}%</span>}
        {p.resolvedAt  && <span>✅ Resolved: {new Date(p.resolvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 28 }} />

      {/* Thesis */}
      <p style={{
        fontFamily: "DM Sans, sans-serif", fontSize: 16, color: "var(--text-muted)",
        lineHeight: 1.85, marginBottom: 28,
      }}>
        {p.thesis}
      </p>

      {/* Outcome note */}
      {p.outcomeNote && (
        <div style={{
          marginBottom: 28, padding: "14px 18px", borderRadius: 10,
          background: "#f0faf6", border: "1px solid var(--green-light-border)",
          fontSize: 14, color: "var(--green-dark)", fontFamily: "DM Sans, sans-serif",
        }}>
          <strong>Outcome:</strong> {p.outcomeNote}
        </div>
      )}

      {/* Full thesis article link */}
      {p.articleSlug && (
        <Link href={`/articles/${p.articleSlug}`} style={{
          display: "inline-block", marginBottom: 28,
          color: "var(--green-accent)", textDecoration: "none",
          fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14,
        }}>
          Read full thesis →
        </Link>
      )}

      {/* Vote bar */}
      <PredictionVoteBar
        predictionId={p.id}
        initialAgree={p.agreeCount}
        initialDisagree={p.disagreeCount}
      />

      {/* Reactions */}
      <ReactionBar predictionId={p.id} />

    </main>
  )
}
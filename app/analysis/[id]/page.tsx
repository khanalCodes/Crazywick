import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ReactionBar from "@/components/ReactionBar"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const a = await prisma.analysis.findUnique({ where: { id }, select: { asset: true, symbol: true, bias: true } })
  if (!a) return { title: "Not Found — CrazyWick" }
  return { title: `${a.asset} (${a.symbol}) Analysis — CrazyWick` }
}

const BIAS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  BULLISH:          { bg: "#f0faf6", color: "#1D9E75",  label: "🐂 Bullish" },
  STRONGLY_BULLISH: { bg: "#e6f7f1", color: "#0F6E56",  label: "🚀 Strongly Bullish" },
  NEUTRAL:          { bg: "#fff8e6", color: "#c07a00",  label: "⚖️ Neutral" },
  BEARISH:          { bg: "#fef0f0", color: "#E24B4A",  label: "🐻 Bearish" },
  STRONGLY_BEARISH: { bg: "#fde8e8", color: "#9b1c1c",  label: "💀 Strongly Bearish" },
}

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const a = await prisma.analysis.findUnique({
    where: { id, deletedAt: null, isPublic: true },
    include: { author: { select: { name: true, image: true } } },
  })

  if (!a) notFound()

  await prisma.analysis.update({ where: { id }, data: { viewCount: { increment: 1 } } })

  const biasStyle  = BIAS_STYLES[a.bias] ?? BIAS_STYLES.NEUTRAL
  const support    = Array.isArray(a.supportLevels)    ? (a.supportLevels    as string[]) : []
  const resistance = Array.isArray(a.resistanceLevels) ? (a.resistanceLevels as string[]) : []
  const key        = a.keyLevels && Array.isArray(a.keyLevels) ? (a.keyLevels as string[]) : []

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 28, fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "var(--text-muted)" }}>
        <Link href="/analysis" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Analysis</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--green-accent)" }}>{a.symbol}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            {a.asset}
          </h1>
          <span style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>
            {a.symbol}
          </span>
          <span style={{ fontSize: 13, padding: "5px 12px", borderRadius: 20, fontWeight: 700, background: biasStyle.bg, color: biasStyle.color, fontFamily: "DM Sans, sans-serif" }}>
            {biasStyle.label}
          </span>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif", paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
          <span>{a.author?.name ?? "CrazyWick"}</span>
          <span>·</span>
          <span>{new Date(a.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>·</span>
          <span>{a.viewCount + 1} views</span>
        </div>
      </div>

      {/* Chart image */}
      {a.imageUrl && (
        <div style={{ marginBottom: 36 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.imageUrl}
            alt={`${a.asset} chart analysis`}
            style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </div>
      )}

      {/* Key levels */}
      {(support.length > 0 || resistance.length > 0 || key.length > 0) && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
          {[
            { items: support,    label: "Support",    color: "#1D9E75", bg: "#f0faf6" },
            { items: resistance, label: "Resistance", color: "#E24B4A", bg: "#fef0f0" },
            { items: key,        label: "Key Levels", color: "#F5A623", bg: "#fff8e6" },
          ].filter(l => l.items.length > 0).map((lvl) => (
            <div key={lvl.label} style={{ background: lvl.bg, border: `1px solid ${lvl.color}30`, borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: lvl.color, fontFamily: "DM Sans, sans-serif", marginBottom: 6, letterSpacing: "0.05em" }}>
                {lvl.label.toUpperCase()}
              </div>
              {lvl.items.map((item, i) => (
                <div key={i} style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif" }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Thesis */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
          Thesis
        </h2>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16, lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
          {a.thesis}
        </p>
      </div>

      {/* Watch For */}
      {a.watchFor && (
        <div style={{ padding: "20px 24px", borderRadius: 12, background: "#fff8e6", border: "1px solid #f5a62330", marginBottom: 36 }}>
          <h3 style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, color: "#c07a00", marginBottom: 8, letterSpacing: "0.05em" }}>
            ⚠️ WATCH FOR (INVALIDATION)
          </h3>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, lineHeight: 1.7, color: "var(--text-primary)", margin: 0, whiteSpace: "pre-wrap" }}>
            {a.watchFor}
          </p>
        </div>
      )}

      {/* Reactions */}
      <div style={{ paddingTop: 32, borderTop: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>
          What do you think of this analysis?
        </p>
        <ReactionBar analysisId={a.id} />
      </div>
    </main>
  )
}
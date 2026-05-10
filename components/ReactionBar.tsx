"use client"

import { useState, useEffect } from "react"

const REACTIONS = [
  { type: "INSIGHTFUL", emoji: "💡", label: "Insightful" },
  { type: "BULLISH",    emoji: "🐂", label: "Bullish" },
  { type: "BEARISH",    emoji: "🐻", label: "Bearish" },
  { type: "DISAGREE",   emoji: "🤔", label: "Disagree" },
  { type: "LOVE",       emoji: "❤️",  label: "Love" },
]

type Props = {
  articleId?: string
  predictionId?: string
  analysisId?: string
}

export default function ReactionBar({ articleId, predictionId, analysisId }: Props) {
  const [counts, setCounts]         = useState<Record<string, number>>({})
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [loading, setLoading]       = useState<string | null>(null)

  const target = articleId
    ? `articleId=${articleId}`
    : predictionId
    ? `predictionId=${predictionId}`
    : `analysisId=${analysisId}`

  useEffect(() => {
    fetch(`/api/reactions?${target}`)
      .then((r) => r.json())
      .then((d) => {
        setCounts(d.counts ?? {})
        const ur = d.userReactions ?? []
        setUserReaction(Array.isArray(ur) ? (ur[0] ?? null) : ur)
      })
  }, [target])

  const handleReact = async (type: string) => {
    if (loading) return
    setLoading(type)

    const res  = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, articleId, predictionId, analysisId }),
    })
    const data = await res.json()
    setLoading(null)

    if (data.reacted) {
      // Deduct old reaction if switching
      if (userReaction && userReaction !== type) {
        setCounts((c) => ({ ...c, [userReaction]: Math.max((c[userReaction] ?? 1) - 1, 0) }))
      }
      setCounts((c) => ({ ...c, [type]: (c[type] ?? 0) + 1 }))
      setUserReaction(type)
    } else {
      setCounts((c) => ({ ...c, [type]: Math.max((c[type] ?? 1) - 1, 0) }))
      setUserReaction(null)
    }
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "24px 0" }}>
      {REACTIONS.map((r) => {
        const active = userReaction === r.type
        return (
          <button
            key={r.type}
            onClick={() => handleReact(r.type)}
            disabled={!!loading}
            title={r.label}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 20,
              border: active ? "1.5px solid var(--green-accent)" : "1px solid var(--border)",
              background: active ? "var(--green-light-bg)" : "var(--card-bg)",
              color: active ? "var(--green-accent)" : "var(--text-muted)",
              fontSize: 13, fontFamily: "DM Sans, sans-serif",
              fontWeight: active ? 600 : 400,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              opacity: loading === r.type ? 0.6 : 1,
            }}
          >
            <span>{r.emoji}</span>
            {(counts[r.type] ?? 0) > 0 && <span>{counts[r.type]}</span>}
          </button>
        )
      })}
    </div>
  )
}
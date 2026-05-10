"use client"

import { useState, useEffect } from "react"

type Props = {
  predictionId: string
  initialAgree?: number
  initialDisagree?: number
}

export default function PredictionVoteBar({ predictionId, initialAgree = 0, initialDisagree = 0 }: Props) {
  const [agreeCount,    setAgreeCount]    = useState(initialAgree)
  const [disagreeCount, setDisagreeCount] = useState(initialDisagree)
  const [userVote,      setUserVote]      = useState<boolean | null>(null)
  const [loading,       setLoading]       = useState(false)

  useEffect(() => {
    fetch(`/api/predictions/vote?predictionId=${predictionId}`)
      .then((r) => r.json())
      .then((d) => {
        setAgreeCount(d.agreeCount    ?? initialAgree)
        setDisagreeCount(d.disagreeCount ?? initialDisagree)
        setUserVote(d.userVote ?? null)
      })
  }, [predictionId, initialAgree, initialDisagree])

  const vote = async (agrees: boolean) => {
    setLoading(true)
    const res  = await fetch("/api/predictions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ predictionId, agrees }),
    })
    const data = await res.json()
    setLoading(false)

    if (!data.voted) {
      // Removed vote
      if (userVote === true)  setAgreeCount((c)    => Math.max(c - 1, 0))
      if (userVote === false) setDisagreeCount((c) => Math.max(c - 1, 0))
      setUserVote(null)
      return
    }
    // New or switched vote
    if (userVote !== null && userVote !== agrees) {
      if (agrees) { setAgreeCount((c) => c + 1); setDisagreeCount((c) => Math.max(c - 1, 0)) }
      else        { setDisagreeCount((c) => c + 1); setAgreeCount((c) => Math.max(c - 1, 0)) }
    } else if (userVote === null) {
      if (agrees) setAgreeCount((c) => c + 1)
      else        setDisagreeCount((c) => c + 1)
    }
    setUserVote(agrees)
  }

  const total    = agreeCount + disagreeCount
  const agreePct = total > 0 ? Math.round((agreeCount / total) * 100) : 50

  return (
    <div style={{ margin: "20px 0" }}>
      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 4, background: "var(--border)", overflow: "hidden", marginBottom: 12 }}>
        <div style={{
          height: "100%", width: `${agreePct}%`,
          background: "var(--green-accent)", borderRadius: 4, transition: "width 0.3s",
        }} />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          onClick={() => vote(true)}
          disabled={loading}
          style={{
            flex: 1, padding: "10px", borderRadius: 8,
            border: userVote === true ? "1.5px solid var(--green-accent)" : "1px solid var(--border)",
            background: userVote === true ? "var(--green-light-bg)" : "var(--card-bg)",
            color: userVote === true ? "var(--green-accent)" : "var(--text-muted)",
            fontFamily: "DM Sans, sans-serif", fontSize: 13,
            fontWeight: userVote === true ? 700 : 400,
            cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s",
          }}
        >
          🐂 Agree · {agreeCount}
        </button>
        <button
          onClick={() => vote(false)}
          disabled={loading}
          style={{
            flex: 1, padding: "10px", borderRadius: 8,
            border: userVote === false ? "1.5px solid var(--red)" : "1px solid var(--border)",
            background: userVote === false ? "#fef0f0" : "var(--card-bg)",
            color: userVote === false ? "var(--red)" : "var(--text-muted)",
            fontFamily: "DM Sans, sans-serif", fontSize: 13,
            fontWeight: userVote === false ? 700 : 400,
            cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s",
          }}
        >
          🐻 Disagree · {disagreeCount}
        </button>
      </div>

      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "var(--text-dim)", textAlign: "center", marginTop: 6 }}>
        {total} vote{total !== 1 ? "s" : ""} · {agreePct}% agree
      </p>
    </div>
  )
}

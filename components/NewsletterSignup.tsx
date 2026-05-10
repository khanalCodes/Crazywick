"use client"

import { useState } from "react"

export default function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    if (!email.trim()) return
    setStatus("loading")
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      setStatus("error")
      setMessage(data.error ?? "Something went wrong.")
      return
    }
    setStatus("success")
    setMessage(data.alreadySubscribed ? "You're already subscribed!" : data.resubscribed ? "Welcome back!" : "You're in. Intelligence incoming.")
  }

  if (compact) {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {status === "success" ? (
          <p style={{ color: "var(--green-accent)", fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600, margin: 0 }}>✓ {message}</p>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading" || !email.trim()}
              style={{ padding: "10px 18px", borderRadius: 8, background: "var(--green-accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: status === "loading" ? 0.6 : 1 }}
            >
              {status === "loading" ? "…" : "Subscribe"}
            </button>
          </>
        )}
        {status === "error" && <p style={{ color: "var(--red)", fontFamily: "DM Sans, sans-serif", fontSize: 13, width: "100%", margin: 0 }}>{message}</p>}
      </div>
    )
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "40px 36px", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📡</div>
      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
        Financial Intelligence. Weekly.
      </h3>
      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6 }}>
        Global markets, macro shifts, and documented predictions — straight to your inbox. No noise.
      </p>

      {status === "success" ? (
        <div style={{ padding: "16px", borderRadius: 10, background: "var(--green-light-bg)", border: "1px solid var(--green-light-border)" }}>
          <p style={{ color: "var(--green-dark)", fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 600, margin: 0 }}>✓ {message}</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="your@email.com"
              style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading" || !email.trim()}
              style={{ padding: "12px 20px", borderRadius: 8, background: "var(--green-accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", opacity: status === "loading" ? 0.6 : 1 }}
            >
              {status === "loading" ? "…" : "Subscribe Free"}
            </button>
          </div>
          {status === "error" && <p style={{ color: "var(--red)", fontFamily: "DM Sans, sans-serif", fontSize: 13, marginTop: 8 }}>{message}</p>}
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "var(--text-dim)", marginTop: 12 }}>No spam. Unsubscribe anytime.</p>
        </>
      )}
    </div>
  )
}

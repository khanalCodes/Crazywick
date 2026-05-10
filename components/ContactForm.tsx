"use client"

import { useState } from "react"

export default function ContactForm() {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError]     = useState("")

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.")
      return
    }
    setStatus("loading")
    setError("")

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    })
    const data = await res.json()

    if (!res.ok || data.error) {
      setStatus("error")
      setError(data.error ?? "Something went wrong. Try again.")
      return
    }

    setStatus("success")
  }

  if (status === "success") {
    return (
      <div style={{
        padding: "40px 32px", borderRadius: 14, background: "var(--green-light-bg)",
        border: "1px solid var(--green-light-border)", textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
        <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
          Message received!
        </h3>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Thanks for reaching out. I'll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={labelStyle}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind? Markets, feedback, collab ideas — anything goes."
          rows={6}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
        />
      </div>

      {error && (
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "var(--red)", margin: 0 }}>
          {error}
        </p>
      )}

      <div>
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          style={{
            padding: "13px 32px", borderRadius: 9, background: "var(--green-accent)",
            color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif",
            fontSize: 15, fontWeight: 600, cursor: status === "loading" ? "not-allowed" : "pointer",
            opacity: status === "loading" ? 0.7 : 1, transition: "opacity 0.15s",
          }}
        >
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
      </div>

    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600,
  color: "var(--text-primary)", marginBottom: 6,
  fontFamily: "DM Sans, sans-serif",
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  border: "1px solid var(--border)", borderRadius: 9,
  fontSize: 14, color: "var(--text-primary)",
  backgroundColor: "var(--card-bg)",
  fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
  outline: "none",
}

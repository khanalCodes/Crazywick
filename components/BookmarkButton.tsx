"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function BookmarkButton({ articleId }: { articleId: string }) {
  const { data: session } = useSession()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch(`/api/bookmarks?articleId=${articleId}`)
      .then((r) => r.json())
      .then((d) => setBookmarked(d.bookmarked))
  }, [articleId, session])

  const toggle = async () => {
    if (!session) { window.location.href = "/login"; return }
    setLoading(true)
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    })
    const data = await res.json()
    setBookmarked(data.bookmarked)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? "Remove bookmark" : "Bookmark this article"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 8,
        border: bookmarked ? "1.5px solid var(--green-accent)" : "1px solid var(--border)",
        background: bookmarked ? "var(--green-light-bg)" : "var(--card-bg)",
        color: bookmarked ? "var(--green-accent)" : "var(--text-muted)",
        fontSize: 13,
        fontFamily: "DM Sans, sans-serif",
        fontWeight: bookmarked ? 600 : 400,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "all 0.15s",
      }}
    >
      <span>{bookmarked ? "🔖" : "🔖"}</span>
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </button>
  )
}

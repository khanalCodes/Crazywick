"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function FollowButton({ followingId }: { followingId: string }) {
  const { data: session } = useSession()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user?.id || session.user.id === followingId) return
    fetch(`/api/follow?followingId=${followingId}`)
      .then((r) => r.json())
      .then((d) => setFollowing(d.following))
  }, [followingId, session])

  // Don't show button for own profile
  if (session?.user?.id === followingId) return null

  const toggle = async () => {
    if (!session) { window.location.href = "/login"; return }
    setLoading(true)
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followingId }),
    })
    const data = await res.json()
    setFollowing(data.following)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        padding: "8px 20px",
        borderRadius: 8,
        border: following ? "1.5px solid var(--green-accent)" : "1px solid var(--border)",
        background: following ? "var(--green-light-bg)" : "var(--green-accent)",
        color: following ? "var(--green-accent)" : "#fff",
        fontSize: 13,
        fontFamily: "DM Sans, sans-serif",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "all 0.15s",
      }}
    >
      {loading ? "…" : following ? "Following" : "Follow"}
    </button>
  )
}

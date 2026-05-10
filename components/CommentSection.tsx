"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"

type Author = { id: string; name: string | null; image: string | null; username: string | null }

type CommentData = {
  id: string
  content: string
  createdAt: string
  isPinned: boolean
  likeCount: number
  author: Author
  replies: CommentData[]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Avatar({ author }: { author: Author }) {
  if (author.image) {
    return (
      <Image
        src={author.image}
        alt={author.name ?? "User"}
        width={32}
        height={32}
        style={{ borderRadius: "50%", flexShrink: 0 }}
      />
    )
  }
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", background: "var(--green-light-bg)",
      border: "1px solid var(--green-light-border)", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--green-accent)",
      flexShrink: 0, fontFamily: "DM Sans, sans-serif",
    }}>
      {(author.name ?? "U")[0].toUpperCase()}
    </div>
  )
}

function CommentItem({
  comment,
  articleId,
  sessionUserId,
  onDelete,
  onReply,
}: {
  comment: CommentData
  articleId: string
  sessionUserId?: string
  onDelete: (id: string) => void
  onReply: (parentId: string, content: string) => Promise<void>
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleReply = async () => {
    if (!replyText.trim()) return
    setSubmitting(true)
    await onReply(comment.id, replyText)
    setReplyText("")
    setShowReply(false)
    setSubmitting(false)
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Avatar author={comment.author} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
              {comment.author.name ?? "Anonymous"}
            </span>
            {comment.isPinned && (
              <span style={{ fontSize: 11, color: "var(--green-accent)", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>📌 Pinned</span>
            )}
            <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif" }}>{timeAgo(comment.createdAt)}</span>
          </div>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6, margin: 0, marginBottom: 8 }}>
            {comment.content}
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => setShowReply(!showReply)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", padding: 0 }}
            >
              Reply
            </button>
            {sessionUserId === comment.author.id && (
              <button
                onClick={() => onDelete(comment.id)}
                style={{ background: "none", border: "none", color: "var(--red)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", padding: 0 }}
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply box */}
          {showReply && (
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                rows={2}
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif", fontSize: 13, resize: "vertical" }}
              />
              <button
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                style={{ padding: "8px 14px", borderRadius: 8, background: "var(--green-accent)", color: "#fff", border: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif", cursor: "pointer", alignSelf: "flex-start", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "…" : "Reply"}
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div style={{ marginTop: 16, paddingLeft: 16, borderLeft: "2px solid var(--border)" }}>
              {comment.replies.map((reply) => (
                <div key={reply.id} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <Avatar author={reply.author} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                        {reply.author.name ?? "Anonymous"}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif" }}>{timeAgo(reply.createdAt)}</span>
                    </div>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>
                      {reply.content}
                    </p>
                    {sessionUserId === reply.author.id && (
                      <button
                        onClick={() => onDelete(reply.id)}
                        style={{ background: "none", border: "none", color: "var(--red)", fontSize: 11, cursor: "pointer", fontFamily: "DM Sans, sans-serif", padding: "4px 0 0 0" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<CommentData[]>([])
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?articleId=${articleId}`)
    const data = await res.json()
    setComments(data.comments ?? [])
    setLoading(false)
  }, [articleId])

  useEffect(() => { fetchComments() }, [fetchComments])

  const handleSubmit = async () => {
    if (!text.trim() || !session) return
    setSubmitting(true)
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, content: text }),
    })
    const data = await res.json()
    if (data.comment) {
      setComments((c) => [{ ...data.comment, replies: [] }, ...c])
      setText("")
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/comments/${id}`, { method: "DELETE" })
    await fetchComments()
  }

  const handleReply = async (parentId: string, content: string) => {
    if (!session) { window.location.href = "/login"; return }
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, content, parentId }),
    })
    const data = await res.json()
    if (data.comment) await fetchComments()
  }

  return (
    <div style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid var(--border)" }}>
      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>
        {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}` : "Comments"}
      </h3>

      {/* Compose */}
      {session ? (
        <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
          <Avatar author={{ id: session.user?.id ?? "", name: session.user?.name ?? null, image: session.user?.image ?? null, username: null }} />
          <div style={{ flex: 1 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif", fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={handleSubmit}
                disabled={submitting || !text.trim()}
                style={{ padding: "10px 20px", borderRadius: 8, background: "var(--green-accent)", color: "#fff", border: "none", fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 600, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "16px 20px", borderRadius: 10, background: "var(--card-bg)", border: "1px solid var(--border)", marginBottom: 32, fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text-muted)" }}>
          <a href="/login" style={{ color: "var(--green-accent)", textDecoration: "none", fontWeight: 600 }}>Sign in</a> to join the discussion.
        </div>
      )}

      {/* List */}
      {loading ? (
        <p style={{ color: "var(--text-dim)", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}>Loading…</p>
      ) : comments.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}>No comments yet. Be the first.</p>
      ) : (
        comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            articleId={articleId}
            sessionUserId={session?.user?.id}
            onDelete={handleDelete}
            onReply={handleReply}
          />
        ))
      )}
    </div>
  )
}

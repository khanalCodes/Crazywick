"use client"

import { useState, useRef } from "react"
import ImageUploadBlock from "./ImageUploadBlock"

type Props = {
  initialContent?: string
  name?: string
}

export default function ArticleEditor({ initialContent = "", name = "content" }: Props) {
  const [content, setContent] = useState(initialContent)
  const [showImageModal, setShowImageModal] = useState(false)
  const [tab, setTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertAtCursor = (text: string) => {
    const ta = textareaRef.current
    if (!ta) { setContent((c) => c + "\n" + text); return }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newContent = content.slice(0, start) + "\n" + text + "\n" + content.slice(end)
    setContent(newContent)
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + text.length + 2
      ta.focus()
    }, 0)
  }

  const wrapSelection = (before: string, after: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end) || "text"
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(newContent)
    setTimeout(() => {
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + selected.length
      ta.focus()
    }, 0)
  }

  const toolbarButtons = [
    { label: "B", title: "Bold", action: () => wrapSelection("<strong>", "</strong>") },
    { label: "I", title: "Italic", action: () => wrapSelection("<em>", "</em>") },
    { label: "H2", title: "Heading 2", action: () => insertAtCursor('<h2 style="font-family:\'Playfair Display\',serif;font-size:26px;font-weight:700;color:#1a1a18;margin:32px 0 16px;">Heading</h2>') },
    { label: "H3", title: "Heading 3", action: () => insertAtCursor('<h3 style="font-family:\'Playfair Display\',serif;font-size:20px;font-weight:700;color:#1a1a18;margin:28px 0 12px;">Subheading</h3>') },
    { label: "—", title: "Divider", action: () => insertAtCursor('<hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:40px 0;" />') },
    { label: "❝", title: "Blockquote", action: () => insertAtCursor('<blockquote style="border-left:3px solid #1D9E75;margin:24px 0;padding:12px 20px;background:#f0faf6;border-radius:0 8px 8px 0;font-style:italic;color:#1a1a18;">Quote text here</blockquote>') },
    { label: "🔗", title: "Link", action: () => wrapSelection('<a href="URL" style="color:#1D9E75;">', "</a>") },
    { label: "🖼️", title: "Insert Image", action: () => setShowImageModal(true) },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Hidden textarea that gets submitted with the form */}
      <textarea name={name} value={content} onChange={() => {}} style={{ display: "none" }} readOnly />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "8px 18px",
              border: "1px solid rgba(0,0,0,0.12)",
              borderBottom: tab === t ? "1px solid #fff" : "1px solid rgba(0,0,0,0.12)",
              borderRadius: t === "write" ? "8px 0 0 0" : "0 8px 0 0",
              background: tab === t ? "#fff" : "#fafaf9",
              fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: tab === t ? 600 : 400,
              color: tab === t ? "#1a1a18" : "#6b6b63",
              cursor: "pointer",
              position: "relative", zIndex: tab === t ? 1 : 0,
            }}
          >
            {t === "write" ? "Write" : "Preview"}
          </button>
        ))}
      </div>

      {tab === "write" ? (
        <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: "0 8px 8px 8px", overflow: "hidden" }}>
          {/* Toolbar */}
          <div style={{ display: "flex", gap: 2, padding: "8px 10px", borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#fafaf9", flexWrap: "wrap" }}>
            {toolbarButtons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                title={btn.title}
                onClick={btn.action}
                style={{
                  padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.1)",
                  background: "#fff", fontSize: 13, fontFamily: "DM Sans, sans-serif",
                  cursor: "pointer", color: "#1a1a18", fontWeight: btn.label === "B" ? 700 : 400,
                  fontStyle: btn.label === "I" ? "italic" : "normal",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={28}
            placeholder="Write your article here. Use the toolbar to format text, add headings, blockquotes, and images."
            style={{
              width: "100%", padding: "16px", border: "none", outline: "none",
              fontSize: 14, fontFamily: "monospace", lineHeight: 1.7, color: "#1a1a18",
              background: "#fff", resize: "vertical", boxSizing: "border-box",
              minHeight: 480,
            }}
          />
        </div>
      ) : (
        <div style={{
          border: "1px solid rgba(0,0,0,0.12)", borderRadius: "0 8px 8px 8px",
          padding: "24px", minHeight: 480, background: "#fff",
          fontFamily: "DM Sans, sans-serif", fontSize: 16, lineHeight: 1.8, color: "#1a1a18",
        }}
          dangerouslySetInnerHTML={{ __html: content || '<p style="color:#aaa9a0">Nothing to preview yet.</p>' }}
        />
      )}

      {showImageModal && (
        <ImageUploadBlock
          onInsert={(html) => { insertAtCursor(html); setShowImageModal(false) }}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  )
}

"use client"

import { useState, useRef } from "react"

type Props = {
  onInsert: (html: string) => void
  onClose: () => void
}

export default function ImageUploadBlock({ onInsert, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [alt, setAlt] = useState("")
  const [caption, setCaption] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError("")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleInsert = async () => {
    if (!file) { setError("Pick an image first."); return }
    if (!alt.trim()) { setError("Alt text is required for accessibility."); return }
    setUploading(true)
    setError("")

    const fd = new FormData()
    fd.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    setUploading(false)

    if (!res.ok || data.error) { setError(data.error ?? "Upload failed."); return }

    const html = caption.trim()
      ? `<figure style="margin:32px 0;text-align:center;">
  <img src="${data.url}" alt="${alt}" style="max-width:100%;border-radius:10px;" />
  <figcaption style="margin-top:10px;font-size:13px;color:#6b6b63;font-family:'DM Sans',sans-serif;">${caption}</figcaption>
</figure>`
      : `<img src="${data.url}" alt="${alt}" style="max-width:100%;border-radius:10px;margin:32px 0;" />`

    onInsert(html)
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, padding: "32px", width: "100%", maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, color: "#1a1a18", margin: 0 }}>Insert Image</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b6b63" }}>✕</button>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: `2px dashed ${preview ? "#1D9E75" : "rgba(0,0,0,0.15)"}`,
            borderRadius: 10, padding: "24px", textAlign: "center", cursor: "pointer",
            background: preview ? "#f0faf6" : "#fafaf9", marginBottom: 16, transition: "all 0.2s",
          }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" style={{ maxHeight: 180, maxWidth: "100%", borderRadius: 8 }} />
          ) : (
            <div>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "#6b6b63", margin: 0 }}>
                Click or drag & drop an image
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#aaa9a0", margin: "4px 0 0" }}>
                JPEG, PNG, WebP, GIF
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          />
        </div>

        {preview && (
          <button
            onClick={() => { setFile(null); setPreview(null) }}
            style={{ background: "none", border: "none", fontSize: 12, color: "#E24B4A", cursor: "pointer", marginBottom: 16, fontFamily: "DM Sans, sans-serif" }}
          >
            ✕ Remove image
          </button>
        )}

        {/* Alt */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#1a1a18", marginBottom: 6, fontFamily: "DM Sans, sans-serif" }}>
            Alt Text <span style={{ color: "#E24B4A" }}>*</span>
          </label>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for screen readers"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 14, fontFamily: "DM Sans, sans-serif", boxSizing: "border-box" }}
          />
        </div>

        {/* Caption */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#1a1a18", marginBottom: 6, fontFamily: "DM Sans, sans-serif" }}>
            Caption <span style={{ color: "#aaa9a0", fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Shown below the image"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 14, fontFamily: "DM Sans, sans-serif", boxSizing: "border-box" }}
          />
        </div>

        {error && (
          <p style={{ color: "#E24B4A", fontSize: 13, fontFamily: "DM Sans, sans-serif", marginBottom: 14 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleInsert}
            disabled={uploading || !file}
            style={{
              flex: 1, padding: "12px", borderRadius: 8, background: "#1D9E75", color: "#fff",
              border: "none", fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600,
              cursor: uploading || !file ? "not-allowed" : "pointer", opacity: uploading || !file ? 0.6 : 1,
            }}
          >
            {uploading ? "Uploading…" : "Insert Image"}
          </button>
          <button
            onClick={onClose}
            style={{ padding: "12px 20px", borderRadius: 8, background: "none", border: "1px solid rgba(0,0,0,0.12)", fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer", color: "#6b6b63" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

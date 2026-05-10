"use client"

import { useState, useRef } from "react"

type Props = {
  name: string
  initialUrl?: string
}

export default function CoverImageUpload({ name, initialUrl = "" }: Props) {
  const [url, setUrl] = useState(initialUrl)
  const [preview, setPreview] = useState(initialUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    setError("")
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    setUploading(false)
    if (!res.ok || data.error) { setError(data.error ?? "Upload failed"); return }
    setUrl(data.url)
    setPreview(data.url)
  }

  return (
    <div>
      {/* Hidden input submitted with the form */}
      <input type="hidden" name={name} value={url} />

      <div
        onClick={() => fileRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: `2px dashed ${preview ? "#1D9E75" : "rgba(0,0,0,0.15)"}`,
          borderRadius: 10,
          padding: preview ? 8 : 28,
          textAlign: "center",
          cursor: "pointer",
          background: preview ? "#f0faf6" : "#fafaf9",
          transition: "all 0.2s",
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Cover preview" style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }} />
        ) : (
          <div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "#6b6b63", margin: 0 }}>
              {uploading ? "Uploading…" : "Click or drag & drop cover image"}
            </p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#aaa9a0", margin: "4px 0 0" }}>
              JPEG, PNG, WebP
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />
      </div>

      {preview && (
        <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
          <button
            type="button"
            onClick={() => { setUrl(""); setPreview("") }}
            style={{ background: "none", border: "none", color: "#E24B4A", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
          >
            ✕ Remove
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{ background: "none", border: "none", color: "#1D9E75", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
          >
            ↺ Replace
          </button>
        </div>
      )}

      {uploading && (
        <p style={{ fontSize: 12, color: "#1D9E75", marginTop: 6, fontFamily: "DM Sans, sans-serif" }}>Uploading to Cloudinary…</p>
      )}
      {error && (
        <p style={{ fontSize: 12, color: "#E24B4A", marginTop: 6, fontFamily: "DM Sans, sans-serif" }}>{error}</p>
      )}
    </div>
  )
}

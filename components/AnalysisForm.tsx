"use client"

import { useState, useRef, useTransition } from "react"

const BIAS_OPTIONS = [
  { value: "BULLISH",          label: "Bullish",          color: "#1D9E75" },
  { value: "STRONGLY_BULLISH", label: "Strongly Bullish", color: "#0F6E56" },
  { value: "NEUTRAL",          label: "Neutral",           color: "#F5A623" },
  { value: "BEARISH",          label: "Bearish",          color: "#E24B4A" },
  { value: "STRONGLY_BEARISH", label: "Strongly Bearish", color: "#9b1c1c" },
]

type Props = {
  action: (fd: FormData) => void | Promise<void>
  initial?: {
    asset?: string
    symbol?: string
    bias?: string
    thesis?: string
    watchFor?: string
    imageUrl?: string
    supportLevels?: string
    resistanceLevels?: string
    keyLevels?: string
    isPublic?: boolean
  }
}

export default function AnalysisForm({ action, initial = {} }: Props) {
  const [bias, setBias] = useState(initial.bias ?? "BULLISH")
  const [imageUrl, setImageUrl] = useState(initial.imageUrl ?? "")
  const [imagePreview, setImagePreview] = useState(initial.imageUrl ?? "")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    setUploadError("")
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    setUploading(false)
    if (!res.ok || data.error) { setUploadError(data.error ?? "Upload failed"); return }
    setImageUrl(data.url)
    setImagePreview(data.url)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => { action(formData) })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="bias" value={bias} />

      {/* Asset + Symbol */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Asset Name <span style={{ color: "#E24B4A" }}>*</span></label>
          <input name="asset" required defaultValue={initial.asset} style={inputStyle} placeholder="Bitcoin, S&P 500, Gold" />
        </div>
        <div>
          <label style={labelStyle}>Symbol / Ticker <span style={{ color: "#E24B4A" }}>*</span></label>
          <input name="symbol" required defaultValue={initial.symbol} style={inputStyle} placeholder="BTC, SPX, XAUUSD" />
        </div>
      </div>

      {/* Bias */}
      <div>
        <label style={labelStyle}>Bias <span style={{ color: "#E24B4A" }}>*</span></label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {BIAS_OPTIONS.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBias(b.value)}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: `1.5px solid ${bias === b.value ? b.color : "rgba(0,0,0,0.12)"}`,
                background: bias === b.value ? b.color + "18" : "#fff",
                color: bias === b.value ? b.color : "#6b6b63",
                fontFamily: "DM Sans, sans-serif", fontSize: 13,
                fontWeight: bias === b.value ? 700 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thesis */}
      <div>
        <label style={labelStyle}>Thesis <span style={{ color: "#E24B4A" }}>*</span></label>
        <textarea
          name="thesis"
          required
          rows={5}
          defaultValue={initial.thesis}
          placeholder="What's your analysis? Key macro or technical reasons."
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      {/* Watch For */}
      <div>
        <label style={labelStyle}>Watch For <span style={{ color: "#aaa9a0", fontWeight: 400 }}>(optional)</span></label>
        <textarea
          name="watchFor"
          rows={3}
          defaultValue={initial.watchFor}
          placeholder="What would invalidate this thesis? Key levels to watch."
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      {/* Key levels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { name: "supportLevels",    label: "Support Levels",    placeholder: "42000, 40000", defaultValue: initial.supportLevels },
          { name: "resistanceLevels", label: "Resistance Levels", placeholder: "48000, 52000", defaultValue: initial.resistanceLevels },
          { name: "keyLevels",        label: "Key Levels",        placeholder: "45000 (breakout)", defaultValue: initial.keyLevels },
        ].map((f) => (
          <div key={f.name}>
            <label style={labelStyle}>{f.label}</label>
            <input name={f.name} defaultValue={f.defaultValue} style={inputStyle} placeholder={f.placeholder} />
            <p style={{ fontSize: 11, color: "#aaa9a0", marginTop: 4, fontFamily: "DM Sans, sans-serif" }}>Comma separated</p>
          </div>
        ))}
      </div>

      {/* Chart image upload */}
      <div>
        <label style={labelStyle}>Chart Screenshot <span style={{ color: "#aaa9a0", fontWeight: 400 }}>(optional)</span></label>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f) }}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: `2px dashed ${imagePreview ? "#1D9E75" : "rgba(0,0,0,0.15)"}`,
            borderRadius: 10, padding: imagePreview ? 12 : 32, textAlign: "center",
            cursor: "pointer", background: imagePreview ? "#f0faf6" : "#fafaf9", transition: "all 0.2s",
          }}
        >
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Chart preview" style={{ maxHeight: 240, maxWidth: "100%", borderRadius: 8 }} />
          ) : (
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "#6b6b63", margin: 0 }}>
                {uploading ? "Uploading…" : "Click or drag & drop your chart screenshot"}
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "#aaa9a0", margin: "4px 0 0" }}>
                JPEG, PNG, WebP
              </p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]) }} />
        </div>
        {imagePreview && (
          <button type="button"
            onClick={() => { setImageUrl(""); setImagePreview("") }}
            style={{ background: "none", border: "none", color: "#E24B4A", fontSize: 12, cursor: "pointer", marginTop: 8, fontFamily: "DM Sans, sans-serif" }}>
            ✕ Remove image
          </button>
        )}
        {uploadError && <p style={{ color: "#E24B4A", fontSize: 13, marginTop: 6, fontFamily: "DM Sans, sans-serif" }}>{uploadError}</p>}
      </div>

      {/* Visibility */}
      <div>
        <label style={labelStyle}>Visibility</label>
        <select name="isPublic" style={inputStyle} defaultValue={initial.isPublic === false ? "false" : "true"}>
          <option value="true">Public</option>
          <option value="false">Private (draft)</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button type="submit" disabled={isPending} style={{
          backgroundColor: "#1D9E75", color: "#fff", padding: "12px 28px",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 500,
          cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1,
          fontFamily: "DM Sans, sans-serif",
        }}>
          {isPending ? "Saving…" : "Save Analysis"}
        </button>
        <a href="/admin/analysis" style={{ padding: "12px 20px", color: "#6b6b63", fontSize: 14, textDecoration: "none" }}>Cancel</a>
      </div>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: "#1a1a18", marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8,
  fontSize: 14, color: "#1a1a18", backgroundColor: "#ffffff",
  fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
}
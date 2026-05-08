import { createPrediction } from "../actions"

export default function NewPredictionPage() {
  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18", marginBottom: "32px" }}>
        New Prediction
      </h1>

      <form action={createPrediction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <div>
          <label style={labelStyle}>Title</label>
          <input name="title" required style={inputStyle} placeholder="e.g. BTC breaks $100k by Q3 2025" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Type</label>
            <select name="type" required style={inputStyle}>
              <option value="MARKET">Market</option>
              <option value="GEOPOLITICAL">Geopolitical</option>
              <option value="MACRO">Macro</option>
              <option value="CRYPTO">Crypto</option>
              <option value="COMMODITY">Commodity</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Direction</label>
            <select name="direction" required style={inputStyle}>
              <option value="BULLISH">Bullish</option>
              <option value="BEARISH">Bearish</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="LIKELY">Likely</option>
              <option value="UNLIKELY">Unlikely</option>
              <option value="UNCERTAIN">Uncertain</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Asset</label>
            <input name="asset" required style={inputStyle} placeholder="e.g. BTC, SPY, Gold" />
          </div>
          <div>
            <label style={labelStyle}>Target</label>
            <input name="target" style={inputStyle} placeholder="e.g. $100,000 (optional)" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Probability (%)</label>
            <input name="probability" type="number" min="0" max="100" style={inputStyle} placeholder="e.g. 75" />
          </div>
          <div>
            <label style={labelStyle}>Timeframe</label>
            <input name="timeframe" required style={inputStyle} placeholder="e.g. Q3 2025, 6 months" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Thesis</label>
          <textarea
            name="thesis"
            required
            rows={6}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Why do you believe this? Your full reasoning..."
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={{
            backgroundColor: "#1D9E75",
            color: "#fff",
            padding: "12px 28px",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: "pointer",
          }}>
            Save Prediction
          </button>
          <a href="/admin/predictions" style={{
            padding: "12px 20px",
            color: "#6b6b63",
            fontSize: "14px",
            textDecoration: "none",
          }}>
            Cancel
          </a>
        </div>

      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#1a1a18",
  marginBottom: "6px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#1a1a18",
  backgroundColor: "#ffffff",
  fontFamily: "DM Sans, sans-serif",
  boxSizing: "border-box",
}
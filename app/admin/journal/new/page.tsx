import { createJournalEntry } from "../actions"

export default function NewJournalEntryPage() {
  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "26px", color: "#1a1a18", marginBottom: "32px" }}>
        New Journal Entry
      </h1>

      <form action={createJournalEntry} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Asset</label>
            <input name="asset" required style={inputStyle} placeholder="e.g. BTC, AAPL, Gold" />
          </div>
          <div>
            <label style={labelStyle}>Market</label>
            <select name="market" required style={inputStyle}>
              <option value="CRYPTO">Crypto</option>
              <option value="EQUITY">Equity</option>
              <option value="FOREX">Forex</option>
              <option value="COMMODITY">Commodity</option>
              <option value="BONDS">Bonds</option>
              <option value="REAL_ESTATE">Real Estate</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Direction</label>
            <select name="direction" required style={inputStyle}>
              <option value="LONG">Long</option>
              <option value="SHORT">Short</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Result</label>
            <select name="result" required style={inputStyle}>
              <option value="OPEN">Open</option>
              <option value="WIN">Win</option>
              <option value="LOSS">Loss</option>
              <option value="BREAKEVEN">Breakeven</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Entry Price</label>
            <input name="entryPrice" type="number" step="any" required style={inputStyle} placeholder="0.00" />
          </div>
          <div>
            <label style={labelStyle}>Exit Price</label>
            <input name="exitPrice" type="number" step="any" style={inputStyle} placeholder="0.00 (optional)" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Stop Loss</label>
            <input name="stopLoss" type="number" step="any" style={inputStyle} placeholder="0.00 (optional)" />
          </div>
          <div>
            <label style={labelStyle}>Take Profit</label>
            <input name="takeProfit" type="number" step="any" style={inputStyle} placeholder="0.00 (optional)" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Setup</label>
            <input name="setup" style={inputStyle} placeholder="e.g. Breakout, Reversal (optional)" />
          </div>
          <div>
            <label style={labelStyle}>Opened At</label>
            <input name="openedAt" type="datetime-local" required style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Visibility</label>
          <select name="visibility" style={inputStyle}>
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Reasoning</label>
          <textarea name="reasoning" rows={4} style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Why did you take this trade?" />
        </div>

        <div>
          <label style={labelStyle}>Psychology</label>
          <textarea name="psychology" rows={3} style={{ ...inputStyle, resize: "vertical" }}
            placeholder="How were you feeling? Any emotional biases?" />
        </div>

        <div>
          <label style={labelStyle}>Mistakes</label>
          <textarea name="mistakes" rows={3} style={{ ...inputStyle, resize: "vertical" }}
            placeholder="What did you do wrong?" />
        </div>

        <div>
          <label style={labelStyle}>Lessons</label>
          <textarea name="lessons" rows={3} style={{ ...inputStyle, resize: "vertical" }}
            placeholder="What did you learn?" />
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
            Save Entry
          </button>
          <a href="/admin/journal" style={{
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
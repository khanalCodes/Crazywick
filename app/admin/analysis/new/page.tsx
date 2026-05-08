import { createAnalysis } from '../actions'

export default function NewAnalysisPage() {
  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#1a1a18', marginBottom: '32px' }}>
        New Analysis
      </h1>

      <form action={createAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Asset</label>
            <input name="asset" required style={inputStyle} placeholder="e.g. Bitcoin" />
          </div>
          <div>
            <label style={labelStyle}>Symbol</label>
            <input name="symbol" required style={inputStyle} placeholder="e.g. BTC" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Bias</label>
          <select name="bias" required style={inputStyle}>
            <option value="BULLISH">Bullish</option>
            <option value="BEARISH">Bearish</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="STRONGLY_BULLISH">Strongly Bullish</option>
            <option value="STRONGLY_BEARISH">Strongly Bearish</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Support Levels (comma separated)</label>
          <input name="supportLevels" required style={inputStyle} placeholder="e.g. 88,000, 82,000" />
        </div>

        <div>
          <label style={labelStyle}>Resistance Levels (comma separated)</label>
          <input name="resistanceLevels" required style={inputStyle} placeholder="e.g. 98,000, 105,000" />
        </div>

        <div>
          <label style={labelStyle}>Thesis</label>
          <textarea name="thesis" required rows={6} style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Your full analysis and reasoning..." />
        </div>

        <div>
          <label style={labelStyle}>Watch For</label>
          <textarea name="watchFor" rows={3} style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Key levels or events to watch..." />
        </div>

        <div>
          <label style={labelStyle}>Chart Image URL</label>
          <input name="imageUrl" style={inputStyle} placeholder="https://... (optional)" />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" style={{
            backgroundColor: '#1D9E75', color: '#fff', padding: '12px 28px',
            border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
          }}>
            Save Analysis
          </button>
          <a href="/admin/analysis" style={{ padding: '12px 20px', color: '#6b6b63', fontSize: '14px', textDecoration: 'none' }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a18', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '8px', fontSize: '14px', color: '#1a1a18', backgroundColor: '#ffffff',
  fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
}
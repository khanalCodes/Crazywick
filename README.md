# CrazyWick Finance Platform

A professional financial intelligence platform for market analysis, trade journaling, predictions, and technical learnings.

## 🚀 Features

### 1. **Articles**
- Write and publish your thoughts on economics, politics, and book reviews
- Category-based organization
- Professional card-based layout

### 2. **Trade Journal**
- Log trades across multiple markets:
  - Nepali Stock Market (NEPSE)
  - Indian Markets (NSE/BSE)
  - Forex
  - US Markets (NYSE/NASDAQ)
  - Commodity Markets
- Track entry/exit prices, position sizes, and P&L
- Upload trade screenshots
- Filter by market type

### 3. **Predictions**
- Create market predictions with TradingView chart embeds
- Display target prices and stop losses
- Document your analysis and timeframes
- Visual chart integration

### 4. **Technical Learnings**
- Build a knowledge base of trading concepts
- Organize by category
- Quick reference for teaching and sharing

## 🔐 Admin Panel

### Default Login
- **Password**: `crazywick2024`
- **Keyboard Shortcut**: `Alt + A`

**⚠️ IMPORTANT**: Change the admin password in `script.js` line 2:
```javascript
const ADMIN_PASSWORD = 'your-secure-password-here';
```

## 📦 Setup Instructions

### Option 1: Cloudflare Pages (Recommended)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/crazywick.git
   git push -u origin main
   ```

2. **Deploy to Cloudflare Pages**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: `/`
   - Click "Save and Deploy"

3. **Add Custom Domain**
   - In Cloudflare Pages project → Custom domains
   - Add `crazywick.com`
   - Cloudflare will automatically configure SSL

### Option 2: Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crazywick.git
   cd crazywick
   ```

2. Open with a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or use any static server
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

## 🎨 Customization

### Colors & Theme
Edit CSS variables in `styles.css` (lines 1-14):
```css
:root {
    --bg-primary: #0a0e1a;
    --accent-primary: #00d4aa;
    /* ... modify colors here ... */
}
```

### TradingView Charts
When creating predictions, use TradingView symbol format:
- Bitcoin: `BINANCE:BTCUSDT`
- S&P 500: `SPX`
- NIFTY: `NSE:NIFTY`
- Forex EUR/USD: `FX:EURUSD`

## 💾 Data Storage

- All data is stored in **browser localStorage**
- Data persists across sessions
- To backup: Export localStorage or implement backend storage
- **Note**: Data is stored per-browser. Consider implementing a backend for multi-device sync.

## 🔄 Upgrading to Backend (Future)

Current setup uses localStorage. To scale:
1. Set up a backend (Node.js/Express, Firebase, Supabase)
2. Replace localStorage calls with API calls
3. Add user authentication
4. Enable multi-device sync

## 📱 Features

- ✅ Fully responsive design
- ✅ Professional Bloomberg-inspired UI
- ✅ Dark theme optimized for finance
- ✅ TradingView chart integration
- ✅ Image upload for trade screenshots
- ✅ Real-time market ticker
- ✅ Admin panel for content management
- ✅ Keyboard shortcuts (Alt+A for admin, Esc to close)

## 🛠️ Tech Stack

- Pure HTML/CSS/JavaScript (no frameworks)
- IBM Plex Sans font family
- TradingView widgets
- LocalStorage for persistence

## 📄 License

MIT License - Feel free to customize and use for your projects

## 🔒 Security Notes

1. **Change the admin password immediately** in `script.js`
2. For production, implement proper authentication
3. Consider adding rate limiting for admin access
4. Use HTTPS (Cloudflare provides free SSL)

## 🎯 Future Enhancements

- Backend database integration
- User authentication system
- Performance analytics dashboard
- CSV export for journal entries
- Advanced filtering and search
- Mobile app version
- Multi-language support

---

**Built with CrazyWick** 🔥
For questions or support, contact: [your-email@example.com]

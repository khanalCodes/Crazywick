# 🚀 QUICK START GUIDE

## Get Your Site Live in 5 Minutes

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name it: `crazywick` (or any name)
3. Make it **Public**
4. DON'T initialize with README (we already have files)
5. Click "Create repository"

### Step 2: Upload Your Files
Upload all these files to your GitHub repo:
- index.html
- styles.css
- script.js
- README.md
- .gitignore

**Via GitHub Web Interface:**
- Click "uploading an existing file"
- Drag and drop all files
- Commit directly to main

**OR Via Git Commands:**
```bash
git init
git add .
git commit -m "Initial commit: CrazyWick Finance Platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/crazywick.git
git push -u origin main
```

### Step 3: Deploy to Cloudflare Pages
1. Go to your Cloudflare dashboard
2. Click **Pages** in sidebar
3. Click **"Create a project"**
4. Click **"Connect to Git"**
5. Authorize GitHub if needed
6. Select your `crazywick` repository
7. **Build Settings:**
   - Framework preset: **None**
   - Build command: **(leave empty)**
   - Build output directory: **/**
8. Click **"Save and Deploy"**

Your site will be live at: `https://crazywick-xyz.pages.dev`

### Step 4: Connect Your Domain
1. In Cloudflare Pages → Your project
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Enter: `crazywick.com`
5. Cloudflare auto-configures DNS
6. Wait 1-2 minutes for SSL

**Done!** Your site is now live at `https://crazywick.com` 🎉

---

## ⚡ First Things To Do

### 1. Change Admin Password
Open `script.js` and change line 2:
```javascript
const ADMIN_PASSWORD = 'your-secure-password';  // Change this!
```

Then commit and push:
```bash
git add script.js
git commit -m "Update admin password"
git push
```

Cloudflare auto-deploys in ~30 seconds.

### 2. Access Admin Panel
- Go to your site
- Press **Alt + A** (keyboard shortcut)
- OR click **"Admin"** button in header
- Enter your password
- Start adding content!

---

## 📝 How to Add Content

### Articles
1. Open admin panel
2. Click "New Article" tab
3. Fill in:
   - Title
   - Category (Economics, Politics, Book Review, etc.)
   - Content
4. Click "Publish Article"

### Journal Entries
1. Click "New Journal Entry"
2. Fill in trade details:
   - Market (NEPSE, Indian, Forex, US, Commodity)
   - Symbol (e.g., NABIL, RELIANCE, EUR/USD)
   - Entry/Exit prices
   - Position size
   - Notes
3. Upload screenshot (optional)
4. Click "Save Trade"

### Predictions
1. Click "New Prediction"
2. Fill in:
   - Title & Symbol
   - **TradingView Chart ID**: Find this on TradingView
     - Example: `BINANCE:BTCUSDT` for Bitcoin
     - Example: `NSE:NIFTY` for NIFTY
     - Example: `FX:EURUSD` for EUR/USD
   - Target price & Stop loss
   - Timeframe
   - Analysis
3. Click "Publish Prediction"

### Learnings
1. Click "New Learning"
2. Add technical concept/lesson
3. Categorize it
4. Click "Save Learning"

---

## 🎨 Customization Tips

### Change Colors
Edit `styles.css` lines 1-14:
```css
--accent-primary: #00d4aa;  /* Main accent color */
--accent-secondary: #0891b2; /* Secondary accent */
```

### Update Ticker
Edit `index.html` line 50-56 for live market data

### Add Your Logo
Replace the text logo in `index.html` line 33 with:
```html
<img src="logo.png" alt="CrazyWick">
```

---

## 🔒 Security Checklist

- [ ] Changed admin password in `script.js`
- [ ] Using HTTPS (Cloudflare provides this free)
- [ ] Don't share admin password publicly
- [ ] Regular backups of localStorage data

---

## 💡 Pro Tips

1. **Data Backup**: Browser localStorage data is local. Consider exporting important trades regularly.

2. **Mobile Access**: Site is fully responsive - admin panel works on mobile too!

3. **TradingView Charts**: Use the symbol search on TradingView.com to find exact chart IDs

4. **Performance**: Site loads instantly (static HTML) - perfect for finance where speed matters

5. **Future Upgrade**: When you outgrow localStorage, migrate to Firebase/Supabase for multi-device sync

---

## 🆘 Troubleshooting

**Q: Admin panel not showing?**
- Check if password is correct
- Try Alt+A keyboard shortcut
- Check browser console for errors (F12)

**Q: TradingView charts not loading?**
- Verify symbol format is correct
- Check internet connection
- Some symbols may not be available

**Q: Lost my data?**
- Data is in browser localStorage
- Cleared browser data = lost content
- **Solution**: Implement backend for persistence

**Q: Changes not showing on live site?**
- Cloudflare Pages auto-deploys on git push
- Wait 30-60 seconds after pushing
- Hard refresh browser (Ctrl+Shift+R)

---

## 📞 Need Help?

Check the full README.md for detailed documentation.

**Happy Trading!** 📈🔥

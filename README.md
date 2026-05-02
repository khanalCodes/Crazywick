# CrazyWick — Financial Intelligence

> Market predictions, geopolitics, and macro analysis from Kathmandu.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **MDX** for articles (write in Markdown, deploy via Git)
- **TradingView Widgets** — free, no API key needed
- **Vercel** for hosting (zero config)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Deploy to Vercel

Push this folder to a GitHub repo, connect it to Vercel, done.
Every `git push` = automatic deploy.

---

## Writing Articles

Create a `.mdx` file in `content/articles/`:

```
content/articles/your-article-title.mdx
```

**Required frontmatter:**

```yaml
---
title: "Your Article Title"
date: "2026-05-01"
category: "Geopolitics"   # Geopolitics | Markets | Analysis | Nepal | Macro
excerpt: "One sentence summary shown in cards and SEO."
---

Your article content in Markdown here...
```

That's it. Push to GitHub → Vercel deploys → article is live.

---

## Writing Predictions

Create a `.mdx` file in `content/predictions/`:

```yaml
---
title: "Short prediction title"
date: "2026-05-01"
asset: "Bitcoin (BTC/USD)"
direction: "bullish"      # bullish | bearish | neutral
target: "$100,000"
timeframe: "Q4 2026"
status: "open"            # open | correct | incorrect
excerpt: "One line thesis."
---

Longer explanation of your reasoning...
```

Update `status` to `correct` or `incorrect` after the fact. The predictions page tracks your accuracy automatically.

---

## Customizing the Ticker

Edit `components/TickerTape.tsx` — add or remove symbols from the `symbols` array.

Full list of supported symbols: [TradingView Symbol Search](https://www.tradingview.com/symbols/)

---

## Categories & Colors

Edit the `CATEGORY_COLORS` object in `app/page.tsx` and `app/articles/page.tsx` to add new categories:

```ts
const CATEGORY_COLORS = {
  Geopolitics: '#185FA5',
  Markets: '#3B6D11',
  Nepal: '#993556',
  // add yours here
}
```

---

## Project Structure

```
crazywick/
├── app/
│   ├── layout.tsx          # Root layout (navbar + ticker + footer)
│   ├── page.tsx            # Homepage
│   ├── articles/
│   │   ├── page.tsx        # Article listing
│   │   └── [slug]/
│   │       └── page.tsx    # Individual article
│   ├── predictions/
│   │   └── page.tsx        # Predictions tracker
│   └── geopolitics/
│       └── page.tsx        # Geopolitics page with chart
├── components/
│   ├── Navbar.tsx
│   ├── TickerTape.tsx      # Live price ticker (TradingView)
│   └── TradingViewChart.tsx # Full chart widget
├── content/
│   ├── articles/           # Your .mdx articles go here
│   └── predictions/        # Your .mdx predictions go here
├── lib/
│   └── articles.ts         # Reads MDX files, parses frontmatter
└── styles/
    └── globals.css         # All global styles
```

---

## Future Roadmap

When traffic hits 1-2k/month, consider adding:
- Email newsletter (Resend or ConvertKit)
- Comment system (Giscus — free, uses GitHub Discussions)
- Analytics (Plausible or Vercel Analytics)
- A private investor dashboard (Next.js API routes + Supabase)

No backend needed until then.

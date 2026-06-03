# CafeCompare — Claude Instructions

## Project Overview

A coffee shop comparison website built with **Next.js** (App Router). Users can browse, filter, and compare local coffee shops based on ratings, price, amenities, and other attributes sourced from a CSV dataset.

---

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Data source:** CSV file(s) in `data/` — parsed at build time or via API route
- **Font:** TBD (update when reference screenshot is reviewed)

---

## Brand & Design Tokens

> Fill in once reference screenshot and style data are provided.

```
Background:   #______
Primary:      #______
Accent:       #______
Text:         #______
Font:         ______
```

---

## Data

- Raw CSV: `data/coffee_shop_reviews.csv` — **1,061 reviews** across **12 coffee shops** in Boston
- **Shops:** Bean There, Brew & Co, Caffeine Fix, Central Perk, Espresso Yourself, Java Junction, Mug Life, Perk Up, Roast Masters, Steamy Beans, The Daily Grind, The Grind House

### CSV Schema

| Column | Type | Notes |
|--------|------|-------|
| `review_id` | int | unique row ID |
| `shop_name` | string | one of 12 shops |
| `address` | string | |
| `city` | string | Boston |
| `neighborhood` | string | Downtown, Cambridge, Back Bay, Somerville, etc. |
| `review_date` | date | YYYY-MM-DD |
| `reviewer_id` | string | e.g. R2701 |
| `overall_rating` | float | 1–5 |
| `coffee_quality` | float | 1–5 |
| `service_quality` | float | 1–5 |
| `atmosphere` | float | 1–5 |
| `value_score` | float | 1–5 |
| `avg_price` | float | USD |
| `wait_time_minutes` | int | |
| `has_wifi` | bool | True/False |
| `power_outlets` | string | None / Limited / Plenty |
| `outdoor_seating` | bool | True/False |
| `parking` | string | None / Street / Lot / Valet |
| `mobile_ordering` | bool | True/False |
| `review_text` | string | free-text snippet |

### Data strategy
- Aggregate reviews per shop at build time (Next.js Server Component / `fs` + `csv-parse`)
- Each shop page shows: avg ratings, amenities summary, review list
- Shops are the atomic unit — not individual reviews

---

## Key Pages / Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage / shop listing |
| `/[slug]` | Individual shop detail page |
| `/compare` | Side-by-side comparison view |

---

## Design Rules

- Recreate UI pixel-perfect from reference screenshot once provided.
- Use `https://placehold.co/` for placeholder images.
- **Iteration rule:** After generating HTML, screenshot with Puppeteer, compare against reference, revise, then screenshot again. Complete **at least 2 comparison rounds** before reporting a page as done. Never stop after the first screenshot pass.
- Puppeteer install path: `C:\Projects\TradeIQ\node_modules\puppeteer` (reuse existing install).

---

## Dev Commands

```powershell
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

---

## Notes

- Update this file with brand tokens, CSV schema, and any routing decisions as they are confirmed.

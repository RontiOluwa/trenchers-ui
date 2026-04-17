# Trenchers — Solana Trading Terminal

> The fastest execution engine on Solana. Snipe launches, copy whales,
> track positions — all in one terminal built for the trenches.

---

## What is this?

Trenchers is a full-stack Solana trading terminal UI built as a frontend
engineering assessment. It covers three assignments:

- **Assignment 1** — Landing page (design + Next.js code)
- **Assignment 2** — Terminal design research + prototype (listing page,
  token detail page, sniper UI)
- **Assignment 3** — Real-time data UI (live token feed with flash
  animations, sort, filter, favorites)

---

## Tech Stack

| Layer      | Choice                                                 |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 14 (App Router)                                |
| Language   | TypeScript                                             |
| Styling    | Tailwind CSS                                           |
| Animation  | Framer Motion                                          |
| Charts     | Canvas API (custom renderer, no library)               |
| Live data  | Deriv WebSocket API (chart), DexScreener REST (tokens) |
| State      | React Context (theme, wallet, toast)                   |
| Deployment | Vercel                                                 |

---

## Running Locally

```bash
# 1. Clone
git clone https://github.com/your-username/trenchers
cd trenchers

# 2. Install
npm install

# 3. Run
npm run dev

# Open http://localhost:3000
```

No environment variables required — both data sources (Deriv, DexScreener)
are public and unauthenticated.

---

## Project Structure

```
src/
├── app/
│ ├── layout.tsx # Root layout — theme script, providers
│ ├── providers.tsx # Client wrapper (Wallet, Toast, PageTransition)
│ ├── page.tsx # Landing page
│ ├── signin/page.tsx # Sign in / connect wallet
│ ├── listing/page.tsx # Trenches token listing
│ └── token/page.tsx # Token detail + chart
│
├── components/
│ ├── landing/ # Landing page sections
│ │ ├── Navbar.tsx # Scroll-aware nav, animated theme toggle
│ │ ├── Hero.tsx # Waitlist form, staggered entrance, mockup
│ │ ├── Stats.tsx # Count-up animation on scroll
│ │ ├── Features.tsx # Staggered card entrance + hover lift
│ │ ├── HowItWorks.tsx # Steps with animated connector line
│ │ ├── Testimonial.tsx # Scroll-triggered quote
│ │ ├── CTA.tsx # Waitlist form + pulsing button
│ │ └── Footer.tsx # Social links
│ │
│ ├── listing/ # Token listing components
│ │ ├── TokenColumn.tsx # Per-column container with sort controls
│ │ ├── TokenRow.tsx # DarkRow + LightRow with flash animation
│ │ ├── SnipeBadge.tsx # Score badge + breakdown tooltip
│ │ ├── HotSnipeCard.tsx # Top-score token feature card
│ │ ├── SortBar.tsx # Per-column sort (Snipe/Vol/Age/Change)
│ │ ├── SkeletonRow.tsx # Loading placeholder
│ │ └── EmptyState.tsx # No-results state
│ │
│ ├── token/ # Token detail components
│ │ ├── CandleChart.tsx # Canvas chart: scroll, pan, crosshair, volume
│ │ ├── DerivCandleChart.tsx # Deriv WebSocket orchestrator
│ │ ├── ChartSkeleton.tsx # Loading shimmer
│ │ ├── ChartToolbar.tsx # TF selector + symbol picker
│ │ ├── TokenHeader.tsx # Token stats bar
│ │ ├── TradingPanel.tsx # Buy/sell, presets, security
│ │ └── TradeTable.tsx # Trade history tabs
│ │
│ ├── signin/ # Auth components
│ │ ├── LeftPanel.tsx # Brand panel with chart
│ │ ├── SignInForm.tsx # Email + social + connect wallet
│ │ └── WalletModal.tsx # Wallet picker (Phantom/Solflare/MetaMask/WC)
│ │
│ ├── shared/ # Cross-page components
│ │ ├── AppNav.tsx # In-app navigation bar
│ │ ├── BottomNav.tsx # Mobile bottom navigation
│ │ ├── WalletChip.tsx # Connected wallet display + dropdown
│ │ └── Logo.tsx # Reusable logo
│ │
│ ├── ui/ # Primitive components
│ │ ├── Button.tsx # Variant system (primary/ghost/success/danger)
│ │ ├── Input.tsx # With label, prefix, error
│ │ ├── Select.tsx # Styled select
│ │ └── ThemeToggle.tsx # Animated sun/moon icon swap
│ │
│ └── PageTransition.tsx # Route-level fade transition
│
├── context/
│ ├── ThemeContext.tsx # Dark/light — syncs with <html> class
│ ├── WalletContext.tsx # Connected wallet state + mock connect
│ └── ToastContext.tsx # Toast queue with progress bar
│
└── hooks/
├── useTheme.ts # Theme toggle hook
├── useDerivChart.ts # Deriv WebSocket — history + live OHLC
└── useLiveTokens.ts # DexScreener fetch + simulated micro-updates

```

---

## Data Sources

### Chart — Deriv WebSocket API

Real-time OHLC candle data for synthetic indices. Always open — no market
hours, no authentication required.

Get your own free app_id at: https://developers.deriv.com

The hook (`useDerivChart.ts`) sends one request with `subscribe: 1`.
Deriv responds with the full history batch (`msg_type: "candles"`) then
streams live updates (`msg_type: "ohlc"`). A ping fires every 30 seconds
to prevent the 2-minute idle timeout. On symbol or timeframe change, the
hook sends a `forget` message to unsubscribe cleanly before reconnecting.

**Available symbols:**

| Symbol | Description          |
| ------ | -------------------- |
| R_10   | Volatility 10 Index  |
| R_25   | Volatility 25 Index  |
| R_50   | Volatility 50 Index  |
| R_75   | Volatility 75 Index  |
| R_100  | Volatility 100 Index |

### Token Listing — DexScreener REST API

Real Solana token pairs. No API key, no authentication.

GET https://api.dexscreener.com/latest/dex/search?q=pump
GET https://api.dexscreener.com/latest/dex/search?q=bonk

The hook (`useLiveTokens.ts`) fetches every 15 seconds and categorizes
tokens by age:

| Column           | Age range   | Sort default |
| ---------------- | ----------- | ------------ |
| New Tokens       | < 1 hour    | Newest first |
| About to Migrate | 1 – 6 hours | Snipe Score  |
| Migrated         | > 6 hours   | Volume       |

Between real fetches, a simulated micro-update runs every 2 seconds,
updating ~35% of rows to trigger flash animations and keep the UI alive.

---

## Key Features

### Snipe Score

A 0–100 composite signal. No incumbent terminal surfaces this as a single
ranked number — traders on GMGN, Axiom, and Photon are doing this math
manually on every token. Snipe Score automates it.

| Component     | Weight | Signal                                  |
| ------------- | ------ | --------------------------------------- |
| LP Burned     | 30 pts | Rug-pull protection                     |
| Vol Velocity  | 25 pts | Volume relative to market cap           |
| Buy Pressure  | 10 pts | 5m buys vs sells ratio                  |
| Holder Spread | 15 pts | Decentralisation (log market cap proxy) |
| Dev Wallet    | 20 pts | Creator wallet risk signal              |

The top scorer in New Tokens is promoted to the **HOT SNIPE** card pinned
above the column. Hovering any score badge shows the per-component
breakdown with progress bars.

### Candlestick Chart

Built on the Canvas API — no charting library. Full control, zero bundle
overhead, redraws imperceptibly at 60fps.

| Interaction     | Behaviour                                     |
| --------------- | --------------------------------------------- |
| Drag            | Pan left/right through history                |
| Scroll          | Move through candles (3 per tick)             |
| Ctrl + scroll   | Zoom in/out (10–200 visible candles)          |
| Pinch (touch)   | Zoom on mobile                                |
| Hover           | Crosshair with OHLC values for hovered candle |
| "Latest" button | Snaps back to live edge when scrolled back    |
| Retry button    | Reconnects on WebSocket error                 |

The bottom 20% of the chart area shows a volume histogram. A scrollbar
below it shows position within the full candle history.

### Real-Time Token Feed

- Green flash on price up, red flash on price down (700ms CSS animation)
- Sort per column: Snipe Score / Volume / Age / Change %
- Click the same sort key again to reverse direction
- Search bar filters all three columns simultaneously by name or address
- Star any token to save to watchlist — persists across sessions in localStorage
- Skeleton loaders while initial data loads
- Empty state with search query shown when no results match

### Wallet Connection

Simulated wallet flow with four options: Phantom, Solflare, MetaMask,
WalletConnect. A 1.4 second handshake delay simulates the real connection
flow. On success:

- Connected address shown in AppNav as `7xKf...eAx` with a pulsing green dot
- Dropdown gives full address, copy button, and disconnect
- Copy triggers a toast: "Wallet address copied!"
- Disconnect clears context and localStorage
- State persists across page reloads

### Toast Notifications

Custom implementation — no external dependency.

- Four types: success / error / warning / info
- Spring-animated slide in from the right
- Shrinking progress bar shows time remaining
- Click anywhere on a toast to dismiss early
- Queue capped at 5 simultaneous toasts (oldest drops off)

### Page Transitions

`AnimatePresence` wraps every route with a 220ms fade + 8px slide.
The exit animation fully completes before the next page enters (`mode="wait"`).

### Theme Toggle

- Animated sun ↔ moon swap with 90° rotation + scale + fade
- `ThemeContext` is the single source of truth — syncs React state with
  the `dark` class on `<html>` so Tailwind responds correctly
- Inline `<script>` in `layout.tsx` sets the class before first paint,
  preventing the flash of wrong theme on load
- Persists to localStorage as `'dark'` or `'light'`

---

## Design Philosophy

Trenchers is built for people who trade in the trenches — not for people
who read about trading. Every decision starts from one question: does this
help someone make a faster, smarter decision with real money on the line?

The terminal is dense by intention. Traders who use GMGN, Axiom, and
Photon are not confused by information density — they're slowed down by
the lack of it. Where incumbents bury signal in noise, Trenchers surfaces
it. The Snipe Score is the clearest example: instead of showing raw LP
burned percentages and holder spreads separately, we collapse five signals
into one ranked number so a trader can scan a column in two seconds and
know exactly where to act.

Mobile is not a downgrade. Most of this market trades on their phone, in
motion, with one hand. Every layout accounts for touch targets, thumb
reach, and the fact that a 375px screen needs to convey everything a
desktop does — just prioritized differently.

The aesthetic is purposeful restraint. Dark by default because that is
where traders live. Purple as the single accent because it stands out
against red/green trade data without competing with it. Motion only when
it carries meaning — a flash tells you a price changed, a skeleton tells
you data is coming. Nothing moves for its own sake.

---

## Research Notes

### What incumbents do poorly

**GMGN** — excellent data density but no composited signal. You manually
cross-reference LP burned, holder concentration, and volume on every token.
Mobile is an afterthought.

**Axiom** — cleaner design but slower to surface new launches. Token
security exists but is buried three clicks deep. No ranked signal.

**BullX** — powerful filtering but weak information hierarchy. A $200
volume token looks identical to a $200K volume token at a glance.

**Photon** — fast and reliable but inconsistent color system. Buy/sell
signals use the same green as positive stats, making the trade table hard
to scan under time pressure.

**Common gap across all:** no synthesized "should I snipe this" signal.
Every trader runs the same 5-factor mental model on every token manually.
Snipe Score automates that loop.

---

## What I Would Build Next

1. **Real Solana wallet integration** via `@solana/wallet-adapter` for
   actual Phantom/Solflare connections and on-chain transaction signing
2. **Birdeye API** for genuine security data — real LP burned %, mint
   authority revocation, top holder concentration — replacing the current
   Snipe Score simulation
3. **Pump.fun WebSocket** (`wss://frontend-api.pump.fun`) for real new
   launch detection in the New Tokens column, replacing DexScreener polling
4. **Position tracking** — store executed trades in IndexedDB and calculate
   real P&L across sessions without a backend
5. **Price alerts** — register wallet addresses with a Helius webhook and
   push browser notifications when thresholds are hit

---

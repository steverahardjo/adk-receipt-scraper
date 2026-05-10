# Deneb — Mobile Finance Tracker

> A daily-use personal finance tracker. Built with Tauri 2 + Svelte 5 + Framework7 9.

---

## Stack

| Layer | Technology |
|---|---|
| Shell | Tauri 2 (Rust backend, webview frontend) |
| Framework | SvelteKit 2 (SPA mode, `adapter-static`) |
| Reactivity | Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) |
| UI Library | Framework7 9 (iOS theme via `framework7-svelte`) |
| Charts | Nivo (lazy-loaded: line, pie, bar) |
| Icons | Framework7 Icons 5 |
| Fonts | Manrope + Public Sans (self-hosted woff2) |
| Bundler | Vite 6 |
| Package Manager | Bun |

---

## Project Structure

```
mobile_frontend/
├── DESIGN.md                        # Design system documentation
├── PROJECT.md                       # This file
└── tauri-app/
    ├── package.json
    ├── svelte.config.js
    ├── vite.config.js
    ├── static/
    │   └── fonts/                   # Self-hosted woff2 fonts
    ├── src/
    │   ├── app.html                 # Root HTML template
    │   ├── lib/
    │   │   ├── app.css              # Design system CSS variables (light + dark)
    │   │   ├── f7.ts                # Framework7 initialization
    │   │   ├── DenebApp.svelte      # Root f7 <App> wrapper
    │   │   ├── BaseLayer.svelte     # Core layout shell (navbar, drawer, float bar)
    │   │   └── features/
    │   │       ├── core/            # Shared: Drawer, Toast, Theme, ContextPicker, longpress, auth
    │   │       ├── dashboard/       # Dashboard widgets
    │   │       ├── records/         # Transaction ledger, types, mock data, charts
    │   │       ├── scanner/         # QRIS/TNG scanner: types.ts, scanner.ts, ScannerModal.svelte
    │   │       ├── expense/         # Expense/income form
    │   │       ├── notifications/   # Notification feed
    │   │       └── verification/    # Login, signup, OTP forms
    │   ├── routes/
    │   │   ├── +layout.svelte       # Root layout (theme init, toast, DenebApp)
    │   │   ├── +layout.ts           # SSR = false
    │   │   ├── +page.svelte         # Dashboard (/)
    │   │   ├── records/             # Records (/records)
    │   │   ├── expense_form/        # Add expense (/expense_form)
    │   │   ├── chatbot/             # AI chat (/chatbot)
    │   │   ├── notifications/       # Notifications (/notifications)
    │   │   ├── lock/                # Lock screen (/lock)
    │   │   └── verification/        # Auth (/verification)
    │   └── features/
    │       └── verification/        # (moved to lib/features/verification/)
    └── src-tauri/                   # Rust backend, plugins, capabilities
        └── src/
            ├── main.rs
            ├── lib.rs               # Plugin registration + parse_qris command
            ├── commands.rs           # Existing Tauri commands
            └── qris.rs              # QRIS EMVCo TLV parser + TNG deeplink parser
```

---

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | Dashboard | Net worth, cash flow, accounts pie, scrollable cards (recent, bills, categories), budget modal, QRIS scanner modal |
| `/records` | Records | Transaction list with search, period filter, date range, amount slider, Nivo charts |
| `/expense_form` | Add Expense | Expense/income form with currency, category, payment method, accepts pre-filled merchant/amount from QRIS scan |
| `/chatbot` | AI Chat | Chat interface with context pre-fill from long-press |
| `/notifications` | Notifications | Security, payment, investment, alert notifications |
| `/lock` | Lock Screen | Fingerprint + passcode unlock |
| `/verification` | Auth | Login / Signup / OTP verification flow |

---

## Architecture

### Layout Chain

```
app.html
  └── +layout.svelte
        ├── <Toast />                     (global overlay, z-index 20000)
        └── <DenebApp>                    (f7 <App theme="ios">)
              └── <BaseLayer>              (navbar + drawer + page content + float bar)
                    ├── <Navbar>           (title, back button, navbarRight snippet, theme toggle)
                    ├── <Drawer>           (bottom-sheet navigation)
                    ├── <PageContent>      ({@render children()})
                    └── <FloatBar>         (centered pill: scan + menu buttons)
```

### BaseLayer Props

```typescript
{
  title?: string           // Navbar title
  noNavbar?: boolean       // Hide navbar
  noDrawer?: boolean       // Hide floating action bar
  navbarRight?: Snippet    // Custom content in navbar right (e.g. notification bell)
  onScan?: () => void      // Callback when scan button tapped in float bar
  children?: Snippet       // Page content
}
```

### Navigation

- **Navbar**: back arrow (non-root), title, custom right actions (notification bell), theme toggle
- **Floating bar**: centered pill at bottom with frosted-glass effect — QR Scan + Menu buttons. Scan button fires `onScan` callback (wired on dashboard to open ScannerModal)
- **Drawer**: bottom-sheet with grouped navigation items + theme toggle in footer

---

## State Management

Svelte 5 runes throughout — no external state library.

| Pattern | Usage |
|---|---|
| `$state()` | Local component state, reactive singletons |
| `$derived()` / `$derived.by()` | Computed values, filtered data, totals |
| `$effect()` | Side effects (IntersectionObserver, animations, timers, localStorage) |
| `$props()` / `$bindable()` | Component inputs / two-way bindings |

### Module-level singletons

- **`theme.svelte.ts`** — `createTheme()` → `export const theme`. Persists to `localStorage`, respects `prefers-color-scheme`.
- **`toast.svelte.ts`** — Module-level `$state` for toast. Exports `showToast()`, `dismissToast()`, `getToastState()`.
- **`useSignup.svelte.ts`** — Reactive signup state machine (name, email, password, OTP, validation).

### Data Flow

All data is currently **mock data**. No API integration yet.

- Dashboard: hardcoded values (net worth, accounts, transactions)
- Records: `generateEntries(200)` produces 200 mock Entry objects
- Notifications: `mockNotifications` array
- Charts: transaction data piped through Nivo

---

## Entry Schema

```typescript
interface Entry {
  id: string
  title: string
  amount: number
  currency: 'MYR' | 'USD' | 'EUR' | 'IDR'
  date: Date
  flow: 'expense' | 'income'
  type?: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other'        // expense
  paymentMethod?: 'Cash' | 'Card' | 'Transfer' | 'E-Wallet'           // expense
  source?: 'Salary' | 'Freelance' | 'Gift' | 'Other'                  // income
  description?: string
  documentLink?: string                                                 // payment proof URL
}
```

---

## Design System

### Colors

| Token | Light | Dark |
|---|---|---|
| Primary | `#006c50` | `#24e0ab` |
| Secondary | `#008da3` | `#6ed4ec` |
| Page bg | `#f9f9fc` | `#1a1c1e` |
| Card bg | `#ffffff` | `#2f3133` |
| Positive | `#006c50` | `#24e0ab` |
| Negative | `#ba1a1a` | `#ffb4ab` |
| Accent button | `#2ee5af` | `#24e0ab` |
| Muted text | `#6b7b72` | `#6b7b72` |

### Typography

- **Manrope** (400, 500, 600, 700) — headings, values, body
- **Public Sans** (500, 600) — labels, subtitles, metadata

### Cards

```css
border-radius: 16px;
box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
border: 1px solid rgba(0, 141, 163, 0.08);
```

---

## Key Features

### Long-Press → AI Chat

Any card section can be long-pressed to open a **ContextPicker** bottom sheet with "Talk about this" action. This navigates to the chatbot page with `?context=...` containing structured financial data about that card.

| Card | Context sent |
|---|---|
| WelcomeCard | Net worth, assets, liabilities, monthly income/spent |
| CashFlowStrip | Income, expenses, net |
| AccountPie | All account balances with total |
| RecentTxList | Recent expenses with amounts |
| UpcomingBills | Bills with amounts |
| CategoryBreakdown | Category totals |
| Records SummaryBar | Totals + type breakdown + payment method breakdown |
| ExpenseForm | Form description |

### Dashboard Widgets

1. **WelcomeCard** — greeting, net worth, assets/liabilities, monthly income/spent
2. **CashFlowStrip** — income/expense/net with progress bar
3. **AccountPie** — SVG donut chart of 5 accounts
4. **Scrollable row** (horizontal snap-scroll): Recent Spending, Upcoming Bills, Category Breakdown
5. **Budget button** — opens bottom-sheet with daily budget ring (Rp 150K)
6. **Today's date chip** at top

### Records Filters

- Period chips: 1W / 1M / 3M / 1Y / All
- Search by title, type, source, or payment method
- Date range (from/to)
- Amount range (dual slider)
- Collapsible "More Filters" section
- Clear button when custom filters active

### Lazy Charts (Nivo)

Charts are **lazy-loaded** via dynamic `import()` in `onMount`:
- Daily Trend line chart (30 days)
- Spending Category donut
- Monthly stacked bar (6 months)

---

### QRIS / TNG Scanner

Triggered from the float bar scan button on the dashboard. Opens a bottom-sheet `ScannerModal` with:

1. **Camera viewfinder** — corner brackets with animated scan line
2. **jsQR decoding** — each frame is captured to canvas and decoded in-browser via `jsQR`
3. **Rust TLV parsing** — raw QR string sent to `invoke('parse_qris')` which runs in `qris.rs`:
   - **QRIS (EMVCo)** — parses merchant name (tag 59), amount (tag 54), reference (tag 62/01)
   - **TNG Deeplink** (`tngdwallet://...`) — parses `mpid`, `orderid`, `path`
4. **Result card** — shows code type badge (QRIS/TNG), merchant, amount, reference
5. **Fill Expense** — navigates to `/expense_form?merchant=X&amount=Y` with pre-filled form
6. **Manual input** — fallback text field to paste QRIS/TNG string directly

### Scanner Pipeline

```
Camera → getUserMedia → <video> → canvas frame → jsQR.decode() → raw string
    → invoke('parse_qris') → Rust qris.rs → { merchant, amount, deeplink }
    → ScannerModal shows result → goto(deeplink) → expense form pre-filled
```

---

## Tauri Plugins

| Plugin | Purpose |
|---|---|
| biometric | Fingerprint/auth on mobile |
| clipboard-manager | Clipboard access |
| deep-link | Deep linking support |
| geolocation | Location services |
| http | HTTP requests from Rust |
| opener | Open files/URLs |
| store | Persistent key-value store |
| notification | Native notifications |
| fs | Filesystem access |
| dialog | Native dialogs |

---

## Performance

| Metric | Target |
|---|---|
| First paint | < 1.5s |
| Dashboard interactive | < 2s |
| Chart load (on demand) | < 300ms |
| Chart libraries (lazy) | Loaded only on expand |

---

## Future Roadmap

| Phase | Feature |
|---|---|
| P0 | Real API integration (replace mock data) |
| P0 | AI chat backend integration |
| P1 | Budget tracking with goals |
| P1 | Export CSV/PDF |
| P1 | Push notifications |
| P1 | Multi-currency support |
| P1 | TNG deeplink handling via `tauri-plugin-deep-link` (external app opens) |
| P2 | Desktop biometric unlock |

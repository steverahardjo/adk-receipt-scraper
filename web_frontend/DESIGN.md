# Deneb — Lightweight System Design

> A daily-use personal finance tracker. Lean visuals, fast interactions, mobile-first.
> Reduce chart overhead. Keep every function. Add QR-scanning for instant message/expense capture.

---

## 1. Design Philosophy

| Principle | Meaning |
|---|---|
| **Daily Check-In** | 30-second glance shows net worth, recent spend, upcoming bills. No analysis paralysis. |
| **Lightweight Visuals** | Replace full nivo charts with inline sparklines, compact stat bars, collapsible panels. One chart at a time, not a dashboard full. |
| **Zero-Input Capture** | QR scanner + OCR camera = expense entry without typing. Scan a QRIS code → auto-fill merchant & amount. |
| **Mobile Pocketable** | Every layout works on a phone screen. No horizontal scroll. Thumbs reach all actions. |

---

## 2. Architecture Overview

```
┌─ TanStack Start (React 19 + Vite 8) ─────────────────────┐
│                                                            │
│  Routes              Layout              Features           │
│  ──────              ──────              ────────          │
│  /                   BaseLayer            dashboard/*       │
│  /records            (sidebar + header)   records/*         │
│  /recurring                               recurring/*       │
│  /chat                                     chat/*           │
│  /expense-form                            form/*            │
│  /login | /signup                         auth/*            │
│                                                            │
│  UI: Tailwind v4 + Radix primitives + shadcn-style         │
│  Data: TanStack Query (server) + React Form (client)       │
│  Charts: Nivo (on-demand, lazy loaded)                     │
│  Auth: better-auth (email/password + OTP)                  │
│  Camera: getUserMedia via <video> capture                  │
└────────────────────────────────────────────────────────────┘
```

### Component Layers

```
Layout Layer    ─►  BaseLayer (sidebar + header + main)
   │
Page Layer      ─►  index.tsx | records.tsx | recurring.tsx | chat.tsx
   │
Feature Layer   ─►  dashboard/ | records/ | recurring/ | chat/ | form/ | notifications/
   │
UI Layer        ─►  components/ui/* (Radix primitives, shadcn style)
```

---

## 3. Core Features & Lightweight Strategy

### 3.1 Dashboard (index.tsx) → "Daily Snapshot"

**Current (heavy):** 7 nivo charts in a bento grid — line, pie ×3, bar, donut, stacked bars.

**Lightweight (proposed):**

| Widget | Replacement | Rationale |
|---|---|---|
| NetWorthLineChart | Inline sparkline + delta badge | Trend at a glance; full chart only on click |
| AccountCards donut | Compact account list with mini bar | "Where's my money" in 2 lines |
| AssetBreakdown | Collapsed by default, expand on tap | Rarely changes day-to-day |
| CashFlowChart | Stat row (Income / Expense / Net) | Numbers are faster to read than bars |
| InvestmentPie | Accordion list, no donut | Holdings list is more actionable |
| ExpensePie | Top-3 categories list + "see all" link | No chart needed for 3 items |
| NewsSummary | Keep as-is (text + links) | Lightweight by nature |

**Layout (mobile-first):**
```
┌─ Snap strip ────────────────────────────────────┐
│  Net Worth: Rp 187.5M  ▲12%  |  ━━ sparkline ━  │
│  Cash: Rp 11.5M  |  Invest: Rp 157M             │
│  Income Rp 8.5M  |  Spend Rp 3.3M  |  Net +5.2M │
│  ─────────────────────────────────────────────  │
│  Top Spend: 🥇 Food 35%  🥈 Transport 20%  🥉 Bills 18% │
├────────────────────────────────────────────────┤
│  Accounts:  BCA 5.2M  Mandiri 3.1M  Cash 1.8M  │
│            GoPay 850K  DANA 500K  CC -12.5M     │
│                                            ↑ tap → │
├────────────────────────────────────────────────┤
│  ▽ Asset Breakdown (tap to expand)              │
│  Liquid ████████████████████ 8%                 │
│  Stocks ██████████████████████████████████ 45%  │
│  ...                                           │
├────────────────────────────────────────────────┤
│  ▽ Investment Holdings (tap to expand)          │
│  BBCA 200s  @Rp9,500  +Rp1.5M                  │
│  BBRI 500s  @Rp5,100  +Rp450K                  │
│  ...                                           │
└────────────────────────────────────────────────┘
```

**Key principle:** Everything collapsed by default. Tap to drill in. No chart loads until opened.

### 3.2 Transaction Records (/records)

Keep as-is — the virtualized table, SummaryBar, and FlowChart (sankey) are already functional and not visual-heavy. The sankey chart can be collapsed by default.

### 3.3 Daily Needs / Recurring (/recurring)

Keep as-is — calendar + card list. Lightweight by design.

### 3.4 AI Chat Assistant (/chat)

Keep as-is — chat UI with preset message forwarding from dashboard news items. Add QR scanner output as new message source (see §5).

### 3.5 Expense Form (/expense-form)

Keep existing OCR camera flow. Add QR IS code parsing as an alternative input method (see §5).

---

## 4. Data Flow

```
MockData (dev)          Real API (prod)
    │                        │
    ▼                        ▼
  [useMemo / loader] ──► Component props
                              │
                              ▼
                     TanStack Query cache
                              │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
           Dashboard      Records       Chat/Form
```

- **Dev mode:** All data comes from `mockdata.ts` generators (seeded faker + deterministic ranges). No backend needed.
- **Prod mode:** Loader functions in route definitions fetch from API. Components receive same shapes.
- **Mutating actions:** TanStack Form for expense entry. Chat mutations via TanStack Query `useMutation`.

---

## 5. QR Code Scanner (New Feature)

### 5.1 Purpose

Scan QR codes in two contexts:
1. **QRIS payment codes** (Indonesia standard) — decode merchant name + amount → auto-fill expense form
2. **Message QR codes** — encode a pre-written chat prompt → send directly to AI assistant

### 5.2 User Flow

**Flow A — Scan to Expense:**
```
1. User taps QR icon on /expense-form or / (header)
2. Camera opens (mobile: native camera; desktop: browser <video>)
3. QR detected → decode → extract { merchant, amount, ref }
4. Auto-fill expense form merchant + amount fields
5. User adds category, taps Save
```

**Flow B — Scan to Chat:**
```
1. User taps QR icon on /chat or / (header)
2. Camera opens
3. QR detected → decode → extract message string
4. Auto-fill chat input or directly submit to AI
5. AI responds with contextual answer
```

### 5.3 Technical Implementation

```typescript
// src/features/scanner/types.ts
type ScannableCode = {
  type: 'qris' | 'message'
  raw: string
  merchant?: string
  amount?: number
  reference?: string
  message?: string
}

// src/features/scanner/ScannerModal.tsx
// - Uses getUserMedia for camera access
// - Renders <video> with overlay box
// - Reads frames via canvas 2D context
// - Decodes with jsQR or native BarcodeDetector
// - On decode: closes modal, dispatches to form or chat
```

### 5.4 Dependencies

- `jsQR` (lightweight, no WASM) for QR decoding, OR
- Native `BarcodeDetector` API (Chromium-based browsers) with `jsQR` fallback

### 5.5 UI Placement

```
Header (BaseLayer):
┌──────────────────────────────────────────────┐
│  ☰                    ● Notification Bell  │
│              [📷 Scan QR]                    │
└──────────────────────────────────────────────┘

Scan QR button visible on all pages.
On mobile: bottom-nav bar + QR FAB in center.
```

---

## 6. Route Map

| Path | Page | Components | Lightweight status |
|---|---|---|---|
| `/` | Dashboard | DailySnapshot, AccountList, CollapsibleAssetBreakdown, CollapsibleInvestments | Charts collapsed by default |
| `/records` | Ledger | SummaryBar, VirtualTable, CollapsibleFlowChart | Already lean |
| `/recurring` | Daily Needs | SummaryBar, Calendar, RecurringCards | Already lean |
| `/chat` | AI Assistant | ChatBar, ChatBubbles, FilePreview, CamInput | Already lean |
| `/expense-form` | Expense Entry | ExpenseFormCard, OCRCamera, QRScanner | Add QR scanner |
| `/login` | Login | LoginCard | Auth only |
| `/signup` | Sign Up | SignUpCard | Auth only |

---

## 7. Component Tree (Condensed)

```
BaseLayer
├── AppSidebar (nav, user info)
├── Header
│   ├── SidebarTrigger (mobile hamburger)
│   ├── ScanQRButton ◄── NEW
│   └── NotificationBell
└── Main Content (rounded card)
    └── <Outlet /> (page content)
```

### Dashboard (index.tsx) Component Tree

```
Page
├── Header (title + date)
├── DailySnapshot
│   ├── NetWorthSparkline (compact line, click → modal with full chart)
│   ├── CashStatsRow (Income | Expense | Net)
│   └── TopSpendRow (top 3 categories with mini bar)
├── AccountList (compact horizontal scroll of name + balance pills)
├── CollapsibleAssetBreakdown (collapsed by default, expand tap)
└── CollapsibleInvestments (accordion-style holdings list)
```

Changes from current:
- Remove AccountCards (nivo pie) → AccountList (text pills)
- Remove NetWorthLineChart standalone → CompactSparkline (small, in DailySnapshot)
- Remove CashFlowChart → CashStatsRow (text only)
- Remove ExpensePie → Top-3 spend categories (text + inline bar)
- Remove InvestmentPie → CollapsibleInvestments (accordion list only)
- Keep AssetBreakdown but collapsed by default
- Keep NewsSummary as-is
- Keep CashFlowStrip → merged into CashStatsRow

---

## 8. Colors & Typography (Tailwind v4 Theme)

Lightweight also means no visual bloat — maintain the warm palette but reduce decorative elements.

```css
/* Core tokens (existing, unchanged) */
--color-amber: #c4904a;
--color-ochre: #c97a6b;
--color-sage: #5baa8a;
--color-teal: #3d8a7a;
--color-sky: #1479d0;
--color-navy: #004e8c;

/* Surface */
--color-bg-warm: #faf8f5;
--color-card: #ffffff;
--color-border: #e8e4df;

/* Typography */
font-family: system-ui, -apple-system, sans-serif;
/* No serif. No custom font files. System stack = zero load cost. */
```

---

## 9. Performance Targets

| Metric | Target |
|---|---|
| First paint (empty cache) | < 1.5s |
| Dashboard interactive | < 2s |
| Chart load (on demand) | < 300ms |
| QR scan decode | < 500ms |
| JS bundle (initial) | < 100KB gzipped |
| Chart libraries (lazy) | Loaded only on expand |

---

## 10. Future Roadmap

| Phase | Feature | Depends on |
|---|---|---|
| P0 | QR scanner (message + expense) | jsQR or BarcodeDetector |
| P0 | Collapsible dashboard sections | Current dashboard refactor |
| P1 | Budget progress bar in DailySnapshot | Budget type + calc |
| P1 | Export to CSV/PDF | records table data |
| P2 | Push notifications for bill due-dates | Service worker + permission |
| P2 | Multi-currency / auto-exchange | Exchange rate API |

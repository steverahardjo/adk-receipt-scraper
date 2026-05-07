# Deneb — Lightweight System Design

> A daily-use personal finance tracker. Lean visuals, fast interactions, mobile-first.
> Reduce chart overhead. Keep every function. Add QR-scanning for instant message/expense capture.

---

### Framework7 + SvelteKit Stack
- **Framework7 Svelte** provides native-feeling UI components (`f7-page`, `f7-navbar`, `f7-panel`, `f7-list`, `f7-toolbar`, etc.) with built-in iOS/Material themes.
- **SvelteKit** handles file-based routing, SSR/SSG, and API routes.
- **Right-side panel** with `cover` effect and `swipe` gesture.
- Opened via navbar hamburger icon (`f7:menu`) or swipe right-to-left.
- Auto-closes on link tap (`panel-close` attribute).
- Persistent across all routes — defined once in `+layout.svelte` inside `<App>`.

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
┌─ SvelteKit (Svelte 5 + Vite 6) ──────────────────────────┐
│                                                            │
│  Routes (file-based)       Layout              Features    │
│  ────────────────          ──────              ────────   │
│  /                         +layout.svelte      dashboard/* │
│  /records                  (f7-page shell)     records/*   │
│  /recurring                                    recurring/* │
│  /chat                                          chat/*     │
│  /expense-form                                 form/*      │
│  /login | /signup                              auth/*      │
│                                                            │
│  UI: Framework7 Svelte (iOS/Material theme)               │
│  Data: TanStack Query (server) + Svelte forms (client)    │
│  Charts: Nivo (on-demand, lazy loaded)                    │
│  Auth: better-auth (email/password + OTP)                 │
│  Camera: getUserMedia via <video> capture                 │
└────────────────────────────────────────────────────────────┘
```

### Component Layers

```
Layout Layer    ─►  +layout.svelte (f7-app > f7-view > f7-panel + f7-page shell)
   │
Page Layer      ─►  +page.svelte for each route
   │
Feature Layer   ─►  src/lib/features/dashboard/ | records/ | recurring/ | chat/ | form/ | notifications/
   │
UI Layer        ─►  Framework7 Svelte components (f7-*) + lib/components/*
```

---

## 3. Core Features & Lightweight Strategy

### 3.1 Dashboard (+page.svelte) → "Daily Snapshot"

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

### 7.1 Navigation: Right-Side Drawer (Panel)

Navigation uses **Framework7's f7-panel component** as a right-side drawer triggered from the navbar:

```svelte
<!-- +layout.svelte -->
<f7-panel right cover swipe>
  <f7-page>
    <f7-list>
      <f7-list-item link="/"           title="Home"        panel-close icon-f7="house" />
      <f7-list-item link="/records"    title="Records"     panel-close icon-f7="list_bullet" />
      <f7-list-item link="/chat"       title="Chat"        panel-close icon-f7="chat_bubble_2" />
      <f7-list-item link="/expense-form" title="Add Expense" panel-close icon-f7="plus_circle" />
    </f7-list>
  </f7-page>
</f7-panel>
```

- `panel-close` on each item closes the drawer on navigation.
- Swipe gesture (right-to-left) also opens the drawer.
- Bottom `f7-toolbar` tab bar remains for quick one-tap switching between main sections.

---

## 4. Data Flow

```
MockData (dev)          Real API (prod)
    │                        │
    ▼                        ▼
  [SvelteKit load] ──► Component data
                              │
                              ▼
                     TanStack Query cache
                              │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
           Dashboard      Records       Chat/Form
```

- **Dev mode:** All data comes from `$lib/mockdata.ts` generators (seeded faker + deterministic ranges). No backend needed.
- **Prod mode:** SvelteKit `load` functions in `+page.server.ts` / `+layout.server.ts` fetch from API. Components receive same shapes.
- **Mutating actions:** SvelteKit form actions (`+page.server.ts` actions) + TanStack Query `useMutation` for chat.

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

```svelte
<!-- src/lib/features/scanner/types.ts -->
type ScannableCode = {
  type: 'qris' | 'message'
  raw: string
  merchant?: string
  amount?: number
  reference?: string
  message?: string
}

<!-- src/lib/features/scanner/ScannerModal.svelte -->
<!--
  - Uses getUserMedia for camera access
  - Renders <f7-panel> or <f7-popup> with <video> overlay
  - Reads frames via canvas 2D context
  - Decodes with jsQR or native BarcodeDetector
  - On decode: closes modal, dispatches to form or chat
-->
```

### 5.4 Dependencies

- `jsQR` (lightweight, no WASM) for QR decoding, OR
- Native `BarcodeDetector` API (Chromium-based browsers) with `jsQR` fallback

### 5.5 UI Placement

```
f7-navbar (in +layout.svelte):
┌──────────────────────────────────────────────┐
│  ☰                    ● Notification Bell  │
│              [📷 Scan QR]                    │
└──────────────────────────────────────────────┘

Scan QR button visible on all pages via f7-navbar.
On mobile: f7-toolbar bottom tab bar + QR FAB in center.
```

---

## 6. Route Map

| Path | SvelteKit File | Page | Components | Lightweight status |
|---|---|---|---|---|---|
| `/` | `+page.svelte` | Dashboard | DailySnapshot, AccountList, CollapsibleAssetBreakdown, CollapsibleInvestments | Charts collapsed by default |
| `/records` | `records/+page.svelte` | Ledger | SummaryBar, VirtualTable, CollapsibleFlowChart | Already lean |
| `/recurring` | `recurring/+page.svelte` | Daily Needs | SummaryBar, Calendar, RecurringCards | Already lean |
| `/chat` | `chat/+page.svelte` | AI Assistant | ChatBar, ChatBubbles, FilePreview, CamInput | Already lean |
| `/expense-form` | `expense-form/+page.svelte` | Expense Entry | ExpenseFormCard, OCRCamera, QRScanner | Add QR scanner |
| `/login` | `login/+page.svelte` | Login | LoginCard | Auth only |
| `/signup` | `signup/+page.svelte` | Sign Up | SignUpCard | Auth only |

---

## 7. Component Tree (Condensed)

```
f7-app (theme: iOS | MD)
└── f7-view
    ├── f7-panel (right cover swipe) ← drawer
    │   └── f7-page > f7-list
    │       ├── f7-list-item (Home,     link="/")
    │       ├── f7-list-item (Records,  link="/records")
    │       ├── f7-list-item (Chat,     link="/chat")
    │       └── f7-list-item (Add Expense, link="/expense-form")
    ├── f7-page (per-route, from +layout.svelte)
    │   ├── f7-navbar
    │   │   └── f7-nav-right → f7-link (panel-open="right", icon: menu)
    │   └── f7-page-content
    │       └── {@render children()} <!-- Svelte 5 snippet slot -->
    └── f7-toolbar (bottom tab bar)
        ├── f7-link (Home,     icon: house,           route: "/")
        ├── f7-link (Records,  icon: list_bullet,     route: "/records")
        ├── f7-link (Scan QR,  icon: camera_viewfinder, route: "/scan")
        ├── f7-link (Chat,     icon: chat_bubble_2,   route: "/chat")
        └── f7-link (Add,      icon: plus_circle,     route: "/expense-form")
```

### Layout Component (+layout.svelte)

```svelte
<f7-app theme="auto">
  <f7-panel right cover swipe>
    <f7-page>
      <f7-list>
        <f7-list-item link="/" title="Home" panel-close />
        <f7-list-item link="/records" title="Records" panel-close />
        <f7-list-item link="/chat" title="Chat" panel-close />
        <f7-list-item link="/expense-form" title="Add Expense" panel-close />
      </f7-list>
    </f7-page>
  </f7-panel>

  <f7-view main>
    <f7-page>
      <f7-navbar>
        <f7-nav-right>
          <f7-link panel-open="right" icon-f7="menu" />
        </f7-nav-right>
      </f7-navbar>
      <f7-page-content>
        {@render children()}
      </f7-page-content>
    </f7-page>
  </f7-view>

  <f7-toolbar bottom>
    <f7-link route="/" icon-f7="house" />
    <f7-link route="/records" icon-f7="list_bullet" />
    <f7-link route="/scan" icon-f7="camera_viewfinder" />
    <f7-link route="/chat" icon-f7="chat_bubble_2" />
    <f7-link route="/expense-form" icon-f7="plus_circle" />
  </f7-toolbar>
</f7-app>
```

### Dashboard (+page.svelte) Component Tree

```svelte
<f7-page>
  <f7-navbar title="Dashboard" />
  <f7-page-content>
    <DailySnapshot>
      <NetWorthSparkline />       <!-- compact line, click → f7-popup with full chart -->
      <CashStatsRow />            <!-- Income | Expense | Net -->
      <TopSpendRow />             <!-- top 3 categories with mini bar -->
    </DailySnapshot>
    <AccountList />               <!-- compact horizontal scroll pills -->
    <CollapsibleAssetBreakdown /> <!-- f7-accordion, collapsed by default -->
    <CollapsibleInvestments />    <!-- f7-accordion, holdings list -->
  </f7-page-content>
</f7-page>
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

## 8. Colors & Typography (Framework7 Theme)

Lightweight also means no visual bloat — maintain the warm palette but reduce decorative elements. Framework7 CSS variables drive theming.

```css
/* Framework7 theme overrides */
:root {
  /* Core tokens (existing, unchanged) */
  --f7-color-amber: #c4904a;
  --f7-color-ochre: #c97a6b;
  --f7-color-sage: #5baa8a;
  --f7-color-teal: #3d8a7a;
  --f7-color-sky: #1479d0;
  --f7-color-navy: #004e8c;

  /* Surface */
  --f7-page-bg-color: #faf8f5;
  --f7-card-bg-color: #ffffff;
  --f7-list-item-border-color: #e8e4df;
  --f7-navbar-bg-color: #ffffff;

  /* Typography */
  --f7-font-family: system-ui, -apple-system, sans-serif;
  /* No serif. No custom font files. System stack = zero load cost. */
}
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

# Deneb — Design System & Architecture

> A daily-use personal finance tracker. Tauri 2 desktop/mobile shell, Svelte 5 reactivity, Framework7 9 UI layer.

---

## Stack

| Layer | Technology |
|-------|-----------|
| **Shell** | Tauri 2 (Rust backend, webview frontend) |
| **Framework** | SvelteKit 2 (SPA mode, `adapter-static`) |
| **Reactivity** | Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) |
| **UI Library** | Framework7 9 (iOS theme, components via `framework7-svelte`) |
| **Charts** | Nivo (lazy-loaded, collapsible by default) |
| **Bundler** | Vite 6 |
| **Icons** | Framework7 icons (`f7:` prefixed) + inline SVGs |

---

## 1. Design Philosophy

| Principle | Meaning |
|---|---|
| **Daily Check-In** | 30-second glance shows net worth, recent spend, upcoming bills. No analysis paralysis. |
| **Lightweight Visuals** | Collapsible sections, lazy-loaded charts. One chart at a time, not a dashboard full. |
| **Zero-Input Capture** | Camera + future QR scanner for expense entry without typing. |
| **Zero-Input Capture** | QRIS/TNG scanner via camera + Rust TLV parser → auto-fills expense form. No typing needed. |
| **Mobile Pocketable** | Every layout works on a phone screen. Thumbs reach all actions. Safe-area-aware. |

---

## 2. Architecture

```
┌─ SvelteKit 2 (SPA) ──────────────────────────────────┐
│                                                        │
│  Routes (file-based)                                   │
│  ──────────────────                                    │
│  /                  Dashboard                          │
│  /records           Transaction ledger                  │
│  /expense_form      Expense entry                      │
│  /chatbot           AI assistant (placeholder)          │
│  /notifications     Notification feed                  │
│  /lock              Biometric + passcode lock screen    │
│  /verification      Auth flow (login / signup / OTP)   │
│                                                        │
│  UI:   Framework7 9 Svelte (iOS theme)                 │
│  Nav:  Custom bottom-sheet Drawer + Float bar          │
│  State: Svelte 5 runes (module-level singletons)       │
│  Charts: Nivo (on-demand, lazy imported)               │
│  Auth: Custom login/signup/OTP flow                    │
│        (no external auth library)                      │
│  Scanner: jsQR (browser decode) + Rust qris.rs         │
│           (EMVCo TLV + TNG deeplink parser)            │
│           → auto-fill expense form                     │
│                                                        │
├─ Tauri 2 ────────────────────────────────────────────┤
│  Plugins: biometric, clipboard-manager, deep-link,     │
│           geolocation, http, opener, store,            │
│           notification, fs, dialog                     │
└────────────────────────────────────────────────────────┘
```

### Component Layers

```
+layout.svelte         ─►  Toast overlay + DenebApp (f7 App wrapper)
    │
DenebApp.svelte        ─►  f7 <App theme="ios"> shell
    │
BaseLayer.svelte       ─►  f7 <Page> + Drawer + Navbar + Toolbar + FAB
    │
├── Drawer.svelte      ─►  Bottom-sheet nav (Dashboard, Notifications, Records, Chat, Theme toggle)
├── Navbar             ─►  Title + hamburger → opens Drawer
├── f7-page-content    ─►  {@render children()} (route content)
├── Toolbar            ─►  Tab bar: Home / Chat / Add / Records
└── FAB (optional)     ─►  Floating action button (dashboard, expense form)
```

---

## 3. Route Map

| Path | Page | Shell | Components |
|------|------|-------|-----------|
| `/` | Dashboard | `BaseLayer fab` | WelcomeCard, CashFlowStrip, AccountCards, NewsFeed |
| `/records` | Records | `BaseLayer noToolbar` | SummaryBar, PeriodFilter, RecordList, RecordDetail, FlowOverview |
| `/expense_form` | Expense Form | `BaseLayer fab` | ExpenseFormCard |
| `/chatbot` | Chat | `BaseLayer` | Placeholder |
| `/notifications` | Notifications | `BaseLayer` | NotificationFeed |
| `/lock` | Lock Screen | `BaseLayer noToolbar` | Fingerprint, Passcode |
| `/verification` | Auth | standalone | LoginForm, SignupForm, OtpVerify |

---

## 4. Navigation

### Bottom Toolbar (visible on most pages)

```
[ Home ]  [ Chat ]  [ Add ]  [ Records ]
   house     chat      plus      list
             bubble   circle    bullet
             _2       _fill
```

- Appears in `BaseLayer.svelte` via `<Toolbar tabbar labels bottom>`.
- Hidden when `noToolbar` prop is set (records, lock screen).
- Dashboard & expense form also show a FAB (hamburger) that opens the Drawer.

### Drawer (bottom sheet)

Custom `Drawer.svelte` component — NOT Framework7's built-in panel. Bottom-sheet style with backdrop overlay, spring animation, expandable groups:

- **Dashboard** (`/`)
- **Notifications** (`/notifications`)
- **Records** (expandable: View Records, Add Record)
- **Chat** (`/chatbot`)
- **Theme toggle** (Light/Dark mode) at the bottom

Opened via hamburger icon in navbar or FAB button. Closes on backdrop tap or item selection.

---

## 5. Routes

### 5.1 Dashboard `/`

```
┌─ Notif bell ─ Date chip ─────────────────┐
│                                          │
│  WelcomeCard                             │
│  ┌────────────────────────────────────┐  │
│  │ Good morning 👋                    │  │
│  │ Net Worth: Rp 187.5M               │  │
│  │ Assets Rp 201.7M · Liab Rp 14.2M  │  │
│  │ Income Rp 8.5M · Spent Rp 3.3M    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  CashFlowStrip                           │
│  ┌────────────────────────────────────┐  │
│  │ Income 8.5M ████████               │  │
│  │ Expense 3.3M ███                   │  │
│  │ Net    +5.2M █████                 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  AccountCards                            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌───┐ │
│  │ BCA │ │Mand │ │Cash │ │GoPay│ │DANA│ │
│  │5.2M │ │3.1M │ │1.8M │ │850K │ │500K│ │
│  └─────┘ └─────┘ └─────┘ └─────┘ └───┘ │
│                                          │
│  NewsFeed (dismissable items)            │
│  ┌────────────────────────────────────┐  │
│  │ 📰 Market Update  → dismiss       │  │
│  │ 📰 12.12 Sale     → dismiss       │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### 5.2 Records `/records`

- SummaryBar (Income / Expense / Net with proportional bar)
- Collapsible "Flow Overview" — lazy-loaded Nivo charts (line trend, pie categories, bar monthly)
- Search bar (by merchant or category)
- Period filter chips: 1W / 1M / 3M / 1Y / All
- Virtualized transaction list grouped by date (Today / Yesterday / This Week / This Month / Earlier)
- Infinite scroll via IntersectionObserver
- Tap row → bottom-sheet RecordDetail

### 5.3 Expense Form `/expense_form`

- Full form: title, amount, date, currency, expense/income toggle, category/payment/source dropdowns, notes
- Camera button for OCR capture (placeholder)
- Accepts pre-filled `?merchant=X&amount=Y` from QRIS scanner

### 5.4 Chat `/chatbot`

- Placeholder: "AI Assistant coming soon."

### 5.5 Notifications `/notifications`

- List of mock notifications with type icons (security, payment, investment, alert)
- Unread indicator styling

### 5.6 Lock Screen `/lock`

- Brand logo + "Deneb" title
- Fingerprint scan button (pulse glow animation)
- Divider + 6-digit numeric passcode keypad
- Hardcoded unlock code: `111111`
- On success → navigate to `/`

### 5.7 Auth `/verification`

- Three-mode flow: Login ↔ Signup ↔ OTP Verify
- Login: email + password, Google OAuth button, link to signup
- Signup: full name, email, password (with strength rules), OTP code send/verify
- OTP: 6 single-digit inputs with auto-advance, paste support, resend timer
- Uses `Svelte 5` {#key} + fade transition for mode switching

---

## 6. State Management

Svelte 5 runes throughout — no external state library.

| Pattern | Usage |
|---------|-------|
| `$state()` | Local component state, reactive singletons |
| `$derived()` | Computed values (filtered/search results) |
| `$derived.by()` | Multi-step computations (grouped transactions) |
| `$effect()` | Side effects (IntersectionObserver, animations, localStorage) |
| `$props()` / `$bindable()` | Component inputs / two-way bindings |

### Module-level singletons

- **`theme.svelte.ts`** — `createTheme()` factory → `export const theme`. Persists to `localStorage`, respects `prefers-color-scheme`.
- **`toast.svelte.ts`** — Module-level `$state` for toast state. Exports `showToast()`, `dismissToast()`, `getToastState()`.
- **`useSignup.svelte.ts`** — Reactive signup state machine (name, email, password, OTP, validation).

### Data flow

Currently all mock data (inline or generated from `mockdata.ts`). No API integration yet.

---

## 7. Design Tokens

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--f7-theme-color` | `#006c50` | `#24e0ab` | Primary (dark green / bright green) |
| `--f7-theme-color-shade` | `#00513b` | `#1bc49a` | Primary pressed |
| `--f7-theme-color-tint` | `#008a65` | `#3cf0bc` | Primary hover |
| `--f7-secondary-color` | `#008da3` | `#6ed4ec` | Secondary (teal) |
| `--f7-page-bg-color` | `#f9f9fc` | `#1a1c1e` | Page background |
| `--f7-page-text-color` | `#1a1c1e` | `#f0f0f3` | Body text |
| `--f7-card-bg-color` | `#ffffff` | `#2f3133` | Card surface |
| `--f7-button-bg-color` | `#2ee5af` | `#24e0ab` | Primary button fill |
| `--f7-input-bg-color` | `#f0f9f8` | `#2f3133` | Input background |
| `--f7-tabbar-link-color` | `#6b7b72` | `#6b7b72` | Inactive tab |
| `--f7-tabbar-link-active-color` | `#006c50` | `#24e0ab` | Active tab |

### Semantic colors

| Context | Light | Dark |
|---------|-------|------|
| Positive/income | `#006c50` | `#24e0ab` |
| Negative/expense | `#ba1a1a` | `#ffb4ab` |
| Toast success | `#2ee5af` | `#24e0ab` |
| Toast error | `#ba1a1a` | `#ffb4ab` |
| Muted label | `#6b7b72` | `#6b7b72` |

### Typography

| Font | Weight | Usage |
|------|--------|-------|
| **Manrope** | 400, 500, 600, 700 | Headings, values, body text |
| **Public Sans** | 500, 600 | Labels, subtitles, metadata |

Sizes:
- `--f7-headline-xl`: 40px/48px, weight 700, letter-spacing -0.02em
- `--f7-headline-lg`: 32px/40px, weight 700, letter-spacing -0.01em
- `--f7-headline-md`: 24px/32px, weight 600

### Card styling

```css
border-radius: 16px;
box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06), 0 1px 4px rgba(0, 141, 163, 0.04);
border: 1px solid rgba(0, 141, 163, 0.08);
```

All design tokens defined in `src/lib/app.css` as CSS custom properties on `:root` / `.dark`.

---

## 8. Component Tree

```
f7-app (theme: ios)
└── Toast (global overlay, z-index 20000)
└── f7-view
    └── f7-page
        ├── Drawer (bottom-sheet, z-index 13001)
        │   ├── Dashboard        ─► /
        │   ├── Notifications    ─► /notifications
        │   ├── Records (group)
        │   │   ├── View Records ─► /records
        │   │   └── Add Record   ─► /expense_form
        │   ├── Chat             ─► /chatbot
        │   └── Theme toggle
        ├── f7-navbar (optional, hidden if fab/noNavbar)
        │   └── f7-nav-right → Link (hamburger, opens Drawer)
        ├── f7-page-content
        │   └── {@render children()} ← route content
        ├── f7-toolbar bottom (optional, 4 tabs)
        │   ├── Home    (house icon,      route: /)
        │   ├── Chat    (chat_bubble_2,   route: /chatbot)
        │   ├── Add     (plus_circle_fill, route: /expense_form)
        │   └── Records (list_bullet,     route: /records)
        └── FAB (optional, right-floating hamburger)
```

---

## 9. Key Files

| Purpose | Path |
|---------|------|
| Design tokens & theme | `src/lib/app.css` |
| Theme state | `src/lib/features/core/theme.svelte.ts` |
| Toast state | `src/lib/features/core/toast.svelte.ts` |
| Toast UI | `src/lib/features/core/Toast.svelte` |
| F7 App wrapper | `src/lib/DenebApp.svelte` |
| Page shell | `src/lib/BaseLayer.svelte` |
| Drawer nav | `src/lib/features/core/Drawer.svelte` |
| Nav config | `src/lib/features/core/types.ts` |
| F7 init | `src/lib/f7.ts` |
| Root layout | `src/routes/+layout.svelte` |
| Dashboard | `src/routes/+page.svelte` |
| Records | `src/routes/records/+page.svelte` |
| Expense form | `src/routes/expense_form/+page.svelte` |
| Chat | `src/routes/chatbot/+page.svelte` |
| Notifications | `src/routes/notifications/+page.svelte` |
| Lock screen | `src/routes/lock/+page.svelte` |
| Auth | `src/routes/verification/+page.svelte` |
| Dashboard components | `src/lib/features/dashboard/` |
| Records components | `src/lib/features/records/` |
| Expense form components | `src/lib/features/expense/` |
| Auth components | `src/features/verification/` |

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| First paint (empty cache) | < 1.5s |
| Dashboard interactive | < 2s |
| Chart load (on demand) | < 300ms |
| JS bundle (initial) | < 100KB gzipped |
| Chart libraries (lazy) | Loaded only on expand |

**Note:** Google Fonts (`Manrope` + `Public Sans`) are self-hosted as woff2 in `static/fonts/` and loaded via `@font-face` rules in `app.css`.

---

## 11. Future Roadmap

| Phase | Feature | Notes |
|-------|---------|-------|
| P0 | AI Chat assistant | Replace placeholder |
| P0 | Real API integration | Replace mock data |
| P1 | Budget progress | Budget types + calc |
| P1 | Export CSV/PDF | From records |
| P1 | Push notifications | Service worker + Tauri notification plugin |
| P1 | Multi-currency | Exchange rate API |
| P1 | TNG deeplink handling via tauri-plugin-deep-link | External app opens |
| P2 | Biometric unlock on desktop | Tauri biometric plugin |

# Deneb — Design System & Architecture

> Personal finance tracker. Tauri 2 shell. Svelte 5 reactivity. Premium utilitarian minimalism.

---

## Stack

| Layer | Technology |
|-------|-----------|
| **Shell** | Tauri 2 (Rust backend, webview frontend) |
| **Framework** | SvelteKit 2 (SPA mode, `adapter-static`) |
| **Reactivity** | Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) |
| **UI Library** | Framework7 9 (iOS theme, overridden for editorial minimalism) |
| **Charts** | Nivo (lazy-loaded, collapsible by default) |
| **Bundler** | Vite 6 |
| **Fonts** | Geist Sans + Geist Mono + JetBrains Mono via Fontsource |

---

## 1. Design Philosophy

| Principle | Meaning |
|---|---|
| **Editorial Clarity** | Every view reads like a well-typeset document. No visual noise. |
| **Breathing Room** | Generous macro-whitespace. Cards have 24px+ internal padding. |
| **Warm Monochrome** | Off-black text on warm bone canvas. Color is scarce, only for meaning. |
| **Zero-Input Capture** | QRIS/TNG scanner via camera + Rust TLV parser → auto-fills expense form. |
| **Utilitarian Data** | Monospace for all numeric values. Tabular-nums everywhere. Clean alignment. |
| **Flat Architecture** | 1px structural borders, minimal shadow, deliberate edge. |

---

## 2. Typography

| Classification | Font | Weights | Usage |
|---|---|---|---|
| **Primary Sans** | Geist Sans | 400, 500, 600, 700 | Body text, UI, buttons, labels |
| **Display/Mono** | Geist Mono | 400, 500, 600, 700 | Numeric values, keystrokes, metadata, code |
| **Data Mono** | JetBrains Mono | 400, 700 | Financial data, tabular columns, amounts |

### Typographic Scale

| Token | Size | Weight | Line Height | Tracking |
|-------|------|--------|-------------|----------|
| `headline-xl` | 28px | 700 | 1.2 | -0.02em |
| `headline-lg` | 20px | 600 | 1.3 | -0.01em |
| `headline-md` | 17px | 600 | 1.3 | -0.01em |
| `body-lg` | 15px | 400 | 1.6 | 0 |
| `body` | 14px | 400 | 1.6 | 0 |
| `label-md` | 12px | 500 | 1.4 | 0.02em |
| `label-sm` | 11px | 500 | 1.3 | 0.03em |

---

## 3. Color System

### Light (Default — Warm Editorial)

| Token | Value | Role |
|-------|-------|------|
| Canvas | `#FBFBFA` | Page background |
| Surface | `#FFFFFF` | Card/block backgrounds |
| Text Primary | `#111111` | Body text, headings |
| Text Secondary | `#787774` | Secondary text, metadata |
| Text Muted | `#B0B0AD` | Disabled, placeholders |
| Border | `#EAEAEA` | Structural dividers, card edges |
| Divider | `#F0F0EE` | Subtle row separators |
| Accent Dark | `#111111` | Primary buttons, active states |
| Accent On Dark | `#FFFFFF` | Text on dark accent |

### Semantic Pastels

| Context | Background | Text |
|---------|-----------|------|
| Positive / Income | `#EDF3EC` | `#346538` |
| Negative / Expense | `#FDEBEC` | `#9F2F2D` |
| Informational | `#E1F3FE` | `#1F6C9F` |
| Warning / Alert | `#FBF3DB` | `#956400` |

### Dark

| Token | Value | Role |
|-------|-------|------|
| Canvas | `#18181A` | Page background |
| Surface | `#252528` | Card/block backgrounds |
| Text Primary | `#ECECEC` | Body text |
| Text Secondary | `#9D9D9F` | Secondary text |
| Border | `rgba(255,255,255,0.08)` | Dividers |
| Accent Dark | `#ECECEC` | Buttons, active |
| Accent On Dark | `#18181A` | Text on accent |

---

## 4. Architecture

```
┌─ SvelteKit 2 (SPA) ──────────────────────────────────┐
│                                                        │
│  Routes (file-based)                                   │
│  ──────────────────                                    │
│  /                  Dashboard                          │
│  /records           Transaction ledger                 │
│  /expense_form      Expense entry                      │
│  /chatbot           AI assistant (placeholder)         │
│  /notifications     Notification feed                  │
│  /lock              Biometric + passcode lock screen   │
│  /verification      Auth flow (login / signup / OTP)   │
│                                                        │
│  UI:   Framework7 9 (editorial override)               │
│  Nav:  Custom bottom-sheet Drawer + Float bar          │
│  State: Svelte 5 runes (module-level singletons)       │
│  Charts: Pure SVG / Nivo (lazy)                        │
│  Auth: Custom login/signup/OTP flow                    │
│  Scanner: jsQR + Rust qris.rs (EMVCo TLV parser)       │
│                                                        │
├─ Tauri 2 ────────────────────────────────────────────┤
│  Plugins: biometric, clipboard-manager, deep-link,     │
│           geolocation, http, opener, store,            │
│           notification, fs, dialog                     │
└────────────────────────────────────────────────────────┘
```

### Component Layers

```
+layout.svelte    ─►  Toast, LoadingOverlay, DenebApp
    │
DenebApp.svelte   ─►  f7 <App> shell
    │
BaseLayer.svelte  ─►  f7 <Page> + Drawer + Navbar + FloatBar
    │
├── Drawer        ─►  Editorial bottom-sheet nav
├── Navbar        ─►  Title + actions
├── PageContent   ─►  @render children() (route content)
└── FloatBar      ─►  Scan + Menu
```

---

## 5. Route Map

| Path | Page | Shell | Components |
|------|------|-------|-----------|
| `/` | Dashboard | `BaseLayer` | WelcomeCard, CashFlowStrip, AccountPie, RecentTxList, UpcomingBills, CategoryBreakdown |
| `/records` | Records | `BaseLayer` | SummaryBar, PeriodFilter, RecordList, RecordDetail, FlowOverview |
| `/expense_form` | Expense Form | `BaseLayer` | ExpenseFormCard |
| `/chatbot` | Chat | `BaseLayer` | Placeholder |
| `/notifications` | Notifications | `BaseLayer` | NotificationFeed |
| `/lock` | Lock Screen | `BaseLayer` | Fingerprint, Passcode |
| `/verification` | Auth | standalone | LoginForm, SignupForm, OtpVerify |

---

## 6. Component Rules

| Rule | Spec |
|------|------|
| Card border | `1px solid #EAEAEA` always |
| Card radius | `8px` ~ `12px` max |
| Card padding | `20px` ~ `28px` minimum |
| Card shadow | `0 1px 3px rgba(0,0,0,0.04)` maximum |
| Button radius | `6px` ~ `8px` |
| Button shadow | None. Hover: subtle color shift. Active: `scale(0.98)` |
| Tag/ badge radius | `9999px` (pill shape) |
| Tag background | Pastel semantic colors |
| Macro whitespace | `24px` ~ `40px` between sections |
| Text columns | `max-width: 620px` for body text |

---

## 7. State Management

Svelte 5 runes throughout — no external state library.

| Pattern | Usage |
|---------|-------|
| `$state()` | Local component state, reactive singletons |
| `$derived()` | Computed values |
| `$derived.by()` | Multi-step computations |
| `$effect()` | Side effects (IntersectionObserver, localStorage) |
| `$props()` / `$bindable()` | Component inputs |

### Module-level singletons

- **`theme.svelte.ts`** — `createTheme()` → `export const theme`. Persists to `localStorage`.
- **`toast.svelte.ts`** — `showToast()`, `dismissToast()`, `getToastState()`.
- **`useSignup.svelte.ts`** — Reactive signup state machine.

---

## 8. Entry Schema

```typescript
interface Entry {
  id: string
  title: string
  amount: number
  currency: 'MYR' | 'USD' | 'EUR' | 'IDR'
  date: Date
  flow: 'expense' | 'income'
  type?: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other'
  paymentMethod?: 'Cash' | 'Card' | 'Transfer' | 'E-Wallet'
  source?: 'Salary' | 'Freelance' | 'Gift' | 'Other'
  description?: string
  documentLink?: string
}
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
| Root layout | `src/routes/+layout.svelte` |
| Dashboard | `src/routes/+page.svelte` |
| Records | `src/routes/records/+page.svelte` |
| Expense form | `src/routes/expense_form/+page.svelte` |

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| First paint | < 1.5s |
| Dashboard interactive | < 2s |
| Chart load | < 300ms |
| JS bundle (initial) | < 100KB gzipped |

---

## 11. Future Roadmap

| Phase | Feature |
|-------|---------|
| P0 | AI Chat assistant, Real API integration |
| P1 | Budget tracking, Export CSV/PDF, Push notifications, Multi-currency |
| P2 | Desktop biometric unlock |

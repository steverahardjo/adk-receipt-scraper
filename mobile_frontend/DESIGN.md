# Deneb — Design System & Architecture

> Personal finance tracker. Tauri 2 shell. Svelte 5 reactivity. A warm private ledger.

---

## Stack

| Layer | Technology |
|-------|-----------|
| **Shell** | Tauri 2 (Rust backend, webview frontend) |
| **Framework** | SvelteKit 2 (SPA mode, `adapter-static`) |
| **Reactivity** | Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) |
| **UI Library** | Framework7 9 (iOS theme, overridden for a ledger aesthetic) |
| **Charts** | LayerChart (Svelte, in-app) · Plotly (AI-returned specs only) |
| **Bundler** | Vite 6 |
| **Fonts** | System serif (display/numerals) + Geist Sans (UI) + Geist Mono (data) |

---

## 1. Design Philosophy — Ledger

| Principle | Meaning |
|---|---|
| **Warm Paper** | Off-black ink on warm paper. Color is scarce and earthy; it marks status, never decoration. |
| **Ruled Order** | Hairline rules and clear alignment do the work that borders, shadows and chips would. |
| **Serif Numerals** | Money is set in a serif with tabular figures — it reads like an account book, not a dashboard. |
| **One Number to Start** | The first thing you see is the number you can act on: what's left to spend today. |
| **Quiet Throughout** | Amounts are neutral ink. Red/green is reserved for status (over budget, net loss). |
| **Thumb-First Navigation** | A bottom tab bar with a center Add. Every primary destination is one tap. |

---

## 2. Typography

| Classification | Font | Usage |
|---|---|---|
| **Display / Numerals** | System serif stack (`Iowan Old Style`, Palatino, Georgia, `ui-serif`) | Hero numbers, net worth, card totals, section headings |
| **UI / Body** | Geist Sans | Labels, buttons, list titles, body copy |
| **Data / Meta** | Geist Mono | Amounts, tabular figures, dates, eyebrow labels |

The serif is referenced by `--deneb-serif`; mono by `--deneb-mono`. Only one
mono family is used (JetBrains Mono is retired).

### Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero | 34px | 600 | Safe-to-spend number |
| `headline-lg` | 20px | 600 | Section titles |
| `headline-md` | 17px | 600 | Card titles |
| body | 14–15px | 400–500 | UI, lists |
| label | 10–11px | 500–600 | Mono eyebrows, uppercase |

---

## 3. Color System

### Light — Warm Paper

| Token | Value | Role |
|-------|-------|------|
| Canvas | `#F6F2E9` | Page background |
| Surface | `#FFFDF8` | Cards |
| Surface 2 | `#FBF7EF` | Inset / icon wells |
| Ink | `#1C1A16` | Text, buttons, active |
| Text Secondary | `#5C564D` | Supporting text |
| Text Muted | `#857E73` | Decorative labels only |
| Border | `#E4DCCB` | Card edges |
| Rule | `#E9E2D3` | Row separators |
| Divider | `#EDE7DA` | Track backgrounds |

### Semantic (earthy, for status only)

| Context | Text | Background |
|---------|------|-----------|
| Positive / Under budget / Gain | `#2E6A4E` | `#E8F0E9` |
| Negative / Over budget / Loss | `#9A3B33` | `#F7E8E5` |
| Informational | `#345A73` | `#E8EEF2` |
| Warning / Due soon | `#8A6410` | `#F6EFD9` |

### Dark — Warm Charcoal

| Token | Value |
|-------|------|
| Canvas | `#1A1815` |
| Surface | `#24221E` |
| Ink | `#EFEAE1` |
| Text Secondary | `#A9A296` |
| Border | `rgba(255,255,255,0.08)` |
| Rule | `rgba(255,255,255,0.07)` |

---

## 4. Architecture

```
┌─ SvelteKit 2 (SPA) ──────────────────────────────────┐
│  Routes (file-based)                                  │
│  /  /records  /expense_form  /chatbot                 │
│  /notifications  /lock  /verification  /settings/*    │
│                                                       │
│  UI:   Framework7 9 (ledger override)                 │
│  Nav:  Bottom TabBar (Home · Records · Add · Chat ·   │
│        More) + bottom-sheet Drawer from "More"        │
│  State: Svelte 5 runes (module-level singletons)      │
│  Charts: LayerChart; Plotly only for AI replies       │
│  Auth: login/signup/OTP flow                          │
│  Scanner: Rust qris.rs (EMVCo TLV parser) via Tauri   │
├─ Tauri 2 ────────────────────────────────────────────┤
│  Plugins: biometric, clipboard-manager, deep-link,    │
│           geolocation, http, opener, store,           │
│           notification, fs, dialog, barcode-scanner   │
└───────────────────────────────────────────────────────┘
```

### Component Layers

```
+layout.svelte    ─►  Toast, LoadingOverlay, DenebApp
    │
DenebApp.svelte   ─►  f7 <App> shell
    │
BaseLayer.svelte  ─►  f7 <Page> + Navbar + PageContent + TabBar + Drawer
    │
├── TabBar        ─►  Home · Records · (+ Add) · Chat · More
├── Drawer        ─►  bottom-sheet nav opened by "More"
├── Navbar        ─►  title + avatar + theme + page actions
└── PageContent   ─►  @render children() (route content)
```

---

## 5. Route Map

| Path | Page | Key components |
|------|------|----------------|
| `/` | Dashboard | SafeToSpend (hero), AccountList, UpcomingBills, RecentTxList |
| `/records` | Records | SummaryBar, PeriodFilter, RecordList, RecordDetail, FlowOverview |
| `/expense_form` | Add Entry | ExpenseFormCard, ReceiptScanner |
| `/chatbot` | Chat | ChatChart (Plotly for AI specs) |
| `/notifications` | Notifications | NotificationFeed |
| `/lock` | Lock Screen | Fingerprint, Passcode |
| `/verification` | Auth | LoginForm, SignupForm, OtpVerify |
| `/settings/*` | Settings | SettingsScaffold / Group / Row |

---

## 6. Component Rules

| Rule | Spec |
|------|------|
| Card background | Surface, `1px solid` border |
| Card radius | `8px` (inputs/buttons `6–10px`) |
| Card shadow | None — hairline rules instead |
| Card padding | `18–20px` |
| Row separators | `1px solid var(--deneb-rule)` |
| Amounts | Neutral ink, mono, tabular figures, signed (`+` / `−`) |
| Status color | Only net / over-budget / gain-loss, never every row |
| Tap targets | ≥44px |
| Label minimum | 10–11px mono, sentence or uppercase with tracking |
| Section spacing | `16px` between blocks |

---

## 7. Dashboard hierarchy

1. **SafeToSpend (hero)** — budget ring + "left to spend today"; income / spent / net for the month; net worth demoted to a footer line.
2. **AccountList** — ranked liquid accounts with proportional bars (no donut, no per-account rainbow).
3. **UpcomingBills** — soonest dues; warning pill only when due within 3 days.
4. **RecentTxList** — latest expenses, neutral amounts.

---

## 8. State Management

Svelte 5 runes — no external state library. Module-level singletons:
`theme.svelte.ts`, `toast.svelte.ts`, `settings.svelte.ts`, `profile.svelte.ts`,
`categories.svelte.ts`, `ai.svelte.ts`, `lock.svelte.ts`, and
`records/store.svelte.ts` (the transaction store).

---

## 9. Entry Schema

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

## 10. Key Files

| Purpose | Path |
|---------|------|
| Design tokens | `src/lib/app.css` |
| Page shell + nav | `src/lib/BaseLayer.svelte` |
| Bottom navigation | `src/lib/features/core/TabBar.svelte` |
| Drawer nav | `src/lib/features/core/Drawer.svelte` |
| Dashboard hero | `src/lib/features/dashboard/SafeToSpend.svelte` |
| Records | `src/routes/records/+page.svelte` |
| Entry form | `src/lib/features/expense/ExpenseFormCard.svelte` |

---

## 11. Performance Targets

| Metric | Target |
|--------|--------|
| First paint | < 1.5s |
| Dashboard interactive | < 2s |
| Chart load | < 300ms |

---

## 12. Future Roadmap

| Phase | Feature |
|-------|---------|
| P0 | Real persistence + API integration, AI chat backend |
| P1 | Budget editor, Export CSV/PDF, Push notifications, Multi-currency |
| P2 | Desktop biometric unlock |

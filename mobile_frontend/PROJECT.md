# Deneb — Mobile Finance Tracker

> Personal finance tracker. Tauri 2 + Svelte 5 + Framework7 9. Premium utilitarian minimalism.

---

## Stack

| Layer | Technology |
|---|---|
| Shell | Tauri 2 (Rust backend, webview frontend) |
| Framework | SvelteKit 2 (SPA mode, `adapter-static`) |
| Reactivity | Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) |
| UI Library | Framework7 9 (iOS theme via `framework7-svelte`, editorial override) |
| Charts | Nivo (lazy-loaded: line, pie, bar) |
| Icons | Framework7 Icons 5 |
| Fonts | Geist Sans + Geist Mono + JetBrains Mono (self-hosted via Fontsource) |
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
    │   ├── app.html
    │   ├── lib/
    │   │   ├── app.css              # Design system CSS (warm monochrome + dark)
    │   │   ├── f7.ts                # Framework7 init
    │   │   ├── DenebApp.svelte      # Root f7 <App> wrapper
    │   │   ├── BaseLayer.svelte     # Core layout shell
    │   │   └── features/
    │   │       ├── core/            # Shared: Drawer, Toast, Theme, ContextPicker, longpress, auth
    │   │       ├── dashboard/       # Dashboard widgets
    │   │       ├── records/         # Transaction ledger, types, mock data, charts
    │   │       ├── scanner/         # QRIS/TNG scanner
    │   │       ├── expense/         # Expense/income form
    │   │       ├── notifications/   # Notification feed
    │   │       └── verification/    # Login, signup, OTP forms
    │   └── routes/
    │       ├── +layout.svelte       # Root layout
    │       ├── +layout.ts           # SSR = false
    │       ├── +page.svelte         # Dashboard (/)
    │       ├── records/             # Records (/records)
    │       ├── expense_form/        # Add expense (/expense_form)
    │       ├── chatbot/             # AI chat (/chatbot)
    │       ├── notifications/       # Notifications (/notifications)
    │       ├── lock/                # Lock screen (/lock)
    │       └── verification/        # Auth (/verification)
    └── src-tauri/                   # Rust backend
```

---

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | Dashboard | Net worth, cash flow, accounts pie, scrollable cards, budget modal, QRIS scanner |
| `/records` | Records | Transaction list with search, period filter, date range, amount slider, charts |
| `/expense_form` | Add Expense | Expense/income form, accepts pre-filled merchant/amount from QRIS scan |
| `/chatbot` | AI Chat | Chat interface with context pre-fill |
| `/notifications` | Notifications | Security, payment, investment, alert notifications |
| `/lock` | Lock Screen | Fingerprint + passcode unlock |
| `/verification` | Auth | Login / Signup / OTP verification |

---

## Architecture

### Layout Chain

```
app.html
  └── +layout.svelte
        ├── <Toast />           (global overlay, z-index 20000)
        ├── <LoadingOverlay />   (global overlay, z-index 21000)
        └── <DenebApp>           (f7 <App theme="ios">)
              └── <BaseLayer>    (navbar + drawer + page content + float bar)
```

### Design System

**Warm monochrome palette** — off-black text on bone canvas. Color reserved for semantic meaning. Pastel accents for income (green), expense (red), info (blue).

**Typography** — Geist Sans for body/UI (400-700), Geist Mono for labels/metadata (400-700), JetBrains Mono for financial data/amounts (400, 700).

**Cards** — `1px solid #EAEAEA` borders, `8-12px` radius, `0 1px 3px` subtle shadow, `20-28px` internal padding.

---

## State Management

Svelte 5 runes — `$state`, `$derived`, `$effect`, `$props`.

Module-level singletons: `theme.svelte.ts`, `toast.svelte.ts`, `useSignup.svelte.ts`.

---

## Entry Schema

```typescript
interface Entry {
  id: string; title: string; amount: number
  currency: 'MYR' | 'USD' | 'EUR' | 'IDR'; date: Date
  flow: 'expense' | 'income'
  type?: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other'
  paymentMethod?: 'Cash' | 'Card' | 'Transfer' | 'E-Wallet'
  source?: 'Salary' | 'Freelance' | 'Gift' | 'Other'
  description?: string; documentLink?: string
}
```

---

## Performance

| Metric | Target |
|---|---|
| First paint | < 1.5s |
| Dashboard interactive | < 2s |
| Chart load (on demand) | < 300ms |
| JS bundle (initial) | < 100KB gzipped |

---

## Future Roadmap

| Phase | Feature |
|---|---|
| P0 | Real API integration, AI chat backend |
| P1 | Budget tracking, Export CSV/PDF, Push notifications, Multi-currency |
| P2 | Desktop biometric unlock |

# Changelog

## 2026-05-27 — Premium Utilitarian Minimalism Refactor

### Design System Overhaul
- Complete visual redesign: Premium Utilitarian Minimalism (warm monochrome, editorial typography)
- Replaced Inter with Geist Sans (body/UI) and Geist Mono (labels/metadata)
- JetBrains Mono retained for financial data/amounts
- New color palette: warm bone canvas (#FBFBFA), off-black text (#111111), pastel semantic accents
  - Positive/Income: #346538 (green)
  - Negative/Expense: #9F2F2D (red)
  - Information: #1F6C9F (blue)
  - Warning: #956400 (yellow)
- Dark mode: warm charcoal (#18181A) with light text (#ECECEC)
- Cards: 1px #EAEAEA borders, 8-12px radius, minimal shadow (0 1px 3px rgba(0,0,0,0.03))
- Buttons: 6px radius, no shadow, active: scale(0.98)
- Period chips: pill-shaped (9999px radius), dark fill on active
- Float bar: frosted glass with backdrop-blur, subtle border
- Drawer: 16px top radius bottom sheet with handle, editorial labels
- Toast: dark background with icon + message, slideDown animation
- Loading overlay: glass-morphism backdrop with spinner
- All components refactored: WelcomeCard, CashFlowStrip, AccountPie, RecentTxList, UpcomingBills, CategoryBreakdown, BudgetModal, SummaryBar, PeriodFilter, RecordList, RecordRow, LoginForm, Drawer, ContextPicker, Toast, LoadingOverlay

### Removed
- Manrope, Public Sans, Inter fonts — replaced with Geist Sans + Geist Mono + JetBrains Mono
- Green/teal theme colors — replaced with warm monochrome + pastel semantic accents
- Rounded buttons and cards — now use tight 6-12px radius
- Heavy box shadows — replaced with 1px structural borders
- Backdrop blur on navbar/toolbar — replaced with solid/translucent backgrounds

---

## 2026-05-27 — Previous Changes

### UI/UX
- Page titles moved from Navbar into page content
- Navbar buttons grouped in pill container
- Loading overlay system (glass-morphism + spinner)
- Font/color consistency fixes

### Liquid Money (AccountPie) Donut Chart
- Interactive center display replacing legend
- Color-blind friendly Okabe-Ito palette

### Notifications Page
- Card restructured

### Records Page — Flow Charts
- Nivo React components replaced with pure Svelte/SVG charts
- Tab navigation added

### Records Page — Layout
- Toolbar moved to top, filter redesigned

### Git
- .gitignore corrections, untracked generated files

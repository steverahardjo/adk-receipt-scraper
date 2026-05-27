# Changelog

## 2026-05-27

### UI/UX

- **Page titles moved from Navbar into page content.** Titles no longer live in the sticky top bar — they render as `28px` Manrope `<h1>` headlines inside the scrollable content area. Spacing refined to `margin: 8px 0 8px` to stay clear of the navbar without wasted gap.
- **Fixed title/content spacing across all pages.** Removed redundant `padding-top: 8px` from per-page `.page` wrappers (Records, Chat, Notifications) — the title's own bottom margin now handles the gap cleanly.

- **Navbar buttons grouped in a pill container.** Both the notification bell and theme toggle now sit inside a shared `.navbar-actions` pill with a bordered background. Individual buttons are transparent inside — the container provides the visual grouping. Styles consolidated in `BaseLayer.svelte`, redundant per-page CSS removed from dashboard.

- **Loading overlay system added.** New `LoadingOverlay.svelte` (full-screen glass-morphism blur + accent-green spinner) and `loading-overlay.svelte.ts` (reactive `showLoading(msg?)`/`hideLoading()` API). Mounted at root layout.

- **Font/color consistency fixes.**
  - Lock screen and verification page headings now use `var(--f7-page-text-color)` instead of hardcoded `#000000` / `#ffffff`.
  - Lock screen subtitle color changed from `#8e8e93` to design-system label color `#6b7b72`.

### Liquid Money (AccountPie) — Donut Chart

- **Legend replaced with interactive center display.** Tapping a donut arc shows the selected account's balance and name in the center. Tap again to deselect. Keyboard accessible.
- **Center text properly anchored** via `<g transform="translate(90,90)">` with `dominant-baseline="middle"`.
- **Color-blind friendly palette** — Okabe-Ito accessibility set:

  | Account  | Color  | Hex       |
  |----------|--------|-----------|
  | BCA      | Blue   | `#0072B2` |
  | Mandiri  | Orange | `#E69F00` |
  | Cash     | Green  | `#009E73` |
  | GoPay    | Pink   | `#CC79A7` |
  | DANA     | Sky    | `#56B4E9` |

### Notifications Page

- **Card restructured.** Removed unnecessary `.page` wrapper div. Card padding increased from `8px` to `16px`. `NotificationFeed` first/last items no longer add redundant padding — the card's own padding handles boundaries.

### Records Page — Flow Charts

- **Nivo React → Pure Svelte/SVG.** The Flow Overview charts never rendered because `<ResponsiveLine>`, `<ResponsivePie>`, `<ResponsiveBar>` are React components that Svelte can't mount. Replaced with 3 native SVG chart components:
  - `DailyTrend.svelte` — line chart with smooth curves, area fills, responsive via `ResizeObserver`, date labels, grid lines
  - `CategoryDonut.svelte` — donut with label connector lines, category names, center count
  - `MonthlyBars.svelte` — stacked bar chart with per-category colors
- **Tab navigation added.** Single chart shown at a time via pill-style tab bar (Daily / Category / Monthly). Tab preference persisted to `localStorage` (`deneb-flow-tab`).
- **Removed all dynamic Nivo imports** and `onMount` loading gating — charts render immediately.

### Records Page — Layout

- **Toolbar moved to top.** Search bar, entries count, Clear button, PeriodFilter, and filter icon now sit in a compact top toolbar — no longer scattered throughout the page.
- **Filter toggle redesigned.** Changed from a large text button to a compact 32×32 icon button in the toolbar.
- **Filter section moved above SummaryBar** instead of floating in the middle of the list.

### Git

- **`.gitignore` corrections.** Fixed non-standard `./` prefixes (→ `/`) on `build` and `src-tauri/gen/`. Updated `src-tauri/.gitignore` from `/gen/schemas` to `/gen/` to ignore the full generated Tauri directory (schemas + Android).
- **Untracked** 40 previously-committed files under `src-tauri/gen/android/`.

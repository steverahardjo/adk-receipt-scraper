# Changelog

## 2026-05-27

## UI/UX

- **Page titles moved from Navbar into page content.** Titles no longer live in the sticky top bar — they render as `28px` Manrope `<h1>` headlines inside the scrollable content area, matching the existing headline-xl design token.
- **Fixed title spacing across pages.** Removed `padding-top: 8px` from content wrappers in Records, Chat, and Notifications pages to eliminate the dead-gap between the new in-content title and the first content element.

- **Loading overlay system added.** Introduced `LoadingOverlay.svelte` (full-screen blur backdrop with accent-green spinner) and `loading-overlay.svelte.ts` (reactive `showLoading(msg?)`/`hideLoading()` API). Mounted at root layout level alongside the existing Toast component.

- **Font/color consistency fixes.**
  - Lock screen and verification screen headings now use `var(--f7-page-text-color)` instead of hardcoded `#000000` / `#ffffff`.
  - Lock screen subtitle color changed from `#8e8e93` to the design system label color `#6b7b72`.

### Liquid Money (AccountPie) — Donut Chart

- **Legend replaced with interactive center display.** Tapping a donut arc now shows the selected account's balance and name in the center of the chart. Tapping again deselects. Keyboard accessible.
- **Center text properly anchored.** Text elements grouped in `<g transform="translate(90,90)">` with `dominant-baseline="middle"` for true visual centering.
- **Color-blind friendly palette.** Switched from Deneb brand greens to the Okabe-Ito accessibility palette (distinguishable across protanopia, deuteranopia, tritanopia):

  | Account  | Color  | Hex       |
  |----------|--------|-----------|
  | BCA      | Blue   | `#0072B2` |
  | Mandiri  | Orange | `#E69F00` |
  | Cash     | Green  | `#009E73` |
  | GoPay    | Pink   | `#CC79A7` |
  | DANA     | Sky    | `#56B4E9` |

## Git

- **`.gitignore` corrections.** Fixed non-standard `./` prefixes (→ `/`) on `build` and `src-tauri/gen/` entries. Updated `src-tauri/.gitignore` from `/gen/schemas` to `/gen/` to ignore the full generated Tauri directory (schemas + Android project).
- **Untracked** 40 previously-committed files under `src-tauri/gen/android/`.

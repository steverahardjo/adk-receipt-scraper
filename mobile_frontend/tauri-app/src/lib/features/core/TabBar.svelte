<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  let { onMore }: { onMore?: () => void } = $props()

  let path = $derived($page.url.pathname)

  type Nav = { href: string; label: string; icon: string }
  type Extra = { label: string; icon: string; href?: string; more?: boolean }

  const left: Nav = { href: '/', label: 'Home', icon: 'home' }
  const mid: Nav = { href: '/records', label: 'Records', icon: 'list' }
  const right: Nav = { href: '/chatbot', label: 'Chat', icon: 'chat' }

  const extras: Extra[] = [
    { href: '/budgets', label: 'Budget', icon: 'budget' },
    { href: '/profile', label: 'Profile', icon: 'user' },
    { href: '/settings', label: 'Settings', icon: 'gear' },
    { label: 'More', icon: 'more', more: true },
  ]

  const R = 156
  const START = 294
  const END = 352

  function angle(i: number) {
    return START + (i * (END - START)) / Math.max(1, extras.length - 1)
  }

  let open = $state(false)

  function isActive(href: string) {
    if (href === '/') return path === '/'
    return path === href || path.startsWith(href + '/')
  }

  function go(href: string) {
    open = false
    if (path !== href) goto(href)
  }

  function pick(item: Extra) {
    open = false
    if (item.more) onMore?.()
    else if (item.href) go(item.href)
  }

  function toggle() {
    open = !open
  }

  // Close the wheel whenever the route changes.
  $effect(() => {
    path
    open = false
  })

  $effect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') open = false }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
</script>

{#snippet icon(name: string, size = 22)}
  {#if name === 'home'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    </svg>
  {:else if name === 'list'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  {:else if name === 'chat'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  {:else if name === 'plus'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  {:else if name === 'wheel'}
    <!-- Six spokes on an exact 60 degrees step. Every spoke runs from r=8.2
         (just inside the r=9 rim, so it meets the rim line instead of leaving
         a gap) to r=2.6 (into the r=2.4 hub). The previous geometry started the
         four diagonal spokes at r=8.25 while the two uprights started at r=9,
         so the asset rendered visibly lopsided. -->
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <line x1="12" y1="3.8" x2="12" y2="9.4" />
      <line x1="19.1" y1="7.9" x2="14.25" y2="10.7" />
      <line x1="19.1" y1="16.1" x2="14.25" y2="13.3" />
      <line x1="12" y1="20.2" x2="12" y2="14.6" />
      <line x1="4.9" y1="16.1" x2="9.75" y2="13.3" />
      <line x1="4.9" y1="7.9" x2="9.75" y2="10.7" />
    </svg>
  {:else if name === 'close'}
    <!-- The trigger swaps to this while the dial is open. The wheel is 6-fold
         symmetric, so rotating it on open (the old 135 degrees) could only ever
         land the spokes off-axis; a glyph swap is the honest affordance. -->
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  {:else if name === 'budget'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10.5h18" />
      <circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  {:else if name === 'user'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  {:else if name === 'gear'}
    <!-- Radial cog: hub plus 8 teeth on a 45 degrees step, drawn from the same
         geometry as the wheel. Replaces Feather's ~1.3 KB settings path, which
         turned to mush at the 20px the fan renders it at. -->
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3.2" />
      <line x1="12" y1="3.4" x2="12" y2="6.6" />
      <line x1="18.08" y1="5.92" x2="15.82" y2="8.18" />
      <line x1="20.6" y1="12" x2="17.4" y2="12" />
      <line x1="18.08" y1="18.08" x2="15.82" y2="15.82" />
      <line x1="12" y1="20.6" x2="12" y2="17.4" />
      <line x1="5.92" y1="18.08" x2="8.18" y2="15.82" />
      <line x1="3.4" y1="12" x2="6.6" y2="12" />
      <line x1="5.92" y1="5.92" x2="8.18" y2="8.18" />
    </svg>
  {:else if name === 'more'}
    <!-- Dots widened to x=5.5/12/18.5 at r=1.7: the old 5/12/19 at r=1.4 spanned
         only 14 units against the 18-unit bounding box every other glyph uses,
         so it read optically smaller than its neighbours in the fan. -->
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" /><circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  {/if}
{/snippet}

{#if open}
  <div class="scrim" class:show={open} onclick={() => (open = false)} role="presentation"></div>
{/if}

<nav class="dock" aria-label="Primary">
  <div class="dock-inner" class:open>
    <button class="slot" class:active={isActive(left.href)} onclick={() => go(left.href)} aria-label={left.label} aria-current={isActive(left.href) ? 'page' : undefined}>
      {@render icon(left.icon)}
      <span>{left.label}</span>
    </button>

    <button class="slot" class:active={isActive(mid.href)} onclick={() => go(mid.href)} aria-label={mid.label} aria-current={isActive(mid.href) ? 'page' : undefined}>
      {@render icon(mid.icon)}
      <span>{mid.label}</span>
    </button>

    <button class="slot add" onclick={() => go('/expense_form')} aria-label="Add entry">
      <span class="add-circle">{@render icon('plus', 24)}</span>
    </button>

    <button class="slot" class:active={isActive(right.href)} onclick={() => go(right.href)} aria-label={right.label} aria-current={isActive(right.href) ? 'page' : undefined}>
      {@render icon(right.icon)}
      <span>{right.label}</span>
    </button>

    <div class="wheel-cell">
      {#each extras as item, i}
        <button
          class="fan-item"
          style="--a:{angle(i)}deg; --r:{open ? R : 0}px; --d:{open ? i * 45 : (extras.length - 1 - i) * 30}ms"
          tabindex={open ? 0 : -1}
          aria-hidden={!open}
          onclick={() => pick(item)}
          aria-label={item.label}
        >
          {@render icon(item.icon, 20)}
          <span>{item.label}</span>
        </button>
      {/each}

      <button
        class="wheel"
        class:open
        class:active={extras.some((e) => e.href && isActive(e.href))}
        onclick={toggle}
        aria-label={open ? 'Close quick menu' : 'Open quick menu'}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {@render icon(open ? 'close' : 'wheel', 24)}
      </button>
    </div>
  </div>
</nav>

<style>
  .scrim {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15, 17, 21, 0.20);
    opacity: 0; transition: opacity var(--ds-dur) var(--ds-ease-standard);
  }
  .scrim.show { opacity: 1; }

  .dock {
    position: fixed;
    left: 16px; right: 16px;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    z-index: 10000;
    max-width: 440px;
    margin: 0 auto;
    pointer-events: none;
  }

  .dock-inner {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    height: 60px;
    border-radius: var(--ds-radius-pill);
    background: var(--ds-chrome-tab-bg);
    border: 1px solid var(--ds-border);
    box-shadow: var(--ds-shadow-md);
    -webkit-backdrop-filter: blur(24px) saturate(1.8);
    backdrop-filter: blur(24px) saturate(1.8);
    pointer-events: auto;
  }

  .slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 60px;
    min-width: 44px;
    border: none;
    background: transparent;
    color: var(--ds-text-muted);
    font-family: var(--ds-font-sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--ds-dur-fast) var(--ds-ease);
  }
  .slot svg { transition: transform var(--ds-dur-fast) var(--ds-ease); }
  .slot:active svg { transform: scale(0.9); }
  .slot.active { color: var(--ds-accent); }
  .slot.active span { font-weight: 600; }

  .add { justify-content: center; }
  .add-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px; height: 46px;
    border-radius: 50%;
    background: var(--ds-accent);
    color: var(--ds-on-accent);
    box-shadow: 0 4px 14px rgba(65, 118, 230, 0.28);
    transition: transform var(--ds-dur-fast) var(--ds-ease);
  }
  .add:active .add-circle { transform: scale(0.94); }

  .wheel-cell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
  }

  .wheel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px; height: 44px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--ds-text-muted);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--ds-dur-fast) var(--ds-ease);
  }
  .wheel svg { transition: transform 0.4s var(--ds-ease); }
  .wheel:active svg { transform: scale(0.9); }
  .wheel.open { color: var(--ds-accent); }
  .wheel.active { color: var(--ds-accent); }

  .fan-item {
    position: absolute;
    left: 50%; top: 50%;
    width: 54px; height: 54px;
    margin: -27px 0 0 -27px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    background: var(--ds-surface);
    color: var(--ds-ink);
    box-shadow: var(--ds-shadow-md);
    font-family: var(--ds-font-sans);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transform: rotate(var(--a)) translateY(calc(-1 * var(--r))) rotate(calc(-1 * var(--a)));
    transform-origin: center;
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.4s var(--ds-ease),
      opacity 0.24s var(--ds-ease);
    transition-delay: var(--d);
  }
  .dock-inner.open .fan-item { opacity: 1; pointer-events: auto; }
  .fan-item:active { background: var(--ds-accent-bg); color: var(--ds-accent); border-color: transparent; }
</style>

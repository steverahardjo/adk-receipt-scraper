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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  {:else if name === 'wheel'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <line x1="12" y1="3" x2="12" y2="6.2" /><line x1="18.4" y1="6.8" x2="16.2" y2="9" /><line x1="18.4" y1="17.2" x2="16.2" y2="15" />
      <line x1="12" y1="21" x2="12" y2="17.8" /><line x1="5.6" y1="17.2" x2="7.8" y2="15" /><line x1="5.6" y1="6.8" x2="7.8" y2="9" />
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  {:else if name === 'more'}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
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
        {@render icon('wheel', 24)}
      </button>
    </div>
  </div>
</nav>

<style>
  .scrim {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0, 0, 0, 0.18);
    opacity: 0; transition: opacity var(--deneb-dur) var(--deneb-ease-standard);
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
    height: 64px;
    border-radius: var(--deneb-radius-pill);
    background: var(--deneb-chrome-tab-bg);
    border: 1px solid var(--deneb-border);
    box-shadow: var(--deneb-shadow-md);
    -webkit-backdrop-filter: blur(24px) saturate(1.8);
    backdrop-filter: blur(24px) saturate(1.8);
    pointer-events: auto;
  }

  .slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 64px;
    min-width: 44px;
    border: none;
    background: transparent;
    color: var(--deneb-text-muted);
    font-family: var(--deneb-sans);
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.01em;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--deneb-dur-fast) var(--deneb-ease);
  }
  .slot svg { transition: transform var(--deneb-dur-fast) var(--deneb-ease); }
  .slot:active svg { transform: scale(0.9); }
  .slot.active { color: var(--deneb-accent); }
  .slot.active span { font-weight: 600; }

  .add { justify-content: center; }
  .add-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--deneb-accent);
    color: var(--deneb-accent-text);
    box-shadow: 0 6px 16px var(--deneb-accent-bg);
    transition: transform var(--deneb-dur-fast) var(--deneb-ease);
  }
  .add:active .add-circle { transform: scale(0.94); }

  .wheel-cell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
  }

  .wheel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px; height: 44px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--deneb-text-muted);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--deneb-dur-fast) var(--deneb-ease);
  }
  .wheel svg { transition: transform 0.4s var(--deneb-ease); }
  .wheel:active svg { transform: scale(0.9); }
  .wheel.open { color: var(--deneb-accent); }
  .wheel.open svg { transform: rotate(135deg); }
  .wheel.active { color: var(--deneb-accent); }

  .fan-item {
    position: absolute;
    left: 50%; top: 50%;
    width: 52px; height: 52px;
    margin: -26px 0 0 -26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    border: 1px solid var(--deneb-border);
    border-radius: 18px;
    background: var(--deneb-surface);
    color: var(--deneb-ink);
    box-shadow: var(--deneb-shadow-md);
    font-family: var(--deneb-mono);
    font-size: 8px;
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
      transform 0.4s var(--deneb-ease),
      opacity 0.24s var(--deneb-ease);
    transition-delay: var(--d);
  }
  .dock-inner.open .fan-item { opacity: 1; pointer-events: auto; }
  .fan-item:active { background: var(--deneb-accent-bg); color: var(--deneb-accent); }
</style>

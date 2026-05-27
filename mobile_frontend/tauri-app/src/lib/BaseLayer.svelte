<script lang="ts">
  import { page } from '$app/stores'
  import { Page, Navbar, NavLeft, NavRight, PageContent, Link, Icon, Button } from 'framework7-svelte'
  import Drawer from '$lib/features/core/Drawer.svelte'
  import { theme } from '$lib/features/core/theme.svelte'
  let {
    title = '',
    noNavbar = false,
    noDrawer = false,
    navbarRight,
    onScan,
    children,
  }: {
    title?: string
    noNavbar?: boolean
    noDrawer?: boolean
    navbarRight?: import('svelte').Snippet
    onScan?: () => void
    children?: import('svelte').Snippet
  } = $props()

  let drawerOpen = $state(false)
  let currentPath = $derived($page.url.pathname)

  function openDrawer() {
    drawerOpen = true
  }

  function handleScan() {
    onScan?.()
  }
</script>

<Page>
  <Drawer opened={drawerOpen} onClose={() => drawerOpen = false} />

  {#if !noNavbar}
    <Navbar>
      {#if currentPath !== '/'}
        <NavLeft>
          <Link onclick={() => history.back()}>
            <Icon ios="f7:arrow_left" />
          </Link>
        </NavLeft>
      {/if}
      <NavRight>
        <div class="navbar-actions">
          {@render navbarRight?.()}
          <button class="theme-nav-btn" onclick={() => theme.toggle()} aria-label="Toggle theme">
            {#if theme.current === 'dark'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            {/if}
          </button>
        </div>
      </NavRight>
    </Navbar>
  {/if}

  <PageContent>
    {#if title}
      <h1 class="page-title">{title}</h1>
    {/if}
    {@render children?.()}
  </PageContent>

  {#if !noDrawer}
    <div class="float-bar">
      <button class="float-btn" onclick={handleScan} aria-label="Scan QR">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7V5a2 2 0 012-2h2" /><path d="M17 3h2a2 2 0 012 2v2" /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path d="M7 21H5a2 2 0 01-2-2v-2" /><rect x="7" y="7" width="10" height="10" rx="2" />
        </svg>
      </button>
      <div class="float-divider"></div>
      <button class="float-btn" onclick={openDrawer} aria-label="Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  {/if}
</Page>

<style>
  .float-bar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 6px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  :global(.dark) .float-bar {
    background: rgba(44, 46, 48, 0.7);
    border-color: rgba(255, 255, 255, 0.08);
  }

  :global(.float-btn) {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: #006c50;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s;
  }
  :global(.dark .float-btn) {
    color: #24e0ab;
  }
  :global(.float-btn:active) {
    background: rgba(0, 0, 0, 0.05);
  }
  :global(.dark .float-btn:active) {
    background: rgba(255, 255, 255, 0.05);
  }

  .float-divider {
    width: 1px;
    height: 24px;
    background: rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
  }
  :global(.dark) .float-divider {
    background: rgba(255, 255, 255, 0.1);
  }

  :global(.page-content) {
    padding-bottom: 100px;
  }

  .page-title {
    margin: 3px 0 8px;
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 700;
    line-height: 34px;
    letter-spacing: -0.02em;
    color: var(--f7-page-text-color);
  }

  :global(.navbar .left a) {
    padding-left: 4px;
  }

  :global(.navbar .left .icon) {
    font-size: 22px;
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 3px;
    border-radius: 12px;
    background: rgba(0, 141, 163, 0.06);
    border: 1px solid rgba(0, 141, 163, 0.08);
  }
  :global(.dark) .navbar-actions {
    background: rgba(110, 212, 236, 0.06);
    border-color: rgba(110, 212, 236, 0.08);
  }

  :global(.theme-nav-btn),
  :global(.notif-btn) {
    position: relative;
    width: 32px; height: 32px;
    border: none;
    border-radius: 9px;
    background: transparent;
    color: #6b7b72;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s;
  }
  :global(.theme-nav-btn:active),
  :global(.notif-btn:active) {
    background: rgba(0, 141, 163, 0.1);
  }
  :global(.dark .theme-nav-btn:active),
  :global(.dark .notif-btn:active) {
    background: rgba(110, 212, 236, 0.1);
  }
</style>

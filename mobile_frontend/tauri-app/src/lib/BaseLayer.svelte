<script lang="ts">
  import { page } from '$app/stores'
  import { Page, Navbar, NavLeft, NavTitle, NavRight, PageContent, Link, Icon } from 'framework7-svelte'
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

  function openDrawer() { drawerOpen = true }
  function handleScan() { onScan?.() }
</script>

<Page>
  <Drawer opened={drawerOpen} onClose={() => drawerOpen = false} />

  {#if !noNavbar}
    <Navbar innerClass="nav-custom">
      <NavLeft>
        {#if currentPath !== '/'}
          <Link onclick={() => history.back()} class="nav-back-link">
            <Icon ios="f7:chevron_left" />
          </Link>
        {/if}
      </NavLeft>
      {#if title}
        <NavTitle>{title}</NavTitle>
      {/if}
      <NavRight>
        <div class="navbar-right-group">
          {@render navbarRight?.()}
          <button class="theme-btn" onclick={() => theme.toggle()} aria-label="Toggle theme">
            {#if theme.current === 'dark'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            {:else}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            {/if}
          </button>
        </div>
      </NavRight>
    </Navbar>
  {/if}

  <PageContent>
    {@render children?.()}
  </PageContent>

  {#if !noDrawer}
    <div class="float-bar">
      <button class="float-btn" onclick={handleScan} aria-label="Scan QR">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7V5a2 2 0 012-2h2" /><path d="M17 3h2a2 2 0 012 2v2" /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path d="M7 21H5a2 2 0 01-2-2v-2" /><rect x="7" y="7" width="10" height="10" rx="2" />
        </svg>
      </button>
      <div class="float-divider"></div>
      <button class="float-btn" onclick={openDrawer} aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  {/if}
</Page>

<style>
  :global(.nav-custom) {
    --f7-navbar-height: 52px;
  }
  :global(.nav-custom .navbar-inner) {
    padding: 0 16px;
  }
  :global(.nav-custom .title) {
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  :global(.nav-back-link) {
    margin-right: 8px;
  }

  .float-bar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 4px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid #EAEAEA;
  }
  :global(.dark) .float-bar {
    background: rgba(37, 37, 40, 0.8);
    border-color: rgba(255, 255, 255, 0.06);
  }

  .float-btn {
    width: 42px; height: 42px;
    border: none; border-radius: 8px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    color: #111111;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s, transform 0.1s;
  }
  :global(.dark) .float-btn { color: #ECECEC; }
  .float-btn:active {
    background: rgba(0,0,0,0.05);
    transform: scale(0.95);
  }
  :global(.dark) .float-btn:active {
    background: rgba(255,255,255,0.06);
  }

  .float-divider {
    width: 1px; height: 24px;
    background: #EAEAEA;
    flex-shrink: 0;
  }
  :global(.dark) .float-divider { background: rgba(255,255,255,0.08); }

  :global(.page-content) {
    padding-top: calc(var(--f7-navbar-height, 52px) + env(safe-area-inset-top, 0px));
    padding-bottom: 100px;
  }

  .navbar-right-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  :global(.theme-btn),
  :global(.notif-btn) {
    position: relative;
    width: 34px; height: 34px;
    border: none; border-radius: 8px;
    background: transparent;
    color: var(--deneb-text-secondary, #787774);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s, transform 0.1s;
  }
  :global(.theme-btn:active),
  :global(.notif-btn:active) {
    background: rgba(0,0,0,0.04);
    transform: scale(0.95);
  }
  :global(.dark .theme-btn:active),
  :global(.dark .notif-btn:active) {
    background: rgba(255,255,255,0.05);
  }
</style>

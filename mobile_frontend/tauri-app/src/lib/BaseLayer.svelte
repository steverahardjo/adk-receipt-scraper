<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { Page, Navbar, NavLeft, NavTitle, NavRight, PageContent, Link, Icon } from 'framework7-svelte'
  import Drawer from '$lib/features/core/Drawer.svelte'
  import SecuritySheet from '$lib/features/core/SecuritySheet.svelte'
  import TabBar from '$lib/features/core/TabBar.svelte'
  import Avatar from '$lib/features/profile/Avatar.svelte'
  import { profile } from '$lib/features/profile/profile.svelte'
  import { theme } from '$lib/features/core/theme.svelte'
  let {
    title = '',
    noNavbar = false,
    noDrawer = false,
    navbarRight,
    children,
  }: {
    title?: string
    noNavbar?: boolean
    noDrawer?: boolean
    navbarRight?: import('svelte').Snippet
    children?: import('svelte').Snippet
  } = $props()

  let drawerOpen = $state(false)
  let securityOpen = $state(false)
  let currentPath = $derived($page.url.pathname)

  function openDrawer() { drawerOpen = true }

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) history.back()
    else goto('/')
  }
</script>

<Page>
  <Drawer opened={drawerOpen} onClose={() => drawerOpen = false} onOpenSecurity={() => securityOpen = true} />

  {#if !noNavbar}
    <Navbar innerClass="nav-custom">
      <NavLeft>
        {#if currentPath !== '/'}
          <Link onclick={goBack}>
            <Icon ios="f7:chevron_left" />
          </Link>
        {/if}
        <!-- Profile entry sits on the left; on a sub-route the back chevron takes
             the first slot and the avatar follows it. -->
        <Avatar image={profile.value.avatar} initials={profile.initials} size={30} onclick={() => goto('/profile')} />
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
    <TabBar onMore={openDrawer} />
  {/if}

  <SecuritySheet opened={securityOpen} onClose={() => securityOpen = false} />
</Page>

<style>
  :global(.nav-custom) {
    --f7-navbar-height: 52px;
    padding: 0 14px;
    background: var(--ds-chrome-bg);
    -webkit-backdrop-filter: blur(20px) saturate(1.6);
    backdrop-filter: blur(20px) saturate(1.6);
    border-bottom: 1px solid var(--ds-rule);
  }
  :global(.nav-custom .title) {
    font-family: var(--ds-font-sans);
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--ds-ink);
  }
  :global(.nav-custom .left) {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  :global(.nav-back-link) {
    margin-right: 6px;
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    color: var(--ds-accent);
  }

  :global(.page-content) {
    padding-top: calc(var(--f7-navbar-height, 52px) + env(safe-area-inset-top, 0px));
    padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  }
  :global(.page.has-tabbar .page-content) {
    padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  }

  .navbar-right-group {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  :global(.theme-btn),
  :global(.notif-btn) {
    position: relative;
    width: 42px; height: 42px;
    border: none; border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-text-secondary);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--ds-dur-fast) var(--ds-ease), color var(--ds-dur-fast) var(--ds-ease), transform var(--ds-dur-fast) var(--ds-ease);
  }
  :global(.theme-btn:active),
  :global(.notif-btn:active) {
    background: var(--ds-surface-2);
    color: var(--ds-ink);
    transform: scale(0.94);
  }
</style>

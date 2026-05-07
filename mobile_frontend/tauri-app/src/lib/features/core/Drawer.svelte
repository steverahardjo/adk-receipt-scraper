<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { drawerNavItems } from './types'
  import { theme } from './theme.svelte'

  let { opened = false, onClose }: { opened?: boolean; onClose?: () => void } = $props()

  let pathname = $derived($page.url.pathname)
  let expanded = $state<Set<string>>(new Set())

  function toggleGroup(label: string) {
    let next = new Set(expanded)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    expanded = next
  }

  function navigate(href: string) {
    onClose?.()
    goto(href)
  }

  let transitioning = $state(false)
  let visible = $state(false)

  $effect(() => {
    if (opened) {
      visible = true
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { transitioning = true })
      })
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="header">
      <svg class="header-logo" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span class="header-name">Deneb</span>
    </div>

    <div class="body">
      {#each drawerNavItems as item}
        {#if item.children}
          <div class="group">
            <button class="nav-item group-btn" onclick={() => toggleGroup(item.label)}>
              {#if item.icon === 'list'}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              {/if}
              <span class="group-label">{item.label}</span>
              <svg class="chevron" class:open={expanded.has(item.label)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {#if expanded.has(item.label)}
              <div class="sub-items">
                {#each item.children as child}
                  <button class="nav-item sub-item" class:active={pathname === child.href} onclick={() => navigate(child.href)}>
                    <span class="sub-dot"></span>
                    <span>{child.label}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <button class="nav-item" class:active={pathname === item.href} onclick={() => navigate(item.href!)}>
            {#if item.icon === 'home'}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            {:else if item.icon === 'bell'}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            {:else if item.icon === 'chat'}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            {/if}
            <span>{item.label}</span>
          </button>
        {/if}
      {/each}
    </div>

    <div class="sep"></div>
    <div class="footer">
      <button class="nav-item theme-item" onclick={() => theme.toggle()}>
        {#if theme.current === 'dark'}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        {:else}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        {/if}
        <span>{theme.current === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 13000; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.6); }
  .backdrop.show { opacity: 1; }
  .sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 13001; background: #fff; border-radius: 16px 16px 0 0; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); max-height: 85dvh; overflow-y: auto; box-shadow: 0 -4px 24px rgba(0,0,0,0.08); }
  :global(.dark) .sheet { background: #1c1c1e; box-shadow: 0 -4px 24px rgba(0,0,0,0.4); }
  .sheet.show { transform: translateY(0); }
  .handle { width: 40px; height: 5px; border-radius: 3px; background: #d1d1d6; margin: 10px auto 6px; flex-shrink: 0; }
  :global(.dark) .handle { background: #48484a; }
  .header { display: flex; align-items: center; gap: 10px; padding: 8px 20px 4px; }
  .header-logo { color: #006c50; }
  :global(.dark) .header-logo { color: #24e0ab; }
  .header-name { font-family: 'Manrope', sans-serif; font-size: 17px; font-weight: 700; color: #1a1c1e; letter-spacing: -0.02em; }
  :global(.dark) .header-name { color: #f0f0f3; }
  .body { display: flex; flex-direction: column; padding: 8px 12px; gap: 2px; }
  .nav-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px; border: none; border-radius: 10px; background: transparent; cursor: pointer; font-size: 15px; font-weight: 500; font-family: 'Manrope', sans-serif; color: #1a1c1e; -webkit-tap-highlight-color: transparent; transition: background 0.1s, color 0.1s; text-align: left; box-sizing: border-box; }
  :global(.dark) .nav-item { color: #f0f0f3; }
  .nav-item:active { background: #f2f2f7; }
  :global(.dark) .nav-item:active { background: #2c2c2e; }
  .nav-item.active { background: #2ee5af; color: #1a1c1e; }
  :global(.dark) .nav-item.active { background: #24e0ab; color: #1a1c1e; }
  .nav-item svg { flex-shrink: 0; }
  .sep { height: 1px; margin: 4px 20px; background: #e5e5ea; }
  :global(.dark) .sep { background: #38383a; }
  .footer { padding: 4px 12px 12px; }
  .theme-item { color: #8e8e93; }
  :global(.dark) .theme-item { color: #8e8e93; }

  .group-btn { padding-right: 10px; }
  .group-label { flex: 1; }
  .chevron { transition: transform 0.2s; color: #aeaeb2; }
  .chevron.open { transform: rotate(90deg); }
  .sub-items { display: flex; flex-direction: column; gap: 1px; padding-left: 36px; }
  .sub-item { font-size: 14px; padding: 10px 14px; gap: 10px; }
  .sub-dot { width: 6px; height: 6px; border-radius: 50%; background: #bacac1; flex-shrink: 0; }
  :global(.dark) .sub-dot { background: #6b7b72; }
</style>

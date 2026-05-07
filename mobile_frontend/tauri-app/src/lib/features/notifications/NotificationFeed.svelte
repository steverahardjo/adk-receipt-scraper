<script lang="ts">
  import { mockNotifications } from './notifications'

  let { limit = 0 } = $props<{ limit?: number }>()
  let items = $derived(limit > 0 ? mockNotifications.slice(0, limit) : mockNotifications)
</script>

{#each items as n}
  <div class="item" class:unread={!n.read}>
    <div class="icon-wrap" class:security={n.type === 'security'} class:payment={n.type === 'payment'} class:investment={n.type === 'investment'} class:alert={n.type === 'alert'}>
      {#if n.type === 'security'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      {:else if n.type === 'payment'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M2 12h2m16 0h2m-10-8V2m0 20v-2" />
        </svg>
      {:else if n.type === 'investment'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      {/if}
    </div>
    <div class="body">
      <div class="top">
        <p class="title">{n.title}</p>
        <span class="time">{n.time}</span>
      </div>
      <p class="desc">{n.description}</p>
    </div>
  </div>
{/each}
{#if items.length === 0}
  <p class="empty">No notifications</p>
{/if}

<style>
  .item {
    display: flex;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid #e2e2e5;
  }
  :global(.dark) .item { border-color: #404848; }
  .item:last-child { border-bottom: none; }

  .item.unread .title { font-weight: 700; }

  .icon-wrap {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px;
  }
  .icon-wrap.security { background: rgba(0, 141, 163, 0.1); color: #008da3; }
  .icon-wrap.payment { background: rgba(46, 229, 175, 0.12); color: #006c50; }
  .icon-wrap.investment { background: rgba(0, 108, 80, 0.1); color: #006c50; }
  .icon-wrap.alert { background: rgba(186, 26, 26, 0.08); color: #ba1a1a; }
  :global(.dark) .icon-wrap.security { color: #6ed4ec; background: rgba(110, 212, 236, 0.1); }
  :global(.dark) .icon-wrap.payment { color: #24e0ab; background: rgba(36, 224, 171, 0.1); }
  :global(.dark) .icon-wrap.investment { color: #24e0ab; background: rgba(36, 224, 171, 0.08); }
  :global(.dark) .icon-wrap.alert { color: #ffb4ab; background: rgba(255, 180, 171, 0.08); }

  .body { flex: 1; min-width: 0; }
  .top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .title {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px; font-weight: 600;
    color: #1a1c1e; margin: 0;
  }
  :global(.dark) .title { color: #f0f0f3; }
  .time {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px; font-weight: 500;
    color: #6b7b72; white-space: nowrap;
  }
  .desc {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px; font-weight: 400;
    color: #6b7b72; margin: 3px 0 0; line-height: 1.3;
  }
  .empty {
    text-align: center; font-size: 14px; color: #6b7b72;
    padding: 32px 0; margin: 0;
  }
</style>

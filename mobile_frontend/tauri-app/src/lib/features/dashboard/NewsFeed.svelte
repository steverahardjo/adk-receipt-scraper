<script lang="ts">
  let dismissed = $state<Set<string>>(new Set())

  const news = [
    { id: 'n1', icon: 'shopping', label: '12.12 Sale', description: 'Up to 80% off on Shopee & Tokopedia this weekend', color: '#2ee5af' },
    { id: 'n2', icon: 'trending', label: 'Market Update', description: 'IHSG up 1.2% — your stock portfolio gained Rp 1.8M this week', color: '#008da3' },
    { id: 'n3', icon: 'zap', label: 'Telkomsel Promo', description: '50% off data plans for 30 days — limited offer', color: '#006c50' },
    { id: 'n4', icon: 'megaphone', label: 'Black Friday', description: 'Early deals are live! Electronics & fashion up to 60% off', color: '#008da3' },
  ]

  let visible = $derived(news.filter((n) => !dismissed.has(n.id)))

  function dismiss(id: string) {
    dismissed = new Set([...dismissed, id])
  }
</script>

{#if visible.length > 0}
  <div class="card">
    <div class="header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006c50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span class="header-title">For You</span>
    </div>

    {#each visible as item}
      <div class="item">
        <div class="icon-wrap" style="background: {item.color}14">
          {#if item.icon === 'shopping'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
          {:else if item.icon === 'trending'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          {:else if item.icon === 'zap'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          {:else if item.icon === 'megaphone'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          {/if}
        </div>
        <div class="body">
          <p class="item-label">{item.label}</p>
          <p class="item-desc">{item.description}</p>
        </div>
        <button class="dismiss" onclick={() => dismiss(item.id)} aria-label="Dismiss">✕</button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }

  :global(.dark) .card {
    background: #2f3133;
    border-color: rgba(110, 212, 236, 0.08);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .header-title {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #1a1c1e;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :global(.dark) .header-title {
    color: #f0f0f3;
  }

  .item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-top: 1px solid #e2e2e5;
  }

  :global(.dark) .item {
    border-color: #404848;
  }

  .item:last-child {
    padding-bottom: 0;
  }

  .icon-wrap {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .body {
    flex: 1;
    min-width: 0;
  }

  .item-label {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1a1c1e;
    margin: 0;
  }

  :global(.dark) .item-label {
    color: #f0f0f3;
  }

  .item-desc {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: #6b7b72;
    margin: 2px 0 0;
    line-height: 1.3;
  }

  .dismiss {
    background: none;
    border: none;
    color: #bacac1;
    cursor: pointer;
    font-size: 16px;
    padding: 2px;
    line-height: 1;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .item:hover .dismiss {
    opacity: 1;
  }

  :global(.dark) .dismiss {
    color: #6b7b72;
  }
</style>

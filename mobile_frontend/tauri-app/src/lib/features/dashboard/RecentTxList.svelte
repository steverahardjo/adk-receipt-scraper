<script lang="ts">
  const txs = [
    { merchant: 'GoFood', category: 'Food & Drinks', amount: 52000, time: '12:30', icon: 'food' },
    { merchant: 'Pertamina', category: 'Transportation', amount: 275000, time: '10:15', icon: 'transport' },
    { merchant: 'Indomaret', category: 'Shopping', amount: 38000, time: '08:45', icon: 'shopping' },
    { merchant: 'Netflix', category: 'Entertainment', amount: 180000, time: 'Yesterday', icon: 'entertainment' },
  ]
  function iconSvg(icon: string) {
    if (icon === 'food') return `<path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />`
    if (icon === 'transport') return `<rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />`
    if (icon === 'shopping') return `<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />`
    if (icon === 'entertainment') return `<polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />`
    return `<circle cx="12" cy="12" r="10" />`
  }
  let todayTotal = $derived(txs.reduce((s, t) => s + t.amount, 0))
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Recent Spending</span>
    <span class="header-total">-Rp {todayTotal.toLocaleString('id-ID')}</span>
  </div>
  <div class="list">
    {#each txs as tx}
      <div class="row">
        <div class="icon-wrap" class:food={tx.icon === 'food'} class:transport={tx.icon === 'transport'} class:shopping={tx.icon === 'shopping'} class:entertainment={tx.icon === 'entertainment'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{@html iconSvg(tx.icon)}</svg>
        </div>
        <div class="body">
          <span class="name">{tx.merchant}</span>
          <span class="category">{tx.category}</span>
        </div>
        <div class="right">
          <span class="amount">-Rp {tx.amount.toLocaleString('id-ID')}</span>
          <span class="time">{tx.time}</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .card {
    background: var(--deneb-surface);
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .header-title { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; color: var(--f7-page-text-color); }
  .header-total { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: var(--deneb-negative); font-variant-numeric: tabular-nums; }
  .list { display: flex; flex-direction: column; gap: 0; }
  .row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid var(--deneb-divider); }
  .row:first-child { border-top: none; }
  .icon-wrap { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .icon-wrap.food { background: var(--deneb-positive-bg); color: var(--deneb-positive); }
  .icon-wrap.transport { background: var(--deneb-info-bg); color: var(--deneb-info); }
  .icon-wrap.shopping { background: var(--deneb-positive-bg); color: var(--deneb-positive); }
  .icon-wrap.entertainment { background: var(--deneb-info-bg); color: var(--deneb-info); }
  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .name { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 14px; font-weight: 500; color: var(--f7-page-text-color); }
  .category { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 400; color: var(--deneb-text-secondary); }
  .right { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; flex-shrink: 0; }
  .amount { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: var(--deneb-negative); font-variant-numeric: tabular-nums; }
  .time { font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 400; color: var(--deneb-text-muted); }
</style>

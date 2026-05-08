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
    <span class="header-total">Rp {todayTotal.toLocaleString('id-ID')}</span>
  </div>

  <div class="list">
    {#each txs as tx}
      <div class="row">
        <div class="icon-wrap" class:food={tx.icon === 'food'} class:transport={tx.icon === 'transport'} class:shopping={tx.icon === 'shopping'} class:entertainment={tx.icon === 'entertainment'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            {@html iconSvg(tx.icon)}
          </svg>
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
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }
  :global(.dark) .card { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .header-title {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #1a1c1e;
  }
  :global(.dark) .header-title { color: #f0f0f3; }
  .header-total {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #ba1a1a;
    font-variant-numeric: tabular-nums;
  }
  :global(.dark) .header-total { color: #ffb4ab; }

  .list { display: flex; flex-direction: column; gap: 0; }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-top: 1px solid #e2e2e5;
  }
  :global(.dark) .row { border-color: #404848; }
  .row:first-child { border-top: none; }

  .icon-wrap {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .icon-wrap.food { background: rgba(0, 108, 80, 0.1); color: #006c50; }
  .icon-wrap.transport { background: rgba(0, 141, 163, 0.1); color: #008da3; }
  .icon-wrap.shopping { background: rgba(46, 229, 175, 0.12); color: #006c50; }
  .icon-wrap.entertainment { background: rgba(110, 212, 236, 0.1); color: #008da3; }
  :global(.dark) .icon-wrap.food { background: rgba(36, 224, 171, 0.1); color: #24e0ab; }
  :global(.dark) .icon-wrap.transport { background: rgba(110, 212, 236, 0.1); color: #6ed4ec; }
  :global(.dark) .icon-wrap.shopping { background: rgba(36, 224, 171, 0.08); color: #24e0ab; }
  :global(.dark) .icon-wrap.entertainment { background: rgba(110, 212, 236, 0.08); color: #6ed4ec; }

  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .name {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1a1c1e;
  }
  :global(.dark) .name { color: #f0f0f3; }
  .category {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #6b7b72;
  }

  .right { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; flex-shrink: 0; }
  .amount {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #ba1a1a;
    font-variant-numeric: tabular-nums;
  }
  :global(.dark) .amount { color: #ffb4ab; }
  .time {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #aeaeb2;
  }
</style>

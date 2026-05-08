<script lang="ts">
  const today = new Date()
  const currentDay = today.getDate()

  const bills = [
    { name: 'PLN', amount: 850000, due: 12, icon: 'bill' },
    { name: 'Netflix', amount: 180000, due: 18, icon: 'entertainment' },
    { name: 'BPJS', amount: 150000, due: 22, icon: 'bill' },
    { name: 'Telkomsel', amount: 200000, due: 25, icon: 'bill' },
  ]

  let visible = $derived(bills.filter((b) => b.due >= currentDay || (b.due < currentDay && b.due >= currentDay - 5)))

  function daysUntil(due: number) {
    if (due >= currentDay) return due - currentDay
    return (due + 30) - currentDay
  }

  function dueLabel(due: number) {
    const d = daysUntil(due)
    if (d === 0) return 'Today'
    if (d === 1) return 'Tomorrow'
    return `${d} days`
  }

  function iconSvg(icon: string) {
    if (icon === 'bill') return `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />`
    if (icon === 'entertainment') return `<polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />`
    return `<circle cx="12" cy="12" r="10" />`
  }
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Upcoming Bills</span>
    <span class="header-count">{visible.length} due</span>
  </div>

  <div class="list">
    {#each visible as bill}
      <div class="row">
        <div class="icon-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            {@html iconSvg(bill.icon)}
          </svg>
        </div>
        <div class="body">
          <span class="name">{bill.name}</span>
          <span class="due">{dueLabel(bill.due)}</span>
        </div>
        <span class="amount">Rp {bill.amount.toLocaleString('id-ID')}</span>
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
    margin-bottom: 8px;
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
  .header-count {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #6b7b72;
  }

  .list { display: flex; flex-direction: column; }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    border-top: 1px solid #e2e2e5;
  }
  :global(.dark) .row { border-color: #404848; }
  .row:first-child { border-top: none; }

  .icon-wrap {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: rgba(186, 26, 26, 0.06);
    color: #ba1a1a;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  :global(.dark) .icon-wrap { background: rgba(255, 180, 171, 0.06); color: #ffb4ab; }

  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .name {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1a1c1e;
  }
  :global(.dark) .name { color: #f0f0f3; }
  .due {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #6b7b72;
  }

  .amount {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #1a1c1e;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
  :global(.dark) .amount { color: #f0f0f3; }
</style>

<script lang="ts">
  const today = new Date(), currentDay = today.getDate()
  const bills = [
    { name: 'PLN', amount: 850000, due: 12 },
    { name: 'Netflix', amount: 180000, due: 18 },
    { name: 'BPJS', amount: 150000, due: 22 },
    { name: 'Telkomsel', amount: 200000, due: 25 },
  ]
  let visible = $derived(bills.filter(b => b.due >= currentDay || (b.due < currentDay && b.due >= currentDay - 5)))
  function daysUntil(d: number) { return (d >= currentDay ? d : d + 30) - currentDay }
  function dueLabel(d: number) { const x = daysUntil(d); if (x === 0) return 'Today'; if (x === 1) return 'Tomorrow'; return `${x} days` }
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
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
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
    background: var(--deneb-surface);
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .header-title { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; color: var(--f7-page-text-color); }
  .header-count { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--deneb-text-secondary); }
  .list { display: flex; flex-direction: column; }
  .row { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-top: 1px solid var(--deneb-divider); }
  .row:first-child { border-top: none; }
  .icon-wrap { width: 34px; height: 34px; border-radius: 8px; background: var(--deneb-negative-bg); color: var(--deneb-negative); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .name { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 14px; font-weight: 500; color: var(--f7-page-text-color); }
  .due { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 400; color: var(--deneb-text-secondary); }
  .amount { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: var(--f7-page-text-color); font-variant-numeric: tabular-nums; flex-shrink: 0; }
</style>

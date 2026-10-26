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
  function dueLabel(d: number) { const x = daysUntil(d); if (x === 0) return 'Due today'; if (x === 1) return 'Tomorrow'; return `in ${x} days` }
  function fmt(n: number) { return 'Rp ' + n.toLocaleString('id-ID') }
  let soon = $derived(visible.filter(b => daysUntil(b.due) <= 3).length)
  function isSoon(d: number) { return daysUntil(d) <= 3 }
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Upcoming bills</span>
    {#if soon > 0}
      <span class="header-count">{soon} due soon</span>
    {:else}
      <span class="header-ok">All clear</span>
    {/if}
  </div>
  <div class="list">
    {#each visible as bill}
      <div class="row">
        <span class="dot" class:soon={isSoon(bill.due)} aria-hidden="true"></span>
        <div class="body">
          <span class="name">{bill.name}</span>
          <span class="due" class:soon={isSoon(bill.due)}>{dueLabel(bill.due)}</span>
        </div>
        <span class="amount">{fmt(bill.amount)}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .card {
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    box-shadow: var(--ds-shadow-sm);
    padding: 16px 18px;
  }
  .header {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 10px; min-width: 0; margin-bottom: 6px;
  }
  .header-title {
    font-family: var(--ds-font-sans);
    font-size: 13px; font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--ds-text-secondary);
    min-width: 0;
  }
  .header-count {
    font-family: var(--ds-font-mono);
    font-size: 10px; font-weight: 600;
    white-space: nowrap; flex-shrink: 0;
    color: var(--ds-warning);
    background: var(--ds-warning-bg);
    padding: 3px 9px; border-radius: var(--ds-radius-pill);
  }
  .header-ok {
    font-family: var(--ds-font-mono);
    font-size: 10px; font-weight: 600;
    white-space: nowrap; flex-shrink: 0;
    color: var(--ds-positive);
    background: var(--ds-positive-bg);
    padding: 3px 9px; border-radius: var(--ds-radius-pill);
  }
  .list { display: flex; flex-direction: column; }
  .row {
    display: flex; align-items: center; gap: 10px;
    min-width: 0; padding: 9px 0;
    border-top: 1px solid var(--ds-rule);
  }
  .row:first-child { border-top: none; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ds-divider); flex-shrink: 0; }
  .dot.soon { background: var(--ds-warning); }
  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .name {
    font-family: var(--ds-font-sans);
    font-size: 15px; font-weight: 500;
    color: var(--ds-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .due { font-family: var(--ds-font-sans); font-size: 12px; color: var(--ds-text-secondary); }
  .due.soon { color: var(--ds-warning); font-weight: 600; }
  .amount {
    font-family: var(--ds-font-mono);
    font-size: 13px; font-weight: 500;
    color: var(--ds-ink);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0; white-space: nowrap;
  }
</style>

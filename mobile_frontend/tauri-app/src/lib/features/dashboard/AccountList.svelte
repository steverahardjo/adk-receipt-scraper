<script lang="ts">
  const accounts = [
    { name: 'BCA', balance: 5200000 },
    { name: 'Mandiri', balance: 3100000 },
    { name: 'Cash', balance: 1800000 },
    { name: 'GoPay', balance: 850000 },
    { name: 'DANA', balance: 500000 },
  ]

  let total = $derived(accounts.reduce((s, a) => s + a.balance, 0))
  let max = $derived(Math.max(...accounts.map((a) => a.balance), 1))

  function fmt(n: number) { return 'Rp ' + n.toLocaleString('id-ID') }
  function fmtCompact(n: number) {
    const v = Math.abs(n)
    if (v >= 1_000_000_000) return 'Rp ' + (v / 1_000_000_000).toFixed(1).replace('.', ',') + ' M'
    if (v >= 1_000_000) return 'Rp ' + (v / 1_000_000).toFixed(1).replace('.', ',') + ' jt'
    if (v >= 10_000) return 'Rp ' + Math.round(v / 1000) + ' rb'
    return fmt(v)
  }
  function share(n: number) { return total > 0 ? Math.round((n / total) * 100) : 0 }
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Accounts</span>
    <span class="header-figure">
      <span class="header-note">net worth</span>
      <span class="header-total" aria-label={fmt(total)}>{fmtCompact(total)}</span>
    </span>
  </div>

  <div class="list">
    {#each accounts as a}
      <div class="row">
        <div class="row-top">
          <span class="name">{a.name}</span>
          <span class="amount">{fmt(a.balance)}</span>
        </div>
        <div class="row-bottom">
          <div class="track">
            <div class="fill" style="width: {(a.balance / max) * 100}%"></div>
          </div>
          <span class="pct">{share(a.balance)}%</span>
        </div>
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
    gap: 12px; min-width: 0; margin-bottom: 10px;
  }
  .header-title {
    font-family: var(--ds-font-sans);
    font-size: 13px; font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--ds-text-secondary);
  }
  .header-figure {
    display: flex; align-items: baseline; gap: 6px;
    min-width: 0; flex-shrink: 0;
  }
  .header-note {
    font-family: var(--ds-font-sans);
    font-size: 11px;
    color: var(--ds-text-muted);
  }
  .header-total {
    font-family: var(--ds-font-mono);
    font-size: 14px; font-weight: 600;
    color: var(--ds-ink);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .list { display: flex; flex-direction: column; }
  .row { min-width: 0; padding: 9px 0; border-top: 1px solid var(--ds-rule); }
  .row:first-child { border-top: none; padding-top: 0; }
  .row:last-child { padding-bottom: 0; }
  .row-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; min-width: 0; }
  .name {
    font-family: var(--ds-font-sans);
    font-size: 15px; font-weight: 500;
    color: var(--ds-ink);
    min-width: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .amount {
    font-family: var(--ds-font-mono);
    font-size: 13px; font-weight: 500;
    color: var(--ds-ink);
    font-variant-numeric: tabular-nums;
    white-space: nowrap; flex-shrink: 0;
  }
  .row-bottom { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
  .track { flex: 1; min-width: 0; height: 3px; background: var(--ds-divider); border-radius: 2px; overflow: hidden; }
  .fill { height: 100%; background: var(--ds-accent); border-radius: 2px; transition: width 0.5s var(--ds-ease); }
  .pct {
    font-family: var(--ds-font-mono);
    font-size: 10px; font-weight: 600;
    color: var(--ds-text-muted);
    font-variant-numeric: tabular-nums;
    width: 34px; text-align: right; flex-shrink: 0;
  }
</style>

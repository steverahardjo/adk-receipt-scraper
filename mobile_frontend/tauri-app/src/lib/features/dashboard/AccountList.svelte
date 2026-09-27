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
  function share(n: number) { return total > 0 ? Math.round((n / total) * 100) : 0 }
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Accounts</span>
    <span class="header-total">{fmt(total)}</span>
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
    background: var(--deneb-surface);
    border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-md);
    box-shadow: var(--deneb-shadow-sm);
    padding: 18px;
  }
  .header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
  .header-title {
    font-family: var(--deneb-mono);
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
    color: var(--deneb-text-secondary);
  }
  .header-total {
    font-family: var(--deneb-sans);
    font-size: 16px; font-weight: 700;
    color: var(--deneb-ink);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .list { display: flex; flex-direction: column; }
  .row { padding: 10px 0; border-top: 1px solid var(--deneb-rule); }
  .row:first-child { border-top: none; padding-top: 0; }
  .row:last-child { padding-bottom: 0; }
  .row-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .name {
    font-family: var(--deneb-sans);
    font-size: 15px; font-weight: 500;
    color: var(--deneb-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .amount {
    font-family: var(--deneb-mono);
    font-size: 13px; font-weight: 500;
    color: var(--deneb-ink);
    font-variant-numeric: tabular-nums;
    white-space: nowrap; flex-shrink: 0;
  }
  .row-bottom { display: flex; align-items: center; gap: 10px; margin-top: 7px; }
  .track { flex: 1; height: 4px; background: var(--deneb-divider); border-radius: 2px; overflow: hidden; }
  .fill { height: 100%; background: var(--deneb-accent); border-radius: 2px; transition: width 0.5s var(--deneb-ease); }
  .pct {
    font-family: var(--deneb-mono);
    font-size: 10px; font-weight: 600;
    color: var(--deneb-text-muted);
    font-variant-numeric: tabular-nums;
    width: 28px; text-align: right; flex-shrink: 0;
  }
</style>

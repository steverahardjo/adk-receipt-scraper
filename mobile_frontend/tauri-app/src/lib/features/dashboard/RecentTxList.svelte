<script lang="ts">
  const txs = [
    { merchant: 'GoFood', category: 'Food & Drinks', amount: 52000, time: '12:30' },
    { merchant: 'Pertamina', category: 'Transportation', amount: 275000, time: '10:15' },
    { merchant: 'Indomaret', category: 'Shopping', amount: 38000, time: '08:45' },
    { merchant: 'Netflix', category: 'Entertainment', amount: 180000, time: 'Yesterday' },
  ]
</script>

<div class="section">
  <div class="section-head">
    <span class="section-label">Recent activity</span>
  </div>
  <div class="list">
    {#each txs as tx, i}
      <div class="row">
        <div class="row-left">
          <span class="merchant">{tx.merchant}</span>
          <span class="meta">{tx.category} &middot; {tx.time}</span>
        </div>
        <span class="amount">-Rp {tx.amount.toLocaleString('id-ID')}</span>
      </div>
      {#if i < txs.length - 1}
        <div class="sep"></div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .section { padding: 20px 0 0; }
  .section-head { margin-bottom: 12px; }
  .section-label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px; font-weight: 600;
    color: var(--deneb-text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .list { display: flex; flex-direction: column; }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
  .row-left { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .merchant {
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 15px; font-weight: 500;
    color: var(--f7-page-text-color);
    letter-spacing: -0.01em;
  }
  .meta {
    font-family: 'Geist Mono', monospace;
    font-size: 11px; font-weight: 400;
    color: var(--deneb-text-muted);
    letter-spacing: 0.02em;
  }
  .amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px; font-weight: 600;
    color: var(--deneb-negative);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
  .sep { height: 1px; background: var(--deneb-divider); }
</style>

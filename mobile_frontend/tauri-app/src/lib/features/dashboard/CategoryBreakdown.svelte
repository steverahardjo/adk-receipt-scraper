<script lang="ts">
  const categories = [
    { label: 'Food & Drinks', amount: 1320000, color: 'var(--deneb-positive)' },
    { label: 'Transportation', amount: 875000, color: 'var(--deneb-info)' },
    { label: 'Shopping', amount: 620000, color: 'var(--deneb-warning)' },
    { label: 'Bills', amount: 450000, color: 'var(--deneb-negative)' },
  ]
  let maxAmount = $derived(Math.max(...categories.map(c => c.amount)))
  let total = $derived(categories.reduce((s, c) => s + c.amount, 0))
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Spending by Category</span>
    <span class="header-total">Rp {total.toLocaleString('id-ID')}</span>
  </div>
  <div class="list">
    {#each categories as cat}
      <div class="row">
        <div class="top">
          <div class="left">
            <span class="dot" style="background: {cat.color}"></span>
            <span class="label">{cat.label}</span>
          </div>
          <span class="value">Rp {cat.amount.toLocaleString('id-ID')}</span>
        </div>
        <div class="bar">
          <div class="bar-fill" style="width: {(cat.amount / maxAmount) * 100}%; background: {cat.color}"></div>
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
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .header-title { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; color: var(--f7-page-text-color); }
  .header-total { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: var(--deneb-text-secondary); font-variant-numeric: tabular-nums; }
  .list { display: flex; flex-direction: column; gap: 14px; }
  .row { display: flex; flex-direction: column; gap: 6px; }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .left { display: flex; align-items: center; gap: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .label { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 13px; font-weight: 500; color: var(--f7-page-text-color); }
  .value { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500; color: var(--deneb-text-secondary); font-variant-numeric: tabular-nums; }
  .bar { height: 4px; background: var(--deneb-divider); border-radius: 2px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
</style>

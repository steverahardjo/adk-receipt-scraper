<script lang="ts">
  const categories = [
    { label: 'Food & Drinks', amount: 1320000, color: '#006c50' },
    { label: 'Transportation', amount: 875000, color: '#008da3' },
    { label: 'Shopping', amount: 620000, color: '#2ee5af' },
    { label: 'Bills', amount: 450000, color: '#24e0ab' },
  ]

  let maxAmount = $derived(Math.max(...categories.map((c) => c.amount)))
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
        <div class="bar-track">
          <div class="bar-fill" style="width: {(cat.amount / maxAmount) * 100}%; background: {cat.color}"></div>
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
    margin-bottom: 16px;
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
    color: #6b7b72;
    font-variant-numeric: tabular-nums;
  }

  .list { display: flex; flex-direction: column; gap: 14px; }

  .row { display: flex; flex-direction: column; gap: 6px; }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .label {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #1a1c1e;
  }
  :global(.dark) .label { color: #f0f0f3; }
  .value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #6b7b72;
    font-variant-numeric: tabular-nums;
  }

  .bar-track {
    height: 6px;
    background: rgba(0, 141, 163, 0.06);
    border-radius: 3px;
    overflow: hidden;
  }
  :global(.dark) .bar-track { background: rgba(110, 212, 236, 0.06); }
  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>

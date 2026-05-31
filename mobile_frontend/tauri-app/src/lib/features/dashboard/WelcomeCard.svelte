<script lang="ts">
  let hour = $derived(new Date().getHours())
  let greeting = $derived(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')
</script>

<div class="hero">
  <span class="eyebrow">{greeting}</span>
  <h1 class="net-worth">Rp 187.500.000</h1>
  <p class="hero-label">Net Worth</p>

  <div class="summary-row">
    <div class="summary-item income">
      <span class="summary-num">+8.50M</span>
      <span class="summary-tag">Income this month</span>
    </div>
    <div class="summary-div"></div>
    <div class="summary-item expense">
      <span class="summary-num">-3.30M</span>
      <span class="summary-tag">Spent this month</span>
    </div>
  </div>
</div>

<style>
  .hero {
    display: flex; flex-direction: column; align-items: center;
    padding: 12px 0 32px 0;
  }
  .eyebrow {
    font-family: 'Geist Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: var(--deneb-text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .net-worth {
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 38px; font-weight: 700;
    letter-spacing: -0.03em; line-height: 1.1;
    color: var(--f7-page-text-color);
    margin: 6px 0 0;
    font-variant-numeric: tabular-nums;
  }
  .hero-label {
    font-family: 'Geist Mono', monospace;
    font-size: 12px; font-weight: 500;
    color: var(--deneb-text-secondary);
    letter-spacing: 0.04em;
    margin: 4px 0 0;
  }
  .summary-row {
    display: flex; align-items: center; gap: 32px;
    margin-top: 28px;
    padding: 14px 24px;
    border: 1px solid var(--deneb-border);
    border-radius: 12px;
    background: var(--deneb-surface);
  }
  .summary-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .summary-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 17px; font-weight: 600;
    font-variant-numeric: tabular-nums; letter-spacing: -0.01em;
  }
  .summary-item.income .summary-num { color: var(--deneb-positive); }
  .summary-item.expense .summary-num { color: var(--deneb-negative); }
  .summary-tag {
    font-family: 'Geist Mono', monospace;
    font-size: 10px; font-weight: 400;
    color: var(--deneb-text-muted);
    letter-spacing: 0.03em;
  }
  .summary-div {
    width: 1px; height: 32px;
    background: var(--deneb-divider);
    flex-shrink: 0;
  }
</style>

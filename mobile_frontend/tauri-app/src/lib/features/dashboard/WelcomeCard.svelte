<script lang="ts">
  let hour = $derived(new Date().getHours())
  let greeting = $derived(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')
</script>

<div class="card">
  <div class="greeting-section">
    <span class="label">Hello</span>
    <h2 class="greeting headline-xl">{greeting}</h2>
  </div>

  <div class="net-worth-card">
    <div class="nw-top">
      <p class="nw-label">Net Worth</p>
      <p class="nw-value">Rp 187.500.000</p>
    </div>
    <div class="nw-breakdown">
      <div class="nw-item">
        <span class="nw-dot" style="background: var(--deneb-positive)"></span>
        <span class="nw-item-label">Assets</span>
        <span class="nw-item-value plus">Rp 200.000.000</span>
      </div>
      <div class="nw-item">
        <span class="nw-dot" style="background: var(--deneb-negative)"></span>
        <span class="nw-item-label">Liabilities</span>
        <span class="nw-item-value minus">-Rp 12.500.000</span>
      </div>
    </div>
  </div>

  <div class="monthly-row">
    <div class="monthly-item">
      <span class="monthly-label">Income this month</span>
      <p class="monthly-value plus">+Rp 8.500.000</p>
    </div>
    <div class="monthly-item">
      <span class="monthly-label">Spent this month</span>
      <p class="monthly-value minus">-Rp 3.300.000</p>
    </div>
  </div>
</div>

<style>
  .card {
    background: var(--deneb-surface);
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .greeting-section { margin-bottom: 20px; }
  .label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: var(--deneb-text-secondary);
    letter-spacing: 0.03em;
  }
  .greeting { margin: 4px 0 0; }

  .net-worth-card {
    background: var(--deneb-canvas);
    border: 1px solid var(--deneb-divider);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .nw-top { margin-bottom: 12px; }
  .nw-label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: var(--deneb-text-secondary);
    margin: 0 0 4px;
    letter-spacing: 0.03em;
  }
  .nw-value {
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 26px; font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--f7-page-text-color);
    margin: 0;
    font-variant-numeric: tabular-nums;
  }
  .nw-breakdown { display: flex; flex-direction: column; gap: 8px; }
  .nw-item { display: flex; align-items: center; gap: 8px; }
  .nw-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .nw-item-label {
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 13px; font-weight: 500;
    color: var(--deneb-text-secondary); flex: 1;
  }
  .nw-item-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .plus { color: var(--deneb-positive); }
  .minus { color: var(--deneb-negative); }

  .monthly-row { display: flex; gap: 32px; }
  .monthly-item { flex: 1; }
  .monthly-label {
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--deneb-text-secondary);
  }
  .monthly-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px; font-weight: 600;
    margin: 4px 0 0;
    font-variant-numeric: tabular-nums;
  }
</style>

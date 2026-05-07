<script lang="ts">
  let hour = $derived(new Date().getHours())
  let greeting = $derived(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')
</script>

<div class="card">
  <div class="greeting-section">
    <span class="label">Hello</span>
    <h2 class="greeting">{greeting}</h2>
  </div>

  <div class="net-worth-card">
    <div class="nw-top">
      <div>
        <p class="nw-label">Net Worth</p>
        <p class="nw-value">Rp 187.500.000</p>
      </div>
    </div>
    <div class="nw-breakdown">
      <div class="nw-item">
        <span class="nw-dot" style="background: #2ee5af"></span>
        <span class="nw-item-label">Assets</span>
        <span class="nw-item-value plus">Rp 200.000.000</span>
      </div>
      <div class="nw-item">
        <span class="nw-dot" style="background: #ff6b6b"></span>
        <span class="nw-item-label">Liabilities</span>
        <span class="nw-item-value minus">- Rp 12.500.000</span>
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
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }

  :global(.dark) .card {
    background: #2f3133;
    border-color: rgba(110, 212, 236, 0.08);
  }

  .greeting-section {
    margin-bottom: 20px;
  }

  .label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #6b7b72;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :global(.dark) .label {
    color: #6b7b72;
  }

  .greeting {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 24px;
    font-weight: 700;
    margin: 4px 0 0;
    color: #1a1c1e;
    letter-spacing: -0.01em;
  }

  :global(.dark) .greeting {
    color: #f0f0f3;
  }

  .net-worth-card {
    background: #f0f9f8;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }

  :global(.dark) .net-worth-card {
    background: rgba(36, 224, 171, 0.06);
  }

  .nw-top {
    margin-bottom: 12px;
  }

  .nw-label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #6b7b72;
    margin: 0 0 2px;
    letter-spacing: 0.02em;
  }

  .nw-value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #1a1c1e;
    margin: 0;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }

  :global(.dark) .nw-value {
    color: #f0f0f3;
  }

  .nw-breakdown {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .nw-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nw-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .nw-item-label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #6b7b72;
    flex: 1;
  }

  .nw-item-value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .plus { color: #006c50; }
  .minus { color: #ba1a1a; }

  :global(.dark) .plus { color: #24e0ab; }
  :global(.dark) .minus { color: #ffb4ab; }

  .monthly-row {
    display: flex;
    gap: 32px;
  }

  .monthly-item {
    flex: 1;
  }

  .monthly-label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #6b7b72;
    letter-spacing: 0.02em;
  }

  .monthly-value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    margin: 4px 0 0;
    font-variant-numeric: tabular-nums;
  }
</style>

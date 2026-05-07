<div class="card">
  <div class="row">
    <div class="item">
      <span class="label">Income</span>
      <p class="value plus">+Rp 8.500.000</p>
    </div>
    <div class="divider"></div>
    <div class="item">
      <span class="label">Expenses</span>
      <p class="value minus">-Rp 3.300.000</p>
    </div>
    <div class="divider"></div>
    <div class="item">
      <span class="label">Net</span>
      <p class="value plus">+Rp 5.200.000</p>
    </div>
  </div>
  <div class="bar-track">
    <div class="bar-fill" style="width: 61%"></div>
  </div>
</div>

<style>
  .card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }

  :global(.dark) .card {
    background: #2f3133;
    border-color: rgba(110, 212, 236, 0.08);
  }

  .row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .item {
    flex: 1;
  }

  .label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #6b7b72;
    letter-spacing: 0.02em;
  }

  .value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin: 4px 0 0;
    font-variant-numeric: tabular-nums;
  }

  .plus { color: #006c50; }
  .minus { color: #ba1a1a; }

  :global(.dark) .plus { color: #24e0ab; }
  :global(.dark) .minus { color: #ffb4ab; }

  .divider {
    width: 1px;
    height: 32px;
    background: #e2e2e5;
    flex-shrink: 0;
  }

  :global(.dark) .divider {
    background: #404848;
  }

  .bar-track {
    height: 4px;
    background: rgba(46, 229, 175, 0.12);
    border-radius: 2px;
    margin-top: 16px;
    overflow: hidden;
  }

  :global(.dark) .bar-track {
    background: rgba(36, 224, 171, 0.1);
  }

  .bar-fill {
    height: 100%;
    background: #2ee5af;
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .bar-fill {
    background: #24e0ab;
  }
</style>

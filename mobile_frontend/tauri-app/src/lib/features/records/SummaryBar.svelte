<script lang="ts">
  let { income = 0, expense = 0 }: { income?: number; expense?: number } = $props()
  let net = $derived(income - expense)
  function fmt(n: number) { return 'Rp ' + Math.abs(n).toLocaleString('id-ID') }
  /** Compact id-ID money: three columns of full-precision values do not fit a
      phone card, and ellipsising money hides the number entirely. */
  function fmtCompact(n: number) {
    const v = Math.abs(n)
    if (v >= 1_000_000_000) return 'Rp ' + (v / 1_000_000_000).toFixed(1).replace('.', ',') + ' M'
    if (v >= 1_000_000) return 'Rp ' + (v / 1_000_000).toFixed(1).replace('.', ',') + ' jt'
    if (v >= 10_000) return 'Rp ' + Math.round(v / 1000) + ' rb'
    return fmt(v)
  }
</script>

<div class="card">
  <div class="row">
    <div class="item">
      <span class="label">Income</span>
      <p class="value" aria-label={fmt(income)}>{fmtCompact(income)}</p>
    </div>
    <div class="divider"></div>
    <div class="item">
      <span class="label">Expenses</span>
      <p class="value" aria-label={fmt(expense)}>{fmtCompact(expense)}</p>
    </div>
    <div class="divider"></div>
    <div class="item">
      <span class="label">Net</span>
      <p class="value" class:pos={net >= 0} class:neg={net < 0} aria-label={fmt(net)}>
        {net >= 0 ? '+' : '−'}{fmtCompact(net)}
      </p>
    </div>
  </div>
  <div class="bar"><div class="bar-fill" style="width: {Math.min(100, (expense / Math.max(1, income)) * 100)}%"></div></div>
</div>

<style>
  .card {
    background: var(--deneb-surface); border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-md); padding: 16px 18px;
  }
  .row { display: flex; align-items: center; gap: 14px; }
  .item { flex: 1; min-width: 0; }
  .label {
    font-family: var(--deneb-sans); font-size: 11px; font-weight: 500;
    color: var(--deneb-text-muted);
  }
  /* No nowrap/ellipsis here: a clipped currency value is worse than a wrapped
     one, and compact formatting keeps full-precision values in the cell. */
  .value {
    font-family: var(--deneb-mono); font-size: 15px; font-weight: 600;
    margin: 4px 0 0; color: var(--deneb-ink);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .value.pos { color: var(--deneb-positive); }
  .value.neg { color: var(--deneb-negative); }
  .divider { width: 1px; height: 28px; background: var(--deneb-rule); flex-shrink: 0; }
  .bar { height: 3px; background: var(--deneb-divider); border-radius: 2px; margin-top: 14px; overflow: hidden; }
  .bar-fill { height: 100%; background: var(--deneb-accent); border-radius: 2px; }
</style>

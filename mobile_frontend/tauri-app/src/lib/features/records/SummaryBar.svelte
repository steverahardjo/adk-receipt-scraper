<script lang="ts">
  let { income = 0, expense = 0 }: { income?: number; expense?: number } = $props()
  let net = $derived(income - expense)
  function fmt(n: number) { return 'Rp ' + Math.abs(n).toLocaleString('id-ID') }
</script>

<div class="card">
  <div class="row">
    <div class="item"><span class="label">Income</span><p class="value">{fmt(income)}</p></div>
    <div class="divider"></div>
    <div class="item"><span class="label">Expenses</span><p class="value">{fmt(expense)}</p></div>
    <div class="divider"></div>
    <div class="item">
      <span class="label">Net</span>
      <p class="value" class:pos={net >= 0} class:neg={net < 0}>{net >= 0 ? '+' : '−'}{fmt(net)}</p>
    </div>
  </div>
  <div class="bar"><div class="bar-fill" style="width: {Math.min(100, (expense / Math.max(1, income)) * 100)}%"></div></div>
</div>

<style>
  .card {
    background: var(--deneb-surface); border: 1px solid var(--deneb-border);
    border-radius: 10px; padding: 18px 20px;
  }
  .row { display: flex; align-items: center; gap: 16px; }
  .item { flex: 1; min-width: 0; }
  .label {
    font-family: var(--deneb-mono); font-size: 10px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--deneb-text-muted);
  }
  .value {
    font-family: var(--deneb-serif); font-size: 16px; font-weight: 600;
    margin: 3px 0 0; color: var(--deneb-ink);
    font-variant-numeric: tabular-nums;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .value.pos { color: var(--deneb-positive); }
  .value.neg { color: var(--deneb-negative); }
  .divider { width: 1px; height: 30px; background: var(--deneb-rule); flex-shrink: 0; }
  .bar { height: 3px; background: var(--deneb-divider); border-radius: 2px; margin-top: 14px; overflow: hidden; }
  .bar-fill { height: 100%; background: var(--deneb-ink); opacity: 0.75; border-radius: 2px; }
</style>

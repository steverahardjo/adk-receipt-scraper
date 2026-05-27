<script lang="ts">
  let { income = 0, expense = 0 }: { income?: number; expense?: number } = $props()
  let net = $derived(income - expense)
</script>

<div class="card">
  <div class="row">
    <div class="item"><span class="label">Income</span><p class="value plus">+Rp {income.toLocaleString('id-ID')}</p></div>
    <div class="divider"></div>
    <div class="item"><span class="label">Expenses</span><p class="value minus">-Rp {expense.toLocaleString('id-ID')}</p></div>
    <div class="divider"></div>
    <div class="item"><span class="label">Net</span><p class="value" class:plus={net >= 0} class:minus={net < 0}>{net >= 0 ? '+' : ''}Rp {net.toLocaleString('id-ID')}</p></div>
  </div>
  <div class="bar"><div class="bar-fill" style="width: {Math.min(100, (expense / Math.max(1, income)) * 100)}%"></div></div>
</div>

<style>
  .card {
    background: var(--deneb-surface); border: 1px solid var(--deneb-border);
    border-radius: 10px; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .row { display: flex; align-items: center; gap: 16px; }
  .item { flex: 1; }
  .label { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 500; color: var(--deneb-text-secondary); letter-spacing: 0.02em; }
  .value { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; margin: 4px 0 0; font-variant-numeric: tabular-nums; }
  .plus { color: var(--deneb-positive); } .minus { color: var(--deneb-negative); }
  .divider { width: 1px; height: 32px; background: var(--deneb-divider); flex-shrink: 0; }
  .bar { height: 4px; background: var(--deneb-divider); border-radius: 2px; margin-top: 14px; overflow: hidden; }
  .bar-fill { height: 100%; background: var(--deneb-positive); border-radius: 2px; }
</style>

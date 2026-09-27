<script lang="ts">
  import { settings } from '$lib/features/settings/settings.svelte'

  let DAILY_BUDGET = $derived(settings.value.dailyBudget || 350000)
  let transactions = $state([
    { date: new Date(), amount: 45000 }, { date: new Date(), amount: 35000 },
    { date: new Date(), amount: 25000 }, { date: new Date(Date.now() - 86400000), amount: 120000 },
    { date: new Date(Date.now() - 86400000), amount: 55000 }, { date: new Date(Date.now() - 2 * 86400000), amount: 80000 },
    { date: new Date(Date.now() - 3 * 86400000), amount: 150000 },
  ])
  let todayTotal = $derived.by(() => {
    let t = 0; const td = new Date()
    for (const tx of transactions) {
      const d = new Date(tx.date)
      if (d.getFullYear() === td.getFullYear() && d.getMonth() === td.getMonth() && d.getDate() === td.getDate()) t += tx.amount
    }
    return t
  })
  let remaining = $derived(DAILY_BUDGET - todayTotal)
  let ratio = $derived(Math.min(todayTotal / DAILY_BUDGET, 1))
  let ctx = $derived.by(() => { const r = 72, c = 2 * Math.PI * r; return { r, circumference: c, length: ratio * c } })

  let { opened = false, onClose }: { opened?: boolean; onClose?: () => void } = $props()
  let transitioning = $state(false), visible = $state(false)

  $effect(() => {
    if (opened) { visible = true; requestAnimationFrame(() => { requestAnimationFrame(() => { transitioning = true }) }) }
    else { transitioning = false; setTimeout(() => { visible = false }, 250) }
  })
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>
    <div class="body">
      <h2 class="title headline-md">Daily Budget</h2>
      <div class="ring-wrap">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={ctx.r} fill="none" stroke="var(--deneb-divider)" stroke-width="20" />
          <circle cx="100" cy="100" r={ctx.r} fill="none"
            stroke={todayTotal > DAILY_BUDGET ? 'var(--deneb-negative)' : 'var(--deneb-positive)'}
            stroke-width="20" stroke-linecap="round"
            stroke-dasharray="{ctx.length} {ctx.circumference - ctx.length}"
            transform="rotate(-90 100 100)"
            style="transition: stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)" />
          <text x="100" y="94" text-anchor="middle" font-family="Iowan Old Style, Palatino, Georgia, serif" font-size="23" font-weight="600" fill="currentColor">
            Rp {(remaining > 0 ? remaining : 0).toLocaleString('id-ID')}
          </text>
          <text x="100" y="114" text-anchor="middle" font-family="Geist Mono, monospace" font-size="11" font-weight="500" fill="var(--deneb-text-secondary)">
            {remaining >= 0 ? 'Remaining' : 'Over budget'}
          </text>
        </svg>
      </div>
      <div class="rows">
        <div class="row"><span class="row-label">Daily Budget</span><span class="row-value">Rp {DAILY_BUDGET.toLocaleString('id-ID')}</span></div>
        <div class="row"><span class="row-label">Spent Today</span><span class="row-value spent">-Rp {todayTotal.toLocaleString('id-ID')}</span></div>
        <div class="row"><span class="row-label">Remaining</span><span class="row-value" class:over={remaining < 0}>Rp {Math.abs(remaining).toLocaleString('id-ID')}</span></div>
      </div>
      <div class="bar"><div class="bar-fill" class:over={todayTotal > DAILY_BUDGET} style="width: {Math.min(ratio * 100, 100)}%"></div></div>
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 14000; background: rgba(28, 22, 10, 0.38); opacity: 0; transition: opacity var(--deneb-dur) var(--deneb-ease-standard); }
  :global(.dark) .backdrop { background: rgba(0, 0, 0, 0.6); }
  .backdrop.show { opacity: 1; }
  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 14001;
    background: var(--deneb-surface); border-radius: var(--deneb-radius-sheet) var(--deneb-radius-sheet) 0 0;
    transform: translateY(100%); transition: transform 0.35s var(--deneb-ease);
    box-shadow: var(--deneb-shadow-lg); padding: 0 24px calc(32px + env(safe-area-inset-bottom, 0px));
  }
  .sheet.show { transform: translateY(0); }
  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border-strong); margin: 10px auto 6px; }
  .body { display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .title { margin: 8px 0 0; }
  .ring-wrap { display: flex; justify-content: center; }
  .ring-wrap svg { color: var(--deneb-ink); }
  .rows { width: 100%; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--deneb-divider); padding-top: 16px; }
  .row { display: flex; justify-content: space-between; align-items: center; }
  .row-label { font-family: var(--deneb-sans); font-size: 14px; font-weight: 400; color: var(--deneb-text-secondary); }
  .row-value { font-family: var(--deneb-mono); font-size: 14px; font-weight: 600; color: var(--deneb-ink); font-variant-numeric: tabular-nums; }
  .row-value.spent { color: var(--deneb-negative); }
  .row-value.over { color: var(--deneb-negative); }
  .bar { width: 100%; height: 4px; background: var(--deneb-divider); border-radius: 2px; overflow: hidden; margin-top: 4px; }
  .bar-fill { height: 100%; background: var(--deneb-positive); border-radius: 2px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .bar-fill.over { background: var(--deneb-negative); }
</style>

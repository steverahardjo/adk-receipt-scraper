<script lang="ts">
  const DAILY_BUDGET = 150000

  let transactions = $state([
    { date: new Date(), amount: 45000 },
    { date: new Date(), amount: 35000 },
    { date: new Date(), amount: 25000 },
    { date: new Date(Date.now() - 86400000), amount: 120000 },
    { date: new Date(Date.now() - 86400000), amount: 55000 },
    { date: new Date(Date.now() - 2 * 86400000), amount: 80000 },
    { date: new Date(Date.now() - 3 * 86400000), amount: 150000 },
  ])

  let todayTotal = $derived.by(() => {
    let total = 0
    const today = new Date()
    for (const tx of transactions) {
      const d = new Date(tx.date)
      if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()) {
        total += tx.amount
      }
    }
    return total
  })

  let remaining = $derived(DAILY_BUDGET - todayTotal)
  let ratio = $derived(Math.min(todayTotal / DAILY_BUDGET, 1))

  let ctx = $derived.by(() => {
    const r = 72, c = 2 * Math.PI * r
    return { r, circumference: c, length: ratio * c }
  })

  let { opened = false, onClose }: { opened?: boolean; onClose?: () => void } = $props()

  let transitioning = $state(false)
  let visible = $state(false)

  $effect(() => {
    if (opened) {
      visible = true
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { transitioning = true })
      })
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="body">
      <h2 class="title">Daily Budget</h2>

      <div class="ring-wrap">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={ctx.r} fill="none" stroke="rgba(0,141,163,0.08)" stroke-width="20" />
          <circle
            cx="100" cy="100" r={ctx.r}
            fill="none"
            stroke={todayTotal > DAILY_BUDGET ? '#ba1a1a' : '#2ee5af'}
            stroke-width="20"
            stroke-linecap="round"
            stroke-dasharray="{ctx.length} {ctx.circumference - ctx.length}"
            transform="rotate(-90 100 100)"
            style="transition: stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)"
          />
          <text x="100" y="94" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-size="22" font-weight="700" fill="currentColor">
            Rp {(remaining > 0 ? remaining : 0).toLocaleString('id-ID')}
          </text>
          <text x="100" y="114" text-anchor="middle" font-family="Public Sans, system-ui, sans-serif" font-size="12" font-weight="500" fill="#6b7b72">
            {remaining >= 0 ? 'Remaining' : 'Over budget'}
          </text>
        </svg>
      </div>

      <div class="rows">
        <div class="row">
          <span class="row-label">Daily Budget</span>
          <span class="row-value">Rp {DAILY_BUDGET.toLocaleString('id-ID')}</span>
        </div>
        <div class="row">
          <span class="row-label">Spent Today</span>
          <span class="row-value spent">{todayTotal > 0 ? '-' : ''}Rp {todayTotal.toLocaleString('id-ID')}</span>
        </div>
        <div class="row">
          <span class="row-label">Remaining</span>
          <span class="row-value" class:over={remaining < 0}>Rp {Math.abs(remaining).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div class="bar-track">
        <div class="bar-fill" class:over={todayTotal > DAILY_BUDGET} style="width: {Math.min(ratio * 100, 100)}%"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed; inset: 0; z-index: 14000;
    background: rgba(0,0,0,0.4);
    opacity: 0; transition: opacity 0.25s ease-out;
  }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.6); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0;
    z-index: 14001;
    background: #fff;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
    padding: 0 24px 32px;
  }
  :global(.dark) .sheet { background: #1c1c1e; }
  .sheet.show { transform: translateY(0); }

  .handle {
    width: 40px; height: 5px; border-radius: 3px;
    background: #d1d1d6; margin: 10px auto 6px;
  }
  :global(.dark) .handle { background: #48484a; }

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .title {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin: 8px 0 0;
    color: #1a1c1e;
    letter-spacing: -0.01em;
  }

  :global(.dark) .title {
    color: #f0f0f3;
  }

  .ring-wrap {
    display: flex;
    justify-content: center;
  }

  .ring-wrap svg {
    color: #1a1c1e;
  }

  :global(.dark) .ring-wrap svg {
    color: #f0f0f3;
  }

  .rows {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .row-label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #6b7b72;
  }

  .row-value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1a1c1e;
    font-variant-numeric: tabular-nums;
  }

  :global(.dark) .row-value {
    color: #f0f0f3;
  }

  .row-value.spent {
    color: #ba1a1a;
  }

  :global(.dark) .row-value.spent {
    color: #ffb4ab;
  }

  .row-value.over {
    color: #ba1a1a;
  }

  :global(.dark) .row-value.over {
    color: #ffb4ab;
  }

  .bar-track {
    width: 100%;
    height: 6px;
    background: rgba(0, 141, 163, 0.08);
    border-radius: 3px;
    overflow: hidden;
  }

  :global(.dark) .bar-track {
    background: rgba(110, 212, 236, 0.08);
  }

  .bar-fill {
    height: 100%;
    background: #2ee5af;
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .bar-fill {
    background: #24e0ab;
  }

  .bar-fill.over {
    background: #ba1a1a;
  }

  :global(.dark) .bar-fill.over {
    background: #ffb4ab;
  }
</style>

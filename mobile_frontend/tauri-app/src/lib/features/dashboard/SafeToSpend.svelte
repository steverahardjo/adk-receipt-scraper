<script lang="ts">
  import { getEntries } from '$lib/features/records/store.svelte'
  import { budgets } from '$lib/features/budgets/budgets.svelte'

  const r = 44
  const c = 2 * Math.PI * r

  function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
  function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }

  function fmt(n: number) {
    return 'Rp ' + Math.round(Math.abs(n)).toLocaleString('id-ID')
  }

  /** Compact id-ID money for tight rows, so a value can never outgrow its cell. */
  function fmtCompact(n: number) {
    const v = Math.abs(n)
    if (v >= 1_000_000_000) return 'Rp ' + (v / 1_000_000_000).toFixed(1).replace('.', ',') + ' M'
    if (v >= 1_000_000) return 'Rp ' + (v / 1_000_000).toFixed(1).replace('.', ',') + ' jt'
    if (v >= 10_000) return 'Rp ' + Math.round(v / 1000) + ' rb'
    return fmt(v)
  }

  let entries = $derived(getEntries())
  let now = new Date()
  let todayStart = $derived(startOfDay(now))
  let monthStart = $derived(startOfMonth(now))

  let spentToday = $derived(
    entries
      .filter((e) => e.flow === 'expense' && e.date >= todayStart)
      .reduce((s, e) => s + e.amount, 0),
  )

  let month = $derived.by(() => {
    let income = 0, expense = 0
    for (const e of entries) {
      if (e.date < monthStart) continue
      if (e.flow === 'income') income += e.amount
      else expense += e.amount
    }
    return { income, expense, net: income - expense }
  })

  // Monthly budget (from the Budgets page) drives the daily allowance:
  // what's left this month, spread across the days remaining.
  let monthlyLimit = $derived(budgets.totalLimit || 1)
  let daysLeft = $derived.by(() => {
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    return Math.max(1, end - now.getDate() + 1)
  })
  let budget = $derived(Math.max(0, monthlyLimit - month.expense) / daysLeft)

  let left = $derived(budget - spentToday)
  let over = $derived(left < 0)
  let usedRatio = $derived(Math.min(1, budget > 0 ? spentToday / budget : 0))
  let ringDash = $derived(`${usedRatio * c} ${c}`)
  let ringColor = $derived(over ? 'var(--ds-negative)' : 'var(--ds-accent)')
</script>

<div class="hero" class:over>
  <div class="hero-head">
    <span class="hero-eyebrow">Left to spend today</span>
    <span class="status" class:over>{over ? 'Over budget' : 'On track'}</span>
  </div>

  <div class="hero-main">
    <div class="ring">
      <svg width="88" height="88" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--ds-divider)" stroke-width="9" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={ringColor}
          stroke-width="9" stroke-linecap="round"
          stroke-dasharray={ringDash}
          transform="rotate(-90 50 50)"
          class="arc"
        />
      </svg>
      <span class="ring-pct" class:over>{Math.round(usedRatio * 100)}%</span>
    </div>

    <div class="hero-text">
      <h1 class="hero-num" class:over aria-label={fmt(left)}>{fmt(Math.abs(left))}</h1>
      <p class="hero-sub">{over ? 'over your daily budget' : `of ${fmt(budget)} today`}</p>
    </div>
  </div>

  <div class="rule"></div>

  <div class="stats">
    <div class="stat">
      <span class="stat-label">Income</span>
      <span class="stat-value" aria-label={fmt(month.income)}>{fmtCompact(month.income)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Spent</span>
      <span class="stat-value" aria-label={fmt(month.expense)}>{fmtCompact(month.expense)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Net</span>
      <span class="stat-value" class:pos={month.net >= 0} class:neg={month.net < 0} aria-label={fmt(month.net)}>
        {month.net >= 0 ? '+' : '−'}{fmtCompact(month.net)}
      </span>
    </div>
  </div>
</div>

<style>
  .hero {
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-sm);
    padding: 18px 18px 16px;
  }

  .hero-head {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-bottom: 14px;
  }
  .hero-eyebrow {
    font-family: var(--ds-font-sans);
    font-size: 13px; font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--ds-text-secondary);
  }
  .status {
    font-family: var(--ds-font-mono);
    font-size: 10px; font-weight: 600;
    white-space: nowrap; flex-shrink: 0;
    color: var(--ds-positive);
    background: var(--ds-positive-bg);
    padding: 3px 9px;
    border-radius: var(--ds-radius-pill);
  }
  .status.over { color: var(--ds-negative); background: var(--ds-negative-bg); }

  .hero-main { display: flex; align-items: center; gap: 16px; }
  .ring { position: relative; width: 88px; height: 88px; flex-shrink: 0; }
  .arc { transition: stroke-dasharray 0.6s var(--ds-ease), stroke 0.3s ease; }
  .ring-pct {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--ds-font-mono);
    font-size: 15px; font-weight: 600;
    color: var(--ds-accent);
    font-variant-numeric: tabular-nums;
  }
  .ring-pct.over { color: var(--ds-negative); }

  /* min-width:0 lets this column shrink; the numeral itself stays one line
     and scales down instead of escaping the card. */
  .hero-text { flex: 1; min-width: 0; }
  .hero-num {
    font-family: var(--ds-font-sans);
    font-size: clamp(24px, 7.4vw, 34px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--ds-ink);
    margin: 0;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .hero-num.over { color: var(--ds-negative); }
  .hero-sub {
    font-size: 13px;
    color: var(--ds-text-secondary);
    margin: 4px 0 0;
  }

  .rule { height: 1px; background: var(--ds-rule); margin: 16px 0 12px; }

  /* minmax(0,1fr) + min-width:0 is the actual fix for the old overflow:
     each cell may shrink below its content's min-content width, so three
     currency values can never push past the card border. Long values wrap
     inside the cell instead. */
  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .stat { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .stat-label {
    font-family: var(--ds-font-sans);
    font-size: 11px; font-weight: 500;
    color: var(--ds-text-muted);
  }
  .stat-value {
    font-family: var(--ds-font-mono);
    font-size: 13px; font-weight: 600;
    color: var(--ds-ink);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
    line-height: 1.3;
  }
  .stat-value.pos { color: var(--ds-positive); }
  .stat-value.neg { color: var(--ds-negative); }
</style>

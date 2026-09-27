<script lang="ts">
  import { getEntries } from '$lib/features/records/store.svelte'
  import { settings } from '$lib/features/settings/settings.svelte'

  const r = 44
  const c = 2 * Math.PI * r

  function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
  function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }

  function fmt(n: number) {
    return 'Rp ' + Math.round(Math.abs(n)).toLocaleString('id-ID')
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

  let budget = $derived(settings.value.dailyBudget || 350000)
  let left = $derived(budget - spentToday)
  let over = $derived(left < 0)
  let usedRatio = $derived(Math.min(1, budget > 0 ? spentToday / budget : 0))
  let ringDash = $derived(`${usedRatio * c} ${c}`)
  let ringColor = $derived(over ? 'var(--deneb-negative)' : 'var(--deneb-accent)')
</script>

<div class="hero" class:over>
  <div class="hero-head">
    <span class="eyebrow">Today</span>
    <span class="status" class:over>{over ? 'Over budget' : 'On track'}</span>
  </div>

  <div class="hero-main">
    <div class="ring">
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--deneb-divider)" stroke-width="9" />
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
      <span class="hero-label">{over ? 'Over by' : 'Left to spend'}</span>
      <h1 class="hero-num" class:over>{fmt(Math.abs(left))}</h1>
      <p class="hero-sub">{over ? 'Over your daily budget' : `of ${fmt(budget)} today`}</p>
      <p class="hero-meta">Spent {fmt(spentToday)} so far</p>
    </div>
  </div>

  <div class="rule"></div>

  <div class="stats">
    <div class="stat">
      <span class="stat-label">Income</span>
      <span class="stat-value">{fmt(month.income)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Spent</span>
      <span class="stat-value">{fmt(month.expense)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Net</span>
      <span class="stat-value" class:pos={month.net >= 0} class:neg={month.net < 0}>
        {month.net >= 0 ? '+' : '−'}{fmt(month.net)}
      </span>
    </div>
  </div>

  <div class="networth">
    <span class="nw-label">Net worth</span>
    <span class="nw-value">Rp 187.500.000</span>
    <span class="nw-delta">+12%</span>
  </div>
</div>

<style>
  .hero {
    position: relative;
    background: linear-gradient(180deg, var(--deneb-surface-raised), var(--deneb-surface));
    border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-lg);
    box-shadow: var(--deneb-shadow-md);
    padding: 20px;
  }

  .hero-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .eyebrow {
    font-family: var(--deneb-mono);
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--deneb-text-secondary);
  }
  .status {
    font-family: var(--deneb-mono);
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--deneb-positive);
    background: var(--deneb-positive-bg);
    padding: 3px 9px;
    border-radius: var(--deneb-radius-pill);
  }
  .status.over { color: var(--deneb-negative); background: var(--deneb-negative-bg); }

  .hero-main { display: flex; align-items: center; gap: 18px; }
  .ring { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
  .arc { transition: stroke-dasharray 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease; }
  .ring-pct {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--deneb-mono);
    font-size: 16px; font-weight: 600;
    color: var(--deneb-accent);
    font-variant-numeric: tabular-nums;
  }
  .ring-pct.over { color: var(--deneb-negative); }

  .hero-text { min-width: 0; }
  .hero-label {
    font-family: var(--deneb-mono);
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--deneb-text-secondary);
  }
  .hero-num {
    font-family: var(--deneb-sans);
    font-size: clamp(30px, 9vw, 38px); font-weight: 700;
    line-height: 1.06; letter-spacing: -0.03em;
    color: var(--deneb-ink);
    margin: 3px 0 0;
    font-variant-numeric: tabular-nums;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .hero-num.over { color: var(--deneb-negative); }
  .hero-sub {
    font-size: 14px;
    color: var(--deneb-text-secondary);
    margin: 4px 0 0;
  }
  .hero-meta {
    font-family: var(--deneb-mono);
    font-size: 11px;
    color: var(--deneb-text-muted);
    margin: 3px 0 0;
  }

  .rule { height: 1px; background: var(--deneb-rule); margin: 20px 0 16px; }

  .stats { display: flex; align-items: flex-start; gap: 0; }
  .stat { flex: 1; display: flex; flex-direction: column; gap: 3px; }
  .stat + .stat { padding-left: 16px; border-left: 1px solid var(--deneb-rule); }
  .stat-label {
    font-family: var(--deneb-mono);
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--deneb-text-muted);
  }
  .stat-value {
    font-family: var(--deneb-mono);
    font-size: 14px; font-weight: 600;
    color: var(--deneb-ink);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .stat-value.pos { color: var(--deneb-positive); }
  .stat-value.neg { color: var(--deneb-negative); }

  .networth {
    display: flex; align-items: baseline; gap: 8px;
    margin-top: 16px; padding-top: 12px;
    border-top: 1px solid var(--deneb-rule);
  }
  .nw-label {
    font-family: var(--deneb-mono);
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--deneb-text-muted);
  }
  .nw-value {
    font-family: var(--deneb-sans);
    font-size: 15px; font-weight: 600;
    color: var(--deneb-ink);
    font-variant-numeric: tabular-nums;
  }
  .nw-delta {
    font-family: var(--deneb-mono);
    font-size: 11px; font-weight: 600;
    color: var(--deneb-positive);
    margin-left: auto;
  }
</style>

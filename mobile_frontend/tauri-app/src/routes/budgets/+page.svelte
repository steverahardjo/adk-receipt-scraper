<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'
  import BudgetSheet from '$lib/features/budgets/BudgetSheet.svelte'
  import { budgets, type BudgetCategory } from '$lib/features/budgets/budgets.svelte'
  import { getEntries } from '$lib/features/records/store.svelte'

  const now = new Date()
  let offset = $state(0)
  let editing = $state<BudgetCategory | null>(null)

  let view = $derived(new Date(now.getFullYear(), now.getMonth() + offset, 1))

  function sameMonth(d: Date, ref: Date) {
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
  }

  let entries = $derived(getEntries())
  let spentByCat = $derived.by(() => {
    const map: Record<string, number> = {}
    for (const e of entries) {
      if (e.flow !== 'expense' || !e.type) continue
      if (!sameMonth(e.date, view)) continue
      map[e.type] = (map[e.type] || 0) + e.amount
    }
    return map
  })

  let totalLimit = $derived(budgets.totalLimit)
  let totalSpent = $derived(budgets.categories.reduce((s, c) => s + (spentByCat[c.name] || 0), 0))
  let left = $derived(totalLimit - totalSpent)
  let isOver = $derived(left < 0)
  let pct = $derived(totalLimit > 0 ? Math.min(1, totalSpent / totalLimit) : 0)

  let daysLeft = $derived.by(() => {
    if (offset !== 0) return null
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    return Math.max(0, end - now.getDate() + 1)
  })

  function fmt(n: number) { return 'Rp ' + Math.round(Math.abs(n)).toLocaleString('id-ID') }
  function monthLabel(d: Date) { return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }
  function groupSpent(gid: string) { return budgets.byGroup(gid).reduce((s, c) => s + (spentByCat[c.name] || 0), 0) }
  function groupLimit(gid: string) { return budgets.byGroup(gid).reduce((s, c) => s + c.limit, 0) }
  function catPct(c: BudgetCategory) { return c.limit > 0 ? Math.min(1, (spentByCat[c.name] || 0) / c.limit) : 0 }
  function catOver(c: BudgetCategory) { return (spentByCat[c.name] || 0) > c.limit }
</script>

<BaseLayer title="Budgets">
  <div class="page">
    <div class="month-nav">
      <button class="nav-btn" onclick={() => offset--} aria-label="Previous month">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <span class="month-label">{monthLabel(view)}</span>
      <button class="nav-btn" onclick={() => offset++} aria-label="Next month" disabled={offset >= 0}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>

    <div class="summary" class:over={isOver}>
      <div class="summary-head">
        <span class="eyebrow">{isOver ? 'Over budget' : 'Left to budget'}</span>
        <span class="status" class:over={isOver}>{isOver ? 'Over' : 'On track'}</span>
      </div>
      <div class="summary-num">{fmt(left)}</div>
      <div class="summary-sub">of {fmt(totalLimit)}</div>

      <div class="bar big"><div class="fill" class:over={isOver} style="width: {pct * 100}%"></div></div>

      <div class="summary-meta">
        <span>Spent {fmt(totalSpent)}</span>
        {#if daysLeft !== null}<span>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>{/if}
      </div>
    </div>

    {#if budgets.categories.length === 0}
      <p class="empty">No budget categories yet.</p>
    {:else}
      {#each budgets.groups as g}
        {#if budgets.byGroup(g.id).length > 0}
          <section class="group">
            <div class="group-head">
              <span class="group-name">{g.name}</span>
              <span class="group-total">{fmt(groupSpent(g.id))} <span class="slash">/ {fmt(groupLimit(g.id))}</span></span>
            </div>
            <div class="group-bar">
              <div class="group-fill" style="width: {groupLimit(g.id) > 0 ? Math.min(1, groupSpent(g.id) / groupLimit(g.id)) * 100 : 0}%"></div>
            </div>

            <div class="rows">
              {#each budgets.byGroup(g.id) as c}
                <button class="cat" onclick={() => (editing = c)} aria-label={`Edit ${c.name} limit`}>
                  <span class="emoji">{c.emoji}</span>
                  <div class="cat-main">
                    <div class="cat-line">
                      <span class="cat-name">{c.name}</span>
                      <span class="cat-amt" class:over={catOver(c)}>{fmt(spentByCat[c.name] || 0)}</span>
                    </div>
                    <div class="bar"><div class="fill" class:over={catOver(c)} style="width: {catPct(c) * 100}%"></div></div>
                    <div class="cat-foot">
                      <span>{fmt(c.limit)} limit</span>
                      <span class:over={catOver(c)}>
                        {catOver(c) ? `${fmt((spentByCat[c.name] || 0) - c.limit)} over` : `${fmt(c.limit - (spentByCat[c.name] || 0))} left`}
                      </span>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          </section>
        {/if}
      {/each}
    {/if}
  </div>
</BaseLayer>

<BudgetSheet
  opened={!!editing}
  category={editing}
  onClose={() => (editing = null)}
  onSave={(limit) => editing && budgets.setLimit(editing.id, limit)}
/>

<style>
  .page { display: flex; flex-direction: column; gap: 20px; padding: 10px 16px 28px; }

  .month-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 2px; }
  .nav-btn {
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px;
    border: none; border-radius: 50%;
    background: transparent;
    color: var(--deneb-ink);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--deneb-dur-fast) var(--deneb-ease), opacity var(--deneb-dur-fast) var(--deneb-ease);
  }
  .nav-btn:active { background: var(--deneb-surface-2); }
  .nav-btn:disabled { opacity: 0.3; cursor: default; }
  .nav-btn:disabled:active { background: transparent; }
  .month-label { font-family: var(--deneb-sans); font-size: 16px; font-weight: 600; color: var(--deneb-ink); letter-spacing: -0.01em; }

  .summary {
    background: linear-gradient(180deg, var(--deneb-surface-raised), var(--deneb-surface));
    border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-lg);
    box-shadow: var(--deneb-shadow-md);
    padding: 20px;
  }
  .summary-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .eyebrow { font-family: var(--deneb-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--deneb-text-secondary); }
  .status {
    font-family: var(--deneb-mono); font-size: 10px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--deneb-positive); background: var(--deneb-positive-bg);
    padding: 3px 9px; border-radius: var(--deneb-radius-pill);
  }
  .status.over { color: var(--deneb-negative); background: var(--deneb-negative-bg); }

  .summary-num {
    font-family: var(--deneb-sans); font-size: clamp(30px, 9vw, 38px); font-weight: 700;
    line-height: 1.05; letter-spacing: -0.03em;
    color: var(--deneb-ink); font-variant-numeric: tabular-nums;
  }
  .summary.over .summary-num { color: var(--deneb-negative); }
  .summary-sub { font-size: 14px; color: var(--deneb-text-secondary); margin-top: 2px; }

  .bar { height: 6px; border-radius: 3px; background: var(--deneb-divider); overflow: hidden; }
  .bar.big { height: 8px; margin: 16px 0 10px; }
  .fill { height: 100%; background: var(--deneb-accent); border-radius: 3px; transition: width 0.5s var(--deneb-ease); }
  .fill.over { background: var(--deneb-negative); }

  .summary-meta {
    display: flex; justify-content: space-between;
    font-family: var(--deneb-mono); font-size: 11px; color: var(--deneb-text-muted);
  }

  .group { display: flex; flex-direction: column; gap: 10px; }
  .group-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 0 2px; }
  .group-name { font-family: var(--deneb-sans); font-size: 15px; font-weight: 600; color: var(--deneb-ink); letter-spacing: -0.01em; }
  .group-total { font-family: var(--deneb-mono); font-size: 12px; font-weight: 600; color: var(--deneb-ink); font-variant-numeric: tabular-nums; }
  .slash { color: var(--deneb-text-muted); font-weight: 400; }
  .group-bar { height: 5px; border-radius: 3px; background: var(--deneb-divider); overflow: hidden; }
  .group-fill { height: 100%; background: var(--deneb-ink); opacity: 0.55; border-radius: 3px; transition: width 0.5s var(--deneb-ease); }

  .rows { display: flex; flex-direction: column; }
  .cat {
    display: flex; align-items: center; gap: 13px;
    width: 100%; padding: 12px 0;
    border: none; background: transparent;
    border-top: 1px solid var(--deneb-rule);
    text-align: left; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: opacity var(--deneb-dur-fast) var(--deneb-ease);
  }
  .cat:active { opacity: 0.6; }
  .emoji {
    display: flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; flex-shrink: 0;
    border-radius: var(--deneb-radius-sm);
    background: var(--deneb-surface-2);
    font-size: 20px;
  }
  .cat-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .cat-line { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .cat-name { font-family: var(--deneb-sans); font-size: 15px; font-weight: 500; color: var(--deneb-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat-amt { font-family: var(--deneb-mono); font-size: 13px; font-weight: 600; color: var(--deneb-ink); font-variant-numeric: tabular-nums; flex-shrink: 0; }
  .cat-amt.over { color: var(--deneb-negative); }
  .cat-foot { display: flex; justify-content: space-between; font-family: var(--deneb-mono); font-size: 10px; color: var(--deneb-text-muted); }
  .cat-foot .over { color: var(--deneb-negative); font-weight: 600; }

  .empty { text-align: center; color: var(--deneb-text-secondary); font-size: 14px; padding: 40px 0; }
</style>

<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'
  import SummaryBar from '$lib/features/records/SummaryBar.svelte'
  import PeriodFilter from '$lib/features/records/PeriodFilter.svelte'
  import RecordList from '$lib/features/records/RecordList.svelte'
  import RecordDetail from '$lib/features/records/RecordDetail.svelte'
  import FlowOverview from '$lib/features/records/FlowOverview.svelte'
  import RangeSlider from '$lib/features/records/RangeSlider.svelte'
  import ContextPicker from '$lib/features/core/ContextPicker.svelte'
  import { longpress } from '$lib/features/core/longpress'
  import { generateEntries } from '$lib/features/records/mockdata'
  import type { Period, Entry } from '$lib/features/records/types'

  let entries = $state(generateEntries(200))
  let period = $state<Period>('1m'), search = $state('')
  let flowOpen = $state(false), selectedTx = $state<Entry | null>(null), filtersOpen = $state(false)
  let dateFrom = $state(''), dateTo = $state('')
  let amountMin = $state(0), amountMax = $state<number | null>(null)
  let maxAmount = $derived(Math.max(...entries.map(e => e.amount), 1))
  let searchQuery = $derived(search.toLowerCase())

  let searched = $derived.by(() => {
    let result = entries
    if (searchQuery) result = result.filter(e => e.title.toLowerCase().includes(searchQuery) || (e.type || '').toLowerCase().includes(searchQuery) || (e.source || '').toLowerCase().includes(searchQuery) || (e.paymentMethod || '').toLowerCase().includes(searchQuery))
    if (dateFrom) result = result.filter(e => e.date >= new Date(dateFrom))
    if (dateTo) { const to = new Date(dateTo); to.setHours(23, 59, 59, 999); result = result.filter(e => e.date <= to) }
    if (amountMin > 0) result = result.filter(e => e.amount >= amountMin)
    if (amountMax !== null && amountMax < maxAmount) result = result.filter(e => e.amount <= amountMax)
    return result
  })

  let totals = $derived.by(() => { let inc = 0, exp = 0; for (const e of searched) { if (e.flow === 'income') inc += e.amount; else exp += e.amount } return { income: inc, expense: exp } })
  let contextOpen = $state(false), contextTitle = $state(''), contextMessage = $state('')
  function openContext(t: string, m: string) { contextTitle = t; contextMessage = m; contextOpen = true }

  const typeSummary = $derived.by(() => {
    const counts: Record<string, { count: number; total: number }> = {}
    for (const e of searched) { if (e.flow === 'expense' && e.type) { if (!counts[e.type]) counts[e.type] = { count: 0, total: 0 }; counts[e.type].count++; counts[e.type].total += e.amount } }
    return Object.entries(counts).sort((a, b) => b[1].total - a[1].total).slice(0, 4).map(([type, data]) => `${type}: ${data.count} tx (Rp ${data.total.toLocaleString('id-ID')})`).join(', ')
  })
  const paymentSummary = $derived.by(() => {
    const counts: Record<string, number> = {}
    for (const e of searched) { if (e.flow === 'expense' && e.paymentMethod) counts[e.paymentMethod] = (counts[e.paymentMethod] || 0) + e.amount }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([method, total]) => `${method}: Rp ${total.toLocaleString('id-ID')}`).join(', ')
  })
  function clearAll() { search = ''; period = '1m'; dateFrom = ''; dateTo = ''; amountMin = 0; amountMax = maxAmount; filtersOpen = false }
  let hasAnyFilter = $derived(!!(search || period !== '1m' || dateFrom || dateTo || amountMin > 0 || (amountMax !== null && amountMax < maxAmount)))
</script>

{#snippet navbarRight()}
  {#if hasAnyFilter}
    <button class="nav-clear-btn" onclick={clearAll} aria-label="Clear all filters">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  {/if}
{/snippet}

<BaseLayer title="Records" {navbarRight}>
  <div class="page">
    <div class="search-row">
      <div class="search-wrap">
        <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input class="search-input" type="text" placeholder="Search by title, type, or payment" bind:value={search} />
        {#if search}<button class="search-clear" onclick={() => search = ''} aria-label="Clear search">&times;</button>{/if}
      </div>
    </div>

    <div class="toolbar-row">
      <div class="toolbar-chips">
        <PeriodFilter value={period} onChange={(v) => period = v} />
      </div>
      <div class="toolbar">
        <div class="toolbar-left">
          <p class="page-sub">{searched.length} entries</p>
        </div>
        <div class="toolbar-right">
          <button class="filter-toggle" class:open={filtersOpen} onclick={() => filtersOpen = !filtersOpen} aria-label="Toggle filters">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" /></svg>
          </button>
        </div>
      </div>
    </div>

    {#if filtersOpen}
      <div class="filter-card">
        <div class="filter-group">
          <span class="filter-group-title">Date Range</span>
          <div class="filter-row">
            <div class="filter-field"><label class="filter-label" for="filter-from">From</label><input id="filter-from" class="filter-input" type="date" bind:value={dateFrom} /></div>
            <div class="filter-field"><label class="filter-label" for="filter-to">To</label><input id="filter-to" class="filter-input" type="date" bind:value={dateTo} /></div>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-group-title">Amount Range</span>
          <RangeSlider min={0} max={maxAmount} step={10000} valueMin={amountMin} valueMax={amountMax ?? maxAmount} onMinChange={(v) => amountMin = v} onMaxChange={(v) => amountMax = v} />
        </div>
      </div>
    {/if}

    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Cash Flow Summary', `Income Rp ${totals.income.toLocaleString('id-ID')}, Expenses Rp ${totals.expense.toLocaleString('id-ID')}, Net ${(totals.income - totals.expense) >= 0 ? '+' : ''}Rp ${(totals.income - totals.expense).toLocaleString('id-ID')}. Type breakdown: ${typeSummary}. Payment methods: ${paymentSummary}.`) }}>
      <SummaryBar income={totals.income} expense={totals.expense} />
    </div>

    <button class="flow-toggle" class:open={flowOpen} onclick={() => flowOpen = !flowOpen}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      <span>Flow Overview</span>
    </button>
    {#if flowOpen}<div class="flow-card"><FlowOverview entries={searched} /></div>{/if}
    <div class="list-card"><RecordList allTransactions={searched} {period} onSelect={(t) => selectedTx = t} /></div>
  </div>
</BaseLayer>

<RecordDetail tx={selectedTx} onClose={() => selectedTx = null} />
<ContextPicker opened={contextOpen} title={contextTitle} message={contextMessage} onClose={() => contextOpen = false} />

<style>
  .page { display: flex; flex-direction: column; gap: 20px; padding: 12px 16px 24px 16px; }
  .search-row { margin: 0; }
  .search-wrap { position: relative; display: flex; align-items: center; }
  .search-icon { position: absolute; left: 14px; color: var(--deneb-text-muted); pointer-events: none; }
  .search-input {
    width: 100%; height: 44px; padding: 0 36px 0 40px;
    border: 1px solid var(--deneb-border); border-radius: 8px;
    font-family: 'Geist Sans', sans-serif; font-size: 14px;
    color: var(--f7-page-text-color); background: var(--deneb-surface); outline: none;
    transition: border-color 0.15s; box-sizing: border-box;
  }
  .search-input:focus { border-color: var(--deneb-text-secondary); }
  .search-input::placeholder { color: var(--deneb-text-muted); }
  .search-clear { position: absolute; right: 10px; background: none; border: none; color: var(--deneb-text-muted); cursor: pointer; font-size: 16px; padding: 4px; line-height: 1; }

  .toolbar-row { display: flex; flex-direction: column; gap: 12px; }
  .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .toolbar-left { display: flex; align-items: center; gap: 8px; }
  .toolbar-chips { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .toolbar-chips::-webkit-scrollbar { display: none; }
  .toolbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .page-sub { font-family: 'Geist Mono', monospace; font-size: 12px; font-weight: 500; color: var(--deneb-text-secondary); margin: 0; letter-spacing: 0.02em; }
  .filter-toggle { width: 32px; height: 32px; border: 1px solid var(--deneb-border); border-radius: 8px; background: var(--deneb-surface); color: var(--deneb-text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; -webkit-tap-highlight-color: transparent; flex-shrink: 0; }
  .filter-toggle.open { background: var(--deneb-canvas); color: var(--f7-page-text-color); }

  :global(.nav-clear-btn) {
    width: 34px; height: 34px;
    border: none; border-radius: 8px;
    background: transparent;
    color: var(--deneb-text-secondary);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s, transform 0.1s;
  }
  :global(.nav-clear-btn:active) {
    background: rgba(0,0,0,0.04);
    transform: scale(0.95);
  }
  :global(.dark .nav-clear-btn:active) {
    background: rgba(255,255,255,0.05);
  }

  .filter-card { background: var(--deneb-surface); border: 1px solid var(--deneb-border); border-radius: 10px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 16px; }
  .filter-group { display: flex; flex-direction: column; gap: 8px; }
  .filter-group-title { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.03em; color: var(--f7-page-text-color); }
  .filter-row { display: flex; gap: 12px; }
  .filter-field { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .filter-label { font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 400; color: var(--deneb-text-secondary); }
  .filter-input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid var(--deneb-border); border-radius: 8px; font-family: 'Geist Sans', sans-serif; font-size: 14px; color: var(--f7-page-text-color); background: var(--deneb-canvas); outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .filter-input:focus { border-color: var(--deneb-text-secondary); }
  .flow-toggle { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1px solid var(--deneb-border); border-radius: 10px; background: var(--deneb-surface); color: var(--f7-page-text-color); font-family: 'Geist Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; width: 100%; box-shadow: 0 1px 3px rgba(0,0,0,0.03); transition: transform 0.1s; -webkit-tap-highlight-color: transparent; }
  .flow-toggle:active { transform: scale(0.98); }
  .flow-toggle svg { transition: transform 0.2s; }
  .flow-toggle.open svg { transform: rotate(90deg); }
  .flow-card { background: var(--deneb-surface); border: 1px solid var(--deneb-border); border-radius: 10px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
  .list-card { background: var(--deneb-surface); border: 1px solid var(--deneb-border); border-radius: 10px; padding: 4px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
</style>

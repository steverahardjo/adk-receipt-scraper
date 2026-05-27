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
  let period = $state<Period>('1m')
  let search = $state('')
  let flowOpen = $state(false)
  let selectedTx = $state<Entry | null>(null)
  let filtersOpen = $state(false)

  let dateFrom = $state('')
  let dateTo = $state('')
  let amountMin = $state(0)
  let amountMax = $state<number | null>(null)

  let maxAmount = $derived(Math.max(...entries.map((e) => e.amount), 1))

  let searchQuery = $derived(search.toLowerCase())

  let searched = $derived.by(() => {
    let result = entries

    if (searchQuery) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery) ||
          (e.type || '').toLowerCase().includes(searchQuery) ||
          (e.source || '').toLowerCase().includes(searchQuery) ||
          (e.paymentMethod || '').toLowerCase().includes(searchQuery)
      )
    }

    if (dateFrom) {
      const from = new Date(dateFrom)
      result = result.filter((e) => e.date >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      result = result.filter((e) => e.date <= to)
    }
    if (amountMin > 0) {
      result = result.filter((e) => e.amount >= amountMin)
    }
    if (amountMax !== null && amountMax < maxAmount) {
      result = result.filter((e) => e.amount <= amountMax)
    }

    return result
  })

  let totals = $derived.by(() => {
    let inc = 0, exp = 0
    for (const e of searched) {
      if (e.flow === 'income') inc += e.amount
      else exp += e.amount
    }
    return { income: inc, expense: exp }
  })

  let contextOpen = $state(false)
  let contextTitle = $state('')
  let contextMessage = $state('')

  function openContext(title: string, message: string) {
    contextTitle = title
    contextMessage = message
    contextOpen = true
  }

  const typeSummary = $derived.by(() => {
    const counts: Record<string, { count: number; total: number }> = {}
    for (const e of searched) {
      if (e.flow === 'expense' && e.type) {
        if (!counts[e.type]) counts[e.type] = { count: 0, total: 0 }
        counts[e.type].count++
        counts[e.type].total += e.amount
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 4)
      .map(([type, data]) => `${type}: ${data.count} tx (Rp ${data.total.toLocaleString('id-ID')})`)
      .join(', ')
  })

  const paymentSummary = $derived.by(() => {
    const counts: Record<string, number> = {}
    for (const e of searched) {
      if (e.flow === 'expense' && e.paymentMethod) {
        counts[e.paymentMethod] = (counts[e.paymentMethod] || 0) + e.amount
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([method, total]) => `${method}: Rp ${total.toLocaleString('id-ID')}`)
      .join(', ')
  })

  function clearFilters() {
    dateFrom = ''
    dateTo = ''
    amountMin = 0
    amountMax = maxAmount
  }

  let hasCustomFilters = $derived(!!(dateFrom || dateTo || amountMin > 0 || (amountMax !== null && amountMax < maxAmount)))
</script>

<BaseLayer title="Records">
  <div class="page">
    <div class="page-top">
      <p class="page-sub">{searched.length} entries</p>
      {#if hasCustomFilters}
        <button class="clear-btn" onclick={clearFilters}>Clear</button>
      {/if}
    </div>

    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Cash Flow Summary', `Income Rp ${totals.income.toLocaleString('id-ID')}, Expenses Rp ${totals.expense.toLocaleString('id-ID')}, Net ${(totals.income - totals.expense) >= 0 ? '+' : ''}Rp ${(totals.income - totals.expense).toLocaleString('id-ID')}. Type breakdown: ${typeSummary}. Payment methods: ${paymentSummary}.`) }}>
      <SummaryBar income={totals.income} expense={totals.expense} />
    </div>

    <button class="flow-toggle" class:open={flowOpen} onclick={() => flowOpen = !flowOpen}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span>Flow Overview</span>
    </button>

    {#if flowOpen}
      <div class="flow-card">
        <FlowOverview entries={searched} />
      </div>
    {/if}

    <div class="search-row">
      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          class="search-input"
          type="text"
          placeholder="Search by title, type, or payment"
          bind:value={search}
        />
        {#if search}
          <button class="search-clear" onclick={() => search = ''}>✕</button>
        {/if}
      </div>
    </div>

    <PeriodFilter value={period} onChange={(v) => period = v} />

    <button class="filter-toggle" class:open={filtersOpen} onclick={() => filtersOpen = !filtersOpen}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
      </svg>
      <span>More Filters</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    {#if filtersOpen}
      <div class="filter-card">
        <div class="filter-group">
          <span class="filter-group-title">Date Range</span>
          <div class="filter-row">
            <div class="filter-field">
              <label class="filter-label" for="filter-from">From</label>
              <input id="filter-from" class="filter-input" type="date" bind:value={dateFrom} />
            </div>
            <div class="filter-field">
              <label class="filter-label" for="filter-to">To</label>
              <input id="filter-to" class="filter-input" type="date" bind:value={dateTo} />
            </div>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-group-title">Amount Range</span>
          <RangeSlider
            min={0}
            max={maxAmount}
            step={10000}
            valueMin={amountMin}
            valueMax={amountMax ?? maxAmount}
            onMinChange={(v) => amountMin = v}
            onMaxChange={(v) => amountMax = v}
          />
        </div>
      </div>
    {/if}

    <div class="list-card">
      <RecordList allTransactions={searched} {period} onSelect={(t) => selectedTx = t} />
    </div>
  </div>
</BaseLayer>

<RecordDetail tx={selectedTx} onClose={() => selectedTx = null} />

<ContextPicker opened={contextOpen} title={contextTitle} message={contextMessage} onClose={() => contextOpen = false} />

<style>
  .page { display: flex; flex-direction: column; gap: 16px; padding: 0 0 16px; }
  .page-top { display: flex; align-items: center; justify-content: space-between; }
  .page-sub { font-family: 'Public Sans', sans-serif; font-size: 12px; font-weight: 500; color: #6b7b72; margin: 0; letter-spacing: 0.02em; }
  .clear-btn { background: none; border: none; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; color: #008da3; cursor: pointer; padding: 0; }

  .flow-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 12px;
    background: #ffffff;
    color: #006c50;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 141, 163, 0.04);
    transition: background 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  :global(.dark) .flow-toggle { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); color: #24e0ab; }
  .flow-toggle:active { background: #f0f9f8; }
  :global(.dark) .flow-toggle:active { background: rgba(36, 224, 171, 0.06); }
  .flow-toggle svg { transition: transform 0.2s; }
  .flow-toggle.open svg { transform: rotate(90deg); }

  .flow-card { background: #ffffff; border: 1px solid rgba(0, 141, 163, 0.08); border-radius: 16px; padding: 16px; box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06); }
  :global(.dark) .flow-card { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); }

  .search-row { margin: 0; }
  .search-wrap { position: relative; display: flex; align-items: center; }
  .search-icon { position: absolute; left: 14px; color: #aeaeb2; pointer-events: none; }
  .search-input {
    width: 100%; height: 44px; padding: 0 36px 0 40px;
    border: 1.5px solid transparent; border-radius: 12px;
    font-family: 'Manrope', sans-serif; font-size: 14px;
    color: #1a1c1e; background: #f0f9f8; outline: none;
    transition: border-color 0.15s; box-sizing: border-box;
  }
  :global(.dark) .search-input { background: #2f3133; color: #f0f0f3; }
  .search-input:focus { border-color: #2ee5af; }
  :global(.dark) .search-input:focus { border-color: #24e0ab; }
  .search-input::placeholder { color: #aeaeb2; }
  .search-clear { position: absolute; right: 10px; background: none; border: none; color: #aeaeb2; cursor: pointer; font-size: 16px; padding: 4px; line-height: 1; }

  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border: none;
    background: none;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #6b7b72;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  :global(.dark) .filter-toggle { color: #6b7b72; }
  .filter-toggle svg:last-child { margin-left: auto; transition: transform 0.2s; }
  .filter-toggle.open svg:last-child { transform: rotate(90deg); }
  .filter-toggle svg:first-child { color: #006c50; }
  :global(.dark) .filter-toggle svg:first-child { color: #24e0ab; }

  .filter-card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  :global(.dark) .filter-card { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); }

  .filter-group { display: flex; flex-direction: column; gap: 8px; }
  .filter-group-title {
    font-family: 'Public Sans', sans-serif;
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.04em;
    color: #1a1c1e;
  }
  :global(.dark) .filter-group-title { color: #f0f0f3; }

  .filter-row { display: flex; gap: 12px; }
  .filter-field { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .filter-label {
    font-family: 'Public Sans', sans-serif;
    font-size: 11px; font-weight: 500;
    color: #6b7b72;
  }
  .filter-input {
    width: 100%; height: 40px; padding: 0 12px;
    border: 1.5px solid transparent; border-radius: 10px;
    font-family: 'Manrope', sans-serif; font-size: 14px;
    color: #1a1c1e; background: #f0f9f8; outline: none;
    transition: border-color 0.15s; box-sizing: border-box;
  }
  :global(.dark) .filter-input { background: #2f3133; color: #f0f0f3; }
  .filter-input:focus { border-color: #2ee5af; }
  :global(.dark) .filter-input:focus { border-color: #24e0ab; }
  .filter-input::placeholder { color: #aeaeb2; }

  .list-card { background: #ffffff; border: 1px solid rgba(0, 141, 163, 0.08); border-radius: 16px; padding: 4px 20px; box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06); }
  :global(.dark) .list-card { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); }
</style>

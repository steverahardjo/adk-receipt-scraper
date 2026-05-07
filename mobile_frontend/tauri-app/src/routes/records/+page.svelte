<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'
  import SummaryBar from '$lib/features/records/SummaryBar.svelte'
  import PeriodFilter from '$lib/features/records/PeriodFilter.svelte'
  import RecordList from '$lib/features/records/RecordList.svelte'
  import RecordDetail from '$lib/features/records/RecordDetail.svelte'
  import FlowOverview from '$lib/features/records/FlowOverview.svelte'
  import { generateTransactions } from '$lib/features/records/mockdata'
  import type { Period, Transaction } from '$lib/features/records/types'

  let transactions = $state(generateTransactions(200))
  let period = $state<Period>('1m')
  let search = $state('')
  let flowOpen = $state(false)
  let selectedTx = $state<Transaction | null>(null)

  let searchQuery = $derived(search.toLowerCase())

  let searched = $derived(
    searchQuery
      ? transactions.filter(
          (t) =>
            t.merchant.toLowerCase().includes(searchQuery) ||
            t.category.toLowerCase().includes(searchQuery)
        )
      : transactions
  )

  let totals = $derived.by(() => {
    let inc = 0, exp = 0
    for (const t of searched) {
      if (t.flow === 'income') inc += t.amount
      else exp += t.amount
    }
    return { income: inc, expense: exp }
  })
</script>

<BaseLayer title="Records" noToolbar>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Records</h1>
      <p class="page-sub">{searched.length} transactions</p>
    </div>

    <SummaryBar income={totals.income} expense={totals.expense} />

    <button class="flow-toggle" class:open={flowOpen} onclick={() => flowOpen = !flowOpen}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span>Flow Overview</span>
    </button>

    {#if flowOpen}
      <div class="flow-card">
        <FlowOverview transactions={searched} />
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
          placeholder="Search by merchant or category"
          bind:value={search}
        />
        {#if search}
          <button class="search-clear" onclick={() => search = ''}>✕</button>
        {/if}
      </div>
    </div>

    <PeriodFilter value={period} onChange={(v) => period = v} />

    <div class="list-card">
      <RecordList allTransactions={searched} {period} onSelect={(t) => selectedTx = t} />
    </div>
  </div>
</BaseLayer>

<RecordDetail tx={selectedTx} onClose={() => selectedTx = null} />

<style>
  .page { display: flex; flex-direction: column; gap: 16px; padding: 8px 0 16px; }
  .page-header { padding: 4px 0 0; }
  .page-title { font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 700; margin: 0; color: #1a1c1e; letter-spacing: -0.02em; }
  :global(.dark) .page-title { color: #f0f0f3; }
  .page-sub { font-family: 'Public Sans', sans-serif; font-size: 12px; font-weight: 500; color: #6b7b72; margin: 2px 0 0; letter-spacing: 0.02em; }

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

  .flow-card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }
  :global(.dark) .flow-card { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); }

  .search-row { margin: 0; }
  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-icon {
    position: absolute;
    left: 14px;
    color: #aeaeb2;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    height: 44px;
    padding: 0 36px 0 40px;
    border: 1.5px solid transparent;
    border-radius: 12px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    color: #1a1c1e;
    background: #f0f9f8;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  :global(.dark) .search-input { background: #2f3133; color: #f0f0f3; }
  .search-input:focus { border-color: #2ee5af; }
  :global(.dark) .search-input:focus { border-color: #24e0ab; }
  .search-input::placeholder { color: #aeaeb2; }
  .search-clear {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: #aeaeb2;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    line-height: 1;
  }

  .list-card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 4px 20px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }
  :global(.dark) .list-card { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); }
</style>

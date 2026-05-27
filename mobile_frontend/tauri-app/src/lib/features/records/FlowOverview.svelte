<script lang="ts">
  import { onMount } from 'svelte'
  import type { Entry } from './types'
  import DailyTrend from './DailyTrend.svelte'
  import CategoryDonut from './CategoryDonut.svelte'
  import MonthlyBars from './MonthlyBars.svelte'

  let { entries }: { entries: Entry[] } = $props()

  type Tab = 'daily' | 'category' | 'monthly'
  const TABS: { key: Tab; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'category', label: 'Category' },
    { key: 'monthly', label: 'Monthly' },
  ]

  let activeTab = $state<Tab>('daily')

  onMount(() => {
    const saved = localStorage.getItem('deneb-flow-tab')
    if (saved === 'daily' || saved === 'category' || saved === 'monthly') {
      activeTab = saved
    }
  })

  function setTab(key: Tab) {
    activeTab = key
    localStorage.setItem('deneb-flow-tab', key)
  }

  let dailyData = $derived.by(() => {
    const days: Record<string, { income: number; expense: number }> = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days[key] = { income: 0, expense: 0 }
    }
    for (const e of entries) {
      const key = e.date.toISOString().slice(0, 10)
      if (days[key]) {
        if (e.flow === 'income') days[key].income += e.amount
        else days[key].expense += e.amount
      }
    }
    const incomeData: { x: string; y: number }[] = []
    const expenseData: { x: string; y: number }[] = []
    const keys = Object.keys(days).sort()
    for (const k of keys) {
      const label = new Date(k).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      incomeData.push({ x: label, y: days[k].income })
      expenseData.push({ x: label, y: days[k].expense })
    }
    return [
      { id: 'Income', data: incomeData, color: 'var(--deneb-positive)' },
      { id: 'Expenses', data: expenseData, color: 'var(--deneb-negative)' },
    ]
  })

  let donutData = $derived.by(() => {
    const byCat: Record<string, number> = {}
    for (const e of entries) {
      if (e.flow === 'expense' && e.type) {
        byCat[e.type] = (byCat[e.type] || 0) + e.amount
      }
    }
    const colors = ['var(--deneb-positive)', 'var(--deneb-info)', 'var(--deneb-warning)', '#FFB800', '#CC79A7']
    return Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .map(([id, value], i) => ({ id, value, color: colors[i % colors.length] }))
  })

  let barData = $derived.by(() => {
    const months: Record<string, Record<string, number>> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      months[key] = {}
    }
    for (const e of entries) {
      if (e.flow === 'expense' && e.type) {
        const key = e.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        if (months[key]) {
          months[key][e.type] = (months[key][e.type] || 0) + e.amount
        }
      }
    }
    const types = [...new Set(entries.filter(e => e.flow === 'expense' && e.type).map(e => e.type!))]
    return Object.entries(months).map(([month, cats]) => {
      const item: Record<string, any> = { month }
      for (const t of types) item[t] = cats[t] || 0
      return item
    })
  })

  let barKeys = $derived([...new Set(entries.filter(e => e.flow === 'expense' && e.type).map(e => e.type!))])
  let barColors = $derived(
    Object.fromEntries(
      barKeys.map((k, i) => [k, ['var(--deneb-positive)', 'var(--deneb-info)', 'var(--deneb-warning)', '#FFB800', '#CC79A7'][i % 5]])
    )
  )

  let hasData = $derived(donutData.length > 0)
</script>

{#if hasData}
  <div class="charts">
    <div class="tabs" role="tablist">
      {#each TABS as t}
        <button
          class="tab"
          class:active={activeTab === t.key}
          role="tab"
          aria-selected={activeTab === t.key}
          onclick={() => setTab(t.key)}
        >
          {t.label}
        </button>
      {/each}
    </div>

    {#if activeTab === 'daily'}
      <DailyTrend {dailyData} />
    {:else if activeTab === 'category'}
      <CategoryDonut data={donutData} />
    {:else if activeTab === 'monthly'}
      <MonthlyBars data={barData} keys={barKeys} colors={barColors} />
    {/if}
  </div>
{:else}
  <div class="empty">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
    <p>No transaction data to show yet</p>
  </div>
{/if}

<style>
  .charts { display: flex; flex-direction: column; gap: 16px; }

  .tabs {
    display: flex;
    gap: 0;
    padding: 3px;
    border: 1px solid var(--deneb-border);
    border-radius: 8px;
    background: var(--deneb-canvas);
    width: fit-content;
  }

  .tab {
    padding: 6px 14px;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--deneb-text-secondary);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .tab.active {
    background: #111111;
    color: #FFFFFF;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  }
  :global(.dark) .tab.active {
    background: #ECECEC;
    color: #18181A;
  }

  .tab:not(.active):active {
    background: var(--deneb-divider);
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 32px 16px;
    color: var(--deneb-text-muted);
    text-align: center;
  }
  .empty p {
    margin: 0;
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 13px;
    color: var(--deneb-text-secondary);
  }
</style>

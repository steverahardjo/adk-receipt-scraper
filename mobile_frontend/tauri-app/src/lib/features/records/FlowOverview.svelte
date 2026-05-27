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
      { id: 'Income', data: incomeData, color: '#2ee5af' },
      { id: 'Expenses', data: expenseData, color: '#ff6b6b' },
    ]
  })

  let donutData = $derived.by(() => {
    const byCat: Record<string, number> = {}
    for (const e of entries) {
      if (e.flow === 'expense' && e.type) {
        byCat[e.type] = (byCat[e.type] || 0) + e.amount
      }
    }
    const colors = ['#2ee5af', '#008da3', '#006c50', '#c4904a', '#5baa8a']
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
      barKeys.map((k, i) => [k, ['#2ee5af', '#008da3', '#006c50', '#c4904a', '#5baa8a'][i % 5]])
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
{/if}

<style>
  .charts { display: flex; flex-direction: column; gap: 16px; }

  .tabs {
    display: flex;
    gap: 0;
    padding: 4px;
    border-radius: 10px;
    background: rgba(0, 141, 163, 0.04);
    width: fit-content;
  }
  :global(.dark) .tabs { background: rgba(110, 212, 236, 0.04); }

  .tab {
    padding: 6px 14px;
    border: none;
    border-radius: 8px;
    background: transparent;
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #6b7b72;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .tab.active {
    background: #ffffff;
    color: #006c50;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
  :global(.dark) .tab.active {
    background: #3a3d3f;
    color: #24e0ab;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  .tab:not(.active):active {
    background: rgba(0, 141, 163, 0.06);
  }
</style>

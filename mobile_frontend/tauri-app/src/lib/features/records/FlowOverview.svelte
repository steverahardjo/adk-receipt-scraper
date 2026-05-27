<script lang="ts">
  import type { Entry } from './types'
  import DailyTrend from './DailyTrend.svelte'
  import CategoryDonut from './CategoryDonut.svelte'
  import MonthlyBars from './MonthlyBars.svelte'

  let { entries }: { entries: Entry[] } = $props()

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
    <div class="chart-section">
      <span class="chart-title">Daily Trend</span>
      <DailyTrend {dailyData} />
    </div>

    <div class="chart-section">
      <span class="chart-title">Spending by Category</span>
      <CategoryDonut data={donutData} />
    </div>

    <div class="chart-section">
      <span class="chart-title">Monthly Spending</span>
      <MonthlyBars data={barData} keys={barKeys} colors={barColors} />
    </div>
  </div>
{/if}

<style>
  .charts { display: flex; flex-direction: column; gap: 24px; }
  .chart-section { display: flex; flex-direction: column; gap: 8px; }
  .chart-title { font-family: 'Public Sans', sans-serif; font-size: 11px; font-weight: 600; color: #1a1c1e; text-transform: uppercase; letter-spacing: 0.04em; }
  :global(.dark) .chart-title { color: #f0f0f3; }
</style>

<script lang="ts">
  import { onMount } from 'svelte'
  import type { Entry } from './types'

  let { entries }: { entries: Entry[] } = $props()

  let LineChart: any = $state(null)
  let PieChart: any = $state(null)
  let BarChart: any = $state(null)

  onMount(async () => {
    const nivoLine = await import('@nivo/line')
    const nivoPie = await import('@nivo/pie')
    const nivoBar = await import('@nivo/bar')
    LineChart = nivoLine.ResponsiveLine
    PieChart = nivoPie.ResponsivePie
    BarChart = nivoBar.ResponsiveBar
  })

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
    const colors = ['#2ee5af', '#008da3', '#006c50', '#c4904a', '#5baa8a']
    return Object.entries(months).map(([month, cats]) => {
      const item: Record<string, any> = { month }
      for (const t of types) {
        item[t] = cats[t] || 0
      }
      return item
    })
  })

  let barKeys = $derived([...new Set(entries.filter(e => e.flow === 'expense' && e.type).map(e => e.type!))])
  let barColors = $derived(
    Object.fromEntries(
      barKeys.map((k, i) => [k, ['#2ee5af', '#008da3', '#006c50', '#c4904a', '#5baa8a'][i % 5]])
    )
  )

  let loaded = $derived(!!(LineChart && PieChart && BarChart))
  let hasData = $derived(donutData.length > 0)
</script>

{#if loaded && hasData}
  <div class="charts">
    <div class="chart-section">
      <span class="chart-title">Daily Trend</span>
      <div class="chart-box" style="height:180px">
        <LineChart
          data={dailyData}
          margin={{ top: 20, right: 16, bottom: 28, left: 44 }}
          curve="catmullRom"
          enableArea
          areaOpacity={0.12}
          enablePoints={false}
          enableGridX={false}
          gridYValues={4}
          lineWidth={2.5}
          colors={['#2ee5af', '#ff6b6b']}
          axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -35, tickValues: 5 }}
          axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 3, format: (v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}` }}
          enableSlices="x"
          useMesh
          theme={{ axis: { ticks: { text: { fontSize: 10, fontFamily: 'Public Sans, sans-serif', fill: '#6b7b72' } } }, grid: { line: { stroke: '#e2e2e5', strokeWidth: 1, strokeDasharray: '4 4' } }, crosshair: { line: { stroke: '#2ee5af', strokeWidth: 1, strokeDasharray: '2 2' } } }}
          animate
        />
      </div>
    </div>

    <div class="chart-section">
      <span class="chart-title">Spending by Category</span>
      <div class="chart-box" style="height:220px">
        <PieChart
          data={donutData}
          margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
          innerRadius={0.6}
          padAngle={2}
          cornerRadius={6}
          activeOuterRadiusOffset={6}
          colors={{ datum: 'data.color' }}
          arcLinkLabelsSkipAngle={12}
          arcLinkLabelsTextColor="#6b7b72"
          arcLinkLabelsThickness={1}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={12}
          arcLabelsTextColor="#1a1c1e"
          arcLabelsRadiusOffset={0.55}
          theme={{ labels: { text: { fontSize: 11, fontFamily: 'Manrope, sans-serif', fontWeight: 600 } } }}
          animate
        />
      </div>
    </div>

    <div class="chart-section">
      <span class="chart-title">Monthly Spending</span>
      <div class="chart-box" style="height:220px">
        <BarChart
          data={barData}
          keys={barKeys}
          indexBy="month"
          margin={{ top: 16, right: 16, bottom: 32, left: 44 }}
          padding={0.3}
          innerPadding={2}
          groupMode="stacked"
          borderRadius={4}
          enableTotals
          colors={({ id }: { id: string }) => barColors[id] || '#6b7b72'}
          axisBottom={{ tickSize: 0, tickPadding: 8 }}
          axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 3, format: (v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}` }}
          enableGridY
          gridYValues={4}
          labelSkipWidth={20}
          labelTextColor="#ffffff"
          legends={[]}
          theme={{ axis: { ticks: { text: { fontSize: 10, fontFamily: 'Public Sans, sans-serif', fill: '#6b7b72' } } }, grid: { line: { stroke: '#e2e2e5', strokeWidth: 1, strokeDasharray: '4 4' } } }}
          animate
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .charts { display: flex; flex-direction: column; gap: 24px; }
  .chart-section { display: flex; flex-direction: column; gap: 8px; }
  .chart-title { font-family: 'Public Sans', sans-serif; font-size: 11px; font-weight: 600; color: #1a1c1e; text-transform: uppercase; letter-spacing: 0.04em; }
  :global(.dark) .chart-title { color: #f0f0f3; }
  .chart-box { width: 100%; }
</style>

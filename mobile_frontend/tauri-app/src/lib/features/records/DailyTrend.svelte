<script lang="ts">
  import { onMount } from 'svelte'

  let { dailyData }: { dailyData: { id: string; data: { x: string; y: number }[]; color: string }[] } = $props()

  type FlowMode = 'all' | 'income' | 'expenses'
  let flowMode = $state<FlowMode>('all')

  let visibleSeries = $derived.by(() => {
    if (flowMode === 'all') return dailyData
    const target = flowMode === 'income' ? 'Income' : 'Expenses'
    return dailyData.filter(s => s.id === target)
  })

  let width = $state(400)
  let container = $state<HTMLDivElement | null>(null)

  onMount(() => {
    if (container) {
      const ro = new ResizeObserver((entries) => { width = entries[0].contentRect.width })
      ro.observe(container)
      return () => ro.disconnect()
    }
  })

  const margin = { top: 12, right: 8, bottom: 32, left: 40 }
  let h = 180
  let innerW = $derived(width - margin.left - margin.right)
  let innerH = $derived(h - margin.top - margin.bottom)

  let allPoints = $derived(visibleSeries.flatMap(s => s.data.map(p => p.y)))
  let yMax = $derived(Math.max(...allPoints, 1))

  function xScale(i: number, len: number) { return margin.left + (i / Math.max(len - 1, 1)) * innerW }
  function yScale(v: number) { return margin.top + innerH - (v / yMax) * innerH }

  function linePath(points: { x: string; y: number }[]) {
    if (points.length === 0) return ''
    let d = `M ${xScale(0, points.length)} ${yScale(points[0].y)}`
    for (let i = 1; i < points.length; i++) {
      const x = xScale(i, points.length)
      const prevX = xScale(i - 1, points.length)
      const prevY = yScale(points[i - 1].y)
      const cy = yScale(points[i].y)
      const cp1x = prevX + (x - prevX) * 0.4
      const cp2x = x - (x - prevX) * 0.4
      d += ` C ${cp1x} ${prevY}, ${cp2x} ${cy}, ${x} ${cy}`
    }
    return d
  }

  function areaPath(points: { x: string; y: number }[]) {
    return linePath(points) + ` L ${xScale(points.length - 1, points.length)} ${yScale(0)} L ${xScale(0, points.length)} ${yScale(0)} Z`
  }

  let gridLines = $derived.by(() => {
    const count = 4
    const lines: number[] = []
    for (let i = 0; i <= count; i++) lines.push(yMax * (i / count))
    return lines
  })

  let xTicks = $derived.by(() => {
    const data = visibleSeries[0]?.data ?? dailyData[0]?.data ?? []
    if (data.length <= 6) return data.map((d, i) => ({ label: d.x, x: xScale(i, data.length) }))
    const step = Math.floor(data.length / 5)
    return data.filter((_, i) => i % step === 0).map((d, i) => ({ label: d.x, x: xScale(i * step, data.length) }))
  })

  let yTicks = $derived.by(() => {
    const count = 3
    const ticks: { label: string; y: number }[] = []
    for (let i = 0; i <= count; i++) {
      const v = yMax * (i / count)
      ticks.push({
        label: v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
        y: yScale(v),
      })
    }
    return ticks
  })
</script>

<div class="chart-wrap">
  <div class="chart-toggle">
    <button class="toggle-btn" class:active={flowMode === 'all'} onclick={() => flowMode = 'all'}>All</button>
    <button class="toggle-btn" class:active={flowMode === 'income'} onclick={() => flowMode = 'income'}>Income</button>
    <button class="toggle-btn" class:active={flowMode === 'expenses'} onclick={() => flowMode = 'expenses'}>Expenses</button>
  </div>

  <div bind:this={container}>
    <svg viewBox="0 0 {width} {h}" width={width} height={h}>
      {#each gridLines as v}
        <line x1={margin.left} y1={yScale(v)} x2={margin.left + innerW} y2={yScale(v)} stroke="var(--deneb-divider)" stroke-width="1" stroke-dasharray="4 4" />
      {/each}

      {#each yTicks as t}
        <text x={margin.left - 6} y={t.y} text-anchor="end" dominant-baseline="middle" font-family="Geist Mono, monospace" font-size="10" fill="var(--deneb-text-muted)">{t.label}</text>
      {/each}

      {#each xTicks as t}
        <text x={t.x} y={h - 4} text-anchor="middle" font-family="Geist Mono, monospace" font-size="9" fill="var(--deneb-text-muted)">{t.label}</text>
      {/each}

      {#each visibleSeries as series}
        <path d={areaPath(series.data)} fill={series.color} opacity="0.12" />
        <path d={linePath(series.data)} fill="none" stroke={series.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      {/each}
    </svg>
  </div>
</div>

<style>
  .chart-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .chart-wrap :global(svg) {
    display: block;
    overflow: visible;
  }

  .chart-toggle {
    display: flex;
    gap: 0;
    padding: 2px;
    border: 1px solid var(--deneb-border);
    border-radius: 6px;
    background: var(--deneb-canvas);
    width: fit-content;
    margin-left: 40px;
  }

  .toggle-btn {
    padding: 4px 12px;
    border: none;
    border-radius: 4px;
    background: transparent;
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: var(--deneb-text-secondary);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .toggle-btn.active {
    background: #111111;
    color: #FFFFFF;
  }
  :global(.dark) .toggle-btn.active {
    background: #ECECEC;
    color: #18181A;
  }
</style>

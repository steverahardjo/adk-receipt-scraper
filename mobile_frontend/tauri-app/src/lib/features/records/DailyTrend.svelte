<script lang="ts">
  import { onMount } from 'svelte'

  let { dailyData }: { dailyData: { id: string; data: { x: string; y: number }[]; color: string }[] } = $props()

  let width = $state(400)
  let container = $state<HTMLDivElement | null>(null)

  onMount(() => {
    if (container) {
      const ro = new ResizeObserver((entries) => {
        width = entries[0].contentRect.width
      })
      ro.observe(container)
      return () => ro.disconnect()
    }
  })

  const margin = { top: 12, right: 8, bottom: 32, left: 40 }
  let h = 180

  let innerW = $derived(width - margin.left - margin.right)
  let innerH = $derived(h - margin.top - margin.bottom)

  let allPoints = $derived(dailyData.flatMap(s => s.data.map(p => p.y)))
  let yMax = $derived(Math.max(...allPoints, 1))
  let yMin = $derived(0)

  function xScale(i: number, len: number) {
    return margin.left + (i / Math.max(len - 1, 1)) * innerW
  }

  function yScale(v: number) {
    return margin.top + innerH - (v / yMax) * innerH
  }

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
    for (let i = 0; i <= count; i++) {
      lines.push(yMin + (yMax / count) * i)
    }
    return lines
  })

  let xTicks = $derived.by(() => {
    const data = dailyData[0]?.data ?? []
    if (data.length <= 6) return data.map((d, i) => ({ label: d.x, x: xScale(i, data.length) }))
    const step = Math.floor(data.length / 5)
    return data.filter((_, i) => i % step === 0).map((d, i) => ({
      label: d.x,
      x: xScale(i * step, data.length),
    }))
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

<div bind:this={container} class="chart-wrap">
  <svg viewBox="0 0 {width} {h}" width={width} height={h}>
    {#each gridLines as v}
      <line x1={margin.left} y1={yScale(v)} x2={margin.left + innerW} y2={yScale(v)} stroke="#e2e2e5" stroke-width="1" stroke-dasharray="4 4" />
    {/each}

    {#each yTicks as t}
      <text x={margin.left - 6} y={t.y} text-anchor="end" dominant-baseline="middle" font-family="Public Sans, sans-serif" font-size="10" fill="#6b7b72">{t.label}</text>
    {/each}

    {#each xTicks as t}
      <text x={t.x} y={h - 4} text-anchor="middle" font-family="Public Sans, sans-serif" font-size="9" fill="#6b7b72">{t.label}</text>
    {/each}

    {#each dailyData as series}
      <path d={areaPath(series.data)} fill={series.color} opacity="0.1" />
      <path d={linePath(series.data)} fill="none" stroke={series.color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    {/each}
  </svg>
</div>

<style>
  .chart-wrap {
    width: 100%;
  }
  .chart-wrap :global(svg) {
    display: block;
    overflow: visible;
  }
</style>

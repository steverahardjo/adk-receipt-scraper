<script lang="ts">
  let {
    data,
    keys,
    colors,
  }: {
    data: Record<string, any>[]
    keys: string[]
    colors: Record<string, string>
  } = $props()

  const margin = { top: 16, right: 16, bottom: 36, left: 40 }
  const w = 400, h = 220
  let innerW = $derived(w - margin.left - margin.right)
  let innerH = $derived(h - margin.top - margin.bottom)

  let allTotals = $derived(data.map(d => keys.reduce((s, k) => s + (Number(d[k]) || 0), 0)))
  let yMax = $derived(Math.max(...allTotals, 1))

  let barW = $derived(innerW / data.length * 0.55)
  let barGap = $derived(innerW / data.length)

  function yScale(v: number) {
    return margin.top + innerH - (v / yMax) * innerH
  }

  let gridLines = $derived.by(() => {
    const count = 3
    const lines: number[] = []
    for (let i = 0; i <= count; i++) {
      lines.push(yMax * (i / count))
    }
    return lines
  })

  function barStack(month: Record<string, any>) {
    let acc = 0
    return keys
      .filter(k => (Number(month[k]) || 0) > 0)
      .map(k => {
        const val = Number(month[k]) || 0
        const y = yScale(acc + val)
        const height = Math.max(2, yScale(acc) - y)
        acc += val
        return { key: k, val, y, height }
      })
  }
</script>

<div class="bars-wrap">
  <svg viewBox="0 0 {w} {h}" width={w} height={h} preserveAspectRatio="xMidYMid meet">
    {#each gridLines as v}
      <line x1={margin.left} y1={yScale(v)} x2={w - margin.right} y2={yScale(v)} stroke="var(--f7-border-color, #e2e2e5)" stroke-width="1" stroke-dasharray="4 4" />
      <text x={margin.left - 6} y={yScale(v)} text-anchor="end" dominant-baseline="middle"
            font-family="Public Sans, sans-serif" font-size="10" fill="#6b7b72">
        {v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
      </text>
    {/each}

    {#each data as month, mi}
      {@const x = margin.left + mi * barGap + (barGap - barW) / 2}
      {#each barStack(month) as seg (seg.key)}
        <rect x={x} y={seg.y} width={barW} height={seg.height}
              fill={colors[seg.key] || '#6b7b72'} rx="2.5" />
      {/each}
      <text x={x + barW / 2} y={h - 8} text-anchor="middle"
            font-family="Public Sans, sans-serif" font-size="9" fill="#6b7b72">
        {month.month ?? mi}
      </text>
    {/each}
  </svg>
</div>

<style>
  .bars-wrap {
    width: 100%;
  }
  .bars-wrap :global(svg) {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
</style>

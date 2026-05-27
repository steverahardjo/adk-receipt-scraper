<script lang="ts">
  let { data }: { data: { id: string; value: number; color: string }[] } = $props()

  const cx = 130, cy = 130, r = 78
  const circumference = 2 * Math.PI * r

  let total = $derived(data.reduce((s, d) => s + d.value, 0))

  let segments = $derived.by(() => {
    let offset = 0
    return data.map((d) => {
      const ratio = d.value / total
      const length = ratio * circumference
      const labelAngle = ((offset + length / 2) / circumference) * 360
      const labelR = r + 24
      const labelRad = ((labelAngle - 90) * Math.PI) / 180
      const seg = { ...d, ratio, length, offset, labelX: cx + labelR * Math.cos(labelRad), labelY: cy + labelR * Math.sin(labelRad) }
      offset += length
      return seg
    })
  })
</script>

<div class="donut-wrap">
  <svg viewBox="0 0 260 260" width="260" height="260">
    {#each segments as seg}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={seg.color}
        stroke-width="24"
        stroke-dasharray="{seg.length} {circumference - seg.length}"
        stroke-dashoffset={-seg.offset}
        transform="rotate(-90 {cx} {cy})"
      />
      {#if seg.ratio > 0.06}
        <line x1={cx + r * 0.85 * Math.cos(((seg.offset + seg.length / 2) / circumference * 360 - 90) * Math.PI / 180)}
              y1={cy + r * 0.85 * Math.sin(((seg.offset + seg.length / 2) / circumference * 360 - 90) * Math.PI / 180)}
              x2={seg.labelX} y2={seg.labelY}
              stroke={seg.color} stroke-width="1" opacity="0.5" />
        <text x={seg.labelX} y={seg.labelY} dominant-baseline="middle"
              text-anchor={seg.labelX > cx ? 'start' : 'end'}
              font-family="Public Sans, sans-serif" font-size="10" font-weight="500"
              fill="currentColor" opacity="0.7">
          {seg.id}
        </text>
      {/if}
    {/each}
    <text x={cx} y={cy - 4} text-anchor="middle" dominant-baseline="middle"
          font-family="Manrope, sans-serif" font-size="18" font-weight="700" fill="currentColor">
      {data.length}
    </text>
    <text x={cx} y={cy + 14} text-anchor="middle" dominant-baseline="middle"
          font-family="Public Sans, sans-serif" font-size="11" font-weight="500"
          fill="currentColor" opacity="0.6">
      Categories
    </text>
  </svg>
</div>

<style>
  .donut-wrap {
    display: flex;
    justify-content: center;
  }
  .donut-wrap :global(svg) {
    display: block;
    overflow: visible;
    color: #1a1c1e;
  }
  :global(.dark) .donut-wrap :global(svg) {
    color: #f0f0f3;
  }
</style>

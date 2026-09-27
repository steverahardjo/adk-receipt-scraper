<script lang="ts">
  import type { ChatChartSpec } from './chat'

  type PlotlyModule = {
    newPlot: (el: HTMLElement, data: unknown[], layout?: unknown, config?: unknown) => Promise<unknown>
    purge: (el: HTMLElement) => void
  }

  let { spec }: { spec: ChatChartSpec } = $props()

  let container = $state<HTMLDivElement | null>(null)
  let failed = $state(false)

  $effect(() => {
    const el = container
    if (!el) return
    let disposed = false
    let plotly: PlotlyModule | null = null

    ;(async () => {
      try {
        const mod = await import('plotly.js-dist-min')
        plotly = ((mod as unknown as { default?: unknown }).default ?? mod) as PlotlyModule
        if (disposed) return
        await plotly.newPlot(
          el,
          spec.data,
          { ...spec.layout, autosize: true },
          { responsive: true, displayModeBar: false },
        )
      } catch {
        if (!disposed) failed = true
      }
    })()

    return () => {
      disposed = true
      try {
        if (plotly) plotly.purge(el)
      } catch {
        /* already gone */
      }
    }
  })
</script>

{#if failed}
  <p class="chart-fallback">Chart unavailable</p>
{:else}
  <div class="chart" bind:this={container}></div>
{/if}

<style>
  .chart { width: 100%; height: 220px; }
  .chart-fallback {
    margin: 0;
    font-family: var(--deneb-sans);
    font-size: 12px;
    color: var(--deneb-text-secondary);
  }
</style>

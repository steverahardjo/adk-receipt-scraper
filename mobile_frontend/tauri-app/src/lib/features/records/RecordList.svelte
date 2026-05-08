<script lang="ts">
  import type { Entry, Period } from './types'
  import { groupByDate } from './types'
  import RecordRow from './RecordRow.svelte'

  let { allTransactions, period, onSelect }: { allTransactions: Entry[]; period: Period; onSelect?: (e: Entry) => void } = $props()

  const PAGE_SIZE = 20
  let loaded = $state(PAGE_SIZE)
  let sentinel = $state<HTMLDivElement | null>(null)

  let filtered = $derived.by(() => {
    const now = new Date()
    const cutoffs: Record<Period, number> = {
      '1w': 7,
      '1m': 30,
      '3m': 90,
      '1y': 365,
      'all': 9999,
    }
    const cutoff = cutoffs[period]
    return allTransactions.filter((e) => {
      const diff = (now.getTime() - e.date.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= cutoff
    })
  })

  let visible = $derived(filtered.slice(0, loaded))
  let grouped = $derived(groupByDate(visible))
  let hasMore = $derived(loaded < filtered.length)

  $effect(() => {
    if (!sentinel) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loaded = Math.min(loaded + PAGE_SIZE, filtered.length)
        }
      },
      { rootMargin: '200px' }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  })
</script>

{#if visible.length === 0}
  <div class="empty">
    <p>No records found</p>
  </div>
{:else}
  <div class="list">
    {#each grouped as section}
      <div class="section">
        <span class="section-label">{section.label}</span>
        {#each section.items as e (e.id)}
          <RecordRow tx={e} onSelect={(t) => onSelect?.(t)} />
        {/each}
      </div>
    {/each}
    {#if hasMore}
      <div bind:this={sentinel} class="sentinel">
        <div class="spinner"></div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .section { padding: 0; }

  .section-label {
    display: block;
    font-family: 'Public Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #6b7b72;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 16px 0 4px;
  }

  .empty {
    text-align: center;
    padding: 48px 0;
    color: #6b7b72;
    font-size: 14px;
  }

  .sentinel {
    display: flex;
    justify-content: center;
    padding: 16px 0;
  }

  .spinner {
    width: 20px; height: 20px;
    border: 2px solid rgba(0, 108, 80, 0.15);
    border-top-color: #006c50;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  :global(.dark) .spinner {
    border-color: rgba(36, 224, 171, 0.15);
    border-top-color: #24e0ab;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>

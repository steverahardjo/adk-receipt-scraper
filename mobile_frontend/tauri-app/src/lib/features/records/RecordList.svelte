<script lang="ts">
  import type { Entry } from './types'
  import { groupByDate } from './types'
  import RecordRow from './RecordRow.svelte'

  let { allTransactions, onSelect }: { allTransactions: Entry[]; onSelect?: (e: Entry) => void } = $props()
  const PAGE_SIZE = 20
  let loaded = $state(PAGE_SIZE), sentinel = $state<HTMLDivElement | null>(null)

  let visible = $derived(allTransactions.slice(0, loaded)), grouped = $derived(groupByDate(visible))
  let hasMore = $derived(loaded < allTransactions.length)

  $effect(() => {
    if (!sentinel) return
    const obs = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && hasMore) loaded = Math.min(loaded + PAGE_SIZE, allTransactions.length) }, { rootMargin: '200px' })
    obs.observe(sentinel); return () => obs.disconnect()
  })
</script>

{#if visible.length === 0}
  <div class="empty"><p>No records found</p></div>
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
    {#if hasMore}<div bind:this={sentinel} class="sentinel"><div class="spinner"></div></div>{/if}
  </div>
{/if}

<style>
  .list { display: flex; flex-direction: column; gap: 0; }
  .section { padding: 0; }
  .section-label { display: block; font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 500; color: var(--deneb-text-secondary); letter-spacing: 0.03em; padding: 16px 0 4px; }
  .empty { text-align: center; padding: 48px 0; color: var(--deneb-text-secondary); font-size: 14px; }
  .sentinel { display: flex; justify-content: center; padding: 16px 0; }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--deneb-divider); border-top-color: #111111; border-radius: 50%; animation: spin 0.6s linear infinite; }
  :global(.dark) .spinner { border-top-color: #ECECEC; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>

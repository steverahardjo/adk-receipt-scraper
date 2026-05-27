<script lang="ts">
  import type { Period } from './types'
  let { value = '1m', onChange }: { value?: Period; onChange?: (v: Period) => void } = $props()
  const periods: { key: Period; label: string }[] = [
    { key: '1w', label: '1W' }, { key: '1m', label: '1M' }, { key: '3m', label: '3M' }, { key: '1y', label: '1Y' }, { key: 'all', label: 'All' },
  ]
</script>

<div class="chips">
  {#each periods as p}
    <button class="chip" class:active={value === p.key} onclick={() => onChange?.(p.key)}>{p.label}</button>
  {/each}
</div>

<style>
  .chips { display: flex; gap: 6px; padding: 4px 0; }
  .chip {
    padding: 6px 14px; border: 1px solid var(--deneb-border); border-radius: 9999px;
    background: transparent; font-family: 'Geist Sans', sans-serif;
    font-size: 12px; font-weight: 500; color: var(--deneb-text-secondary);
    cursor: pointer; -webkit-tap-highlight-color: transparent;
    transition: all 0.15s;
  }
  .chip.active { background: #111111; border-color: #111111; color: #FFFFFF; }
  :global(.dark) .chip.active { background: #ECECEC; border-color: #ECECEC; color: #18181A; }
</style>

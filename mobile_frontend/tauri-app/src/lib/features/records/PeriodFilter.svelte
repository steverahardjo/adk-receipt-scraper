<script lang="ts">
  import type { Period } from './types'

  let { value = '1m', onChange }: { value?: Period; onChange?: (v: Period) => void } = $props()

  const periods: { key: Period; label: string }[] = [
    { key: '1w', label: '1W' },
    { key: '1m', label: '1M' },
    { key: '3m', label: '3M' },
    { key: '1y', label: '1Y' },
    { key: 'all', label: 'All' },
  ]
</script>

<div class="chips">
  {#each periods as p}
    <button class="chip" class:active={value === p.key} onclick={() => onChange?.(p.key)}>
      {p.label}
    </button>
  {/each}
</div>

<style>
  .chips {
    display: flex;
    gap: 6px;
    padding: 4px 0;
  }
  .chip {
    padding: 6px 14px;
    border: 1px solid #e2e2e5;
    border-radius: 20px;
    background: transparent;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #6b7b72;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: all 0.15s;
  }
  :global(.dark) .chip { border-color: #404848; color: #6b7b72; }
  .chip.active {
    background: #006c50;
    border-color: #006c50;
    color: #ffffff;
  }
  :global(.dark) .chip.active {
    background: #24e0ab;
    border-color: #24e0ab;
    color: #1a1c1e;
  }
</style>

<script lang="ts">
  let {
    onPick,
    items = [
      'How much did I spend this month?',
      'Am I over budget?',
      'Where can I save more?',
    ],
  }: { onPick?: (text: string) => void; items?: string[] } = $props()
</script>

<div class="chips">
  {#each items as item}
    <button class="chip" onclick={() => onPick?.(item)}>{item}</button>
  {/each}
</div>

<style>
  .chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
  .chip {
    padding: 9px 14px;
    border: 1px solid var(--deneb-border);
    border-radius: 9999px;
    background: var(--deneb-surface);
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 13px; font-weight: 500;
    color: var(--f7-page-text-color);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s, transform 0.1s;
  }
  .chip:active { background: var(--deneb-canvas); transform: scale(0.97); }
</style>

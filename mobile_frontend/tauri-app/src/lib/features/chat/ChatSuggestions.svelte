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
    display: inline-flex; align-items: center;
    min-height: 44px;
    padding: 10px 16px;
    border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-pill);
    background: var(--deneb-surface);
    font-family: var(--deneb-sans);
    font-size: 15px; font-weight: 500;
    color: var(--deneb-ink);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--deneb-dur-fast) var(--deneb-ease), color var(--deneb-dur-fast) var(--deneb-ease), transform var(--deneb-dur-fast) var(--deneb-ease);
  }
  .chip:active { background: var(--deneb-accent-bg); color: var(--deneb-accent); border-color: var(--deneb-accent); transform: scale(0.97); }
</style>

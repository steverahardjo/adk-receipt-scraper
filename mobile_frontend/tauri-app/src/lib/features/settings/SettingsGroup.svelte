<script lang="ts">
  let { title = '', children }: { title?: string; children?: import('svelte').Snippet } = $props()
</script>

<div class="group">
  {#if title}<span class="group-title">{title}</span>{/if}
  <div class="group-card">{@render children?.()}</div>
</div>

<style>
  .group { display: flex; flex-direction: column; gap: 8px; }
  .group-title {
    font-family: 'Geist Mono', monospace;
    font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
    color: var(--deneb-text-secondary); text-transform: uppercase;
    padding-left: 4px;
  }
  .group-card {
    background: var(--deneb-surface);
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    overflow: hidden;
  }
</style>

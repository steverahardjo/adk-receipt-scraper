<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    label,
    value = '',
    desc = '',
    onclick,
    chevron = false,
    danger = false,
    children,
  }: {
    label: string
    value?: string
    desc?: string
    onclick?: () => void
    chevron?: boolean
    danger?: boolean
    children?: Snippet
  } = $props()
</script>

{#snippet inner()}
  <div class="text">
    <span class="label">{label}</span>
    {#if desc}<span class="desc">{desc}</span>{/if}
  </div>
  <div class="right">
    {@render children?.()}
    {#if value}<span class="value">{value}</span>{/if}
    {#if chevron}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    {/if}
  </div>
{/snippet}

{#if onclick}
  <button class="row" class:danger type="button" {onclick}>{@render inner()}</button>
{:else}
  <div class="row" class:danger>{@render inner()}</div>
{/if}

<style>
  .row {
    display: flex; align-items: center; justify-content: space-between; gap: 14px;
    width: 100%; padding: 14px 16px;
    background: transparent; border: none;
    border-bottom: 1px solid var(--deneb-divider);
    text-align: left; box-sizing: border-box;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  .row:last-child { border-bottom: none; }
  button.row { cursor: pointer; transition: background 0.1s; }
  button.row:active { background: var(--deneb-canvas); }

  .text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .label { font-family: var(--deneb-sans); font-size: 15px; font-weight: 500; color: var(--f7-page-text-color); }
  .desc { font-family: var(--deneb-sans); font-size: 12px; color: var(--deneb-text-secondary); }
  .danger .label { color: var(--deneb-negative); }

  .right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .value { font-family: 'Geist Mono', monospace; font-size: 13px; color: var(--deneb-text-secondary); max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .right :global(svg) { color: var(--deneb-text-muted); flex-shrink: 0; }
</style>

<script lang="ts">
  import { goto } from '$app/navigation'
  import { getEntries } from '$lib/features/records/store.svelte'

  let entries = $derived(getEntries())
  let recent = $derived(
    entries.filter((e) => e.flow === 'expense').slice(0, 4),
  )

  function when(d: Date) {
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const yest = new Date(now); yest.setDate(yest.getDate() - 1)
    if (d.toDateString() === yest.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
</script>

<div class="section">
  <div class="section-head">
    <span class="section-label">Recent activity</span>
    <button class="see-all" onclick={() => goto('/records')}>
      See all
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>

  {#if recent.length === 0}
    <div class="empty">
      <p>No activity yet</p>
      <span>Add your first entry to see it here.</span>
    </div>
  {:else}
    <div class="list">
      {#each recent as tx, i (tx.id)}
        <div class="row">
          <div class="row-left">
            <span class="merchant">{tx.title}</span>
            <span class="meta">{tx.type || (tx.flow === 'income' ? 'Income' : 'Expense')} &middot; {when(tx.date)}</span>
          </div>
          <span class="amount">−Rp {tx.amount.toLocaleString('id-ID')}</span>
        </div>
        {#if i < recent.length - 1}<div class="sep"></div>{/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .section { padding: 2px 0 0; }
  .section-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0; margin-bottom: 4px; }
  .section-label {
    font-family: var(--ds-font-sans);
    font-size: 13px; font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--ds-text-secondary);
  }
  .see-all {
    display: inline-flex; align-items: center; gap: 1px;
    min-height: 32px; padding: 0 4px 0 8px;
    border: none; background: transparent;
    font-family: var(--ds-font-sans);
    font-size: 14px; font-weight: 500;
    color: var(--ds-accent);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: opacity var(--ds-dur-fast) var(--ds-ease);
  }
  .see-all:active { opacity: 0.55; }
  .see-all svg { margin-top: 1px; }

  .list { display: flex; flex-direction: column; }
  .row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 14px; min-width: 0; padding: 11px 0;
  }
  .row-left { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .merchant {
    font-family: var(--ds-font-sans);
    font-size: 15px; font-weight: 500;
    color: var(--ds-ink); letter-spacing: -0.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .meta {
    font-family: var(--ds-font-sans);
    font-size: 12px; font-weight: 400;
    color: var(--ds-text-secondary);
  }
  .amount {
    font-family: var(--ds-font-mono);
    font-size: 14px; font-weight: 500;
    color: var(--ds-ink);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0; white-space: nowrap;
  }
  .sep { height: 1px; background: var(--ds-rule); }
  .empty { padding: 18px 0 8px; }
  .empty p { margin: 0; font-size: 15px; font-weight: 500; color: var(--ds-ink); }
  .empty span { font-size: 13px; color: var(--ds-text-secondary); }
</style>

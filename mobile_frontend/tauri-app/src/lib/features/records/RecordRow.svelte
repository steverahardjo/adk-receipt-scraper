<script lang="ts">
  import type { Entry } from './types'
  import { CURRENCIES, TYPE_UI } from './types'

  let { tx, onSelect }: { tx: Entry; onSelect?: (t: Entry) => void } = $props()
  let icon = $derived(
    tx.flow === 'income' ? 'income' : (TYPE_UI[tx.type || 'Other'] || 'other'),
  )
  let symbol = $derived(CURRENCIES[tx.currency])

  function timeStr(d: Date) { return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
  function label() { return tx.flow === 'income' ? tx.source || 'Income' : tx.type || 'Expense' }
</script>

<button class="row" onclick={() => onSelect?.(tx)}>
  <div class="icon" class:income={tx.flow === 'income'}>
    {#if icon === 'food'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>
    {:else if icon === 'transport'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
    {:else if icon === 'shopping'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
    {:else if icon === 'bill'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    {:else if icon === 'income' || icon === 'freelance'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
    {:else}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    {/if}
  </div>
  <div class="info">
    <div class="top">
      <span class="title">{tx.title}</span>
      <span class="amount">{tx.flow === 'income' ? '+' : '−'}{symbol} {tx.amount.toLocaleString('id-ID')}</span>
    </div>
    <div class="bottom">
      <span class="meta">{label()}</span>
      {#if tx.paymentMethod}<span class="dot">&middot;</span><span class="meta">{tx.paymentMethod}</span>{/if}
      <span class="dot">&middot;</span><span class="meta">{timeStr(tx.date)}</span>
    </div>
  </div>
</button>

<style>
  .row {
    display: flex; align-items: center; gap: 12px; padding: 14px 0;
    border-bottom: 1px solid var(--deneb-rule);
    background: none; border-left: none; border-right: none; border-top: none;
    width: 100%; text-align: left; cursor: pointer; font-family: inherit;
    -webkit-tap-highlight-color: transparent; transition: opacity 0.1s;
  }
  .row:last-child { border-bottom: none; }
  .row:active { opacity: 0.6; }
  .icon {
    width: 40px; height: 40px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    background: var(--deneb-surface-2); color: var(--deneb-text-secondary);
  }
  .icon.income { background: var(--deneb-positive-bg); color: var(--deneb-positive); }
  .info { flex: 1; min-width: 0; }
  .top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .title {
    font-family: var(--deneb-sans); font-size: 14px; font-weight: 500;
    color: var(--deneb-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .amount {
    font-family: var(--deneb-mono); font-size: 14px; font-weight: 500;
    color: var(--deneb-ink); font-variant-numeric: tabular-nums; white-space: nowrap;
  }
  .bottom { display: flex; align-items: center; gap: 4px; margin-top: 2px; flex-wrap: wrap; }
  .meta { font-family: var(--deneb-mono); font-size: 11px; font-weight: 400; color: var(--deneb-text-secondary); }
  .dot { color: var(--deneb-text-muted); font-size: 10px; }
</style>

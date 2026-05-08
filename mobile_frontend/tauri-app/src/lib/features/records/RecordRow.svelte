<script lang="ts">
  import type { Entry } from './types'
  import { CURRENCIES, TYPE_UI, typeIcon } from './types'

  let { tx, onSelect }: { tx: Entry; onSelect?: (t: Entry) => void } = $props()

  let icon = $derived(typeIcon(tx.type, tx.flow))
  let symbol = $derived(CURRENCIES[tx.currency])

  function timeStr(d: Date) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  function label() {
    if (tx.flow === 'income') return tx.source || 'Income'
    return tx.type || 'Expense'
  }
</script>

<button class="row" onclick={() => onSelect?.(tx)}>
  <div class="icon" class:income={tx.flow === 'income'} class:expense={tx.flow === 'expense'}>
    {#if icon === 'food'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
      </svg>
    {:else if icon === 'transport'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    {:else if icon === 'shopping'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
      </svg>
    {:else if icon === 'bill'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    {:else if icon === 'income' || icon === 'freelance'}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    {:else}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    {/if}
  </div>
  <div class="info">
    <div class="top">
      <span class="title">{tx.title}</span>
      <span class="amount" class:income={tx.flow === 'income'} class:expense={tx.flow === 'expense'}>
        {tx.flow === 'income' ? '+' : '-'}{symbol} {tx.amount.toLocaleString('id-ID')}
      </span>
    </div>
    <div class="bottom">
      <span class="label">{label()}</span>
      {#if tx.paymentMethod}
        <span class="dot">·</span>
        <span class="label">{tx.paymentMethod}</span>
      {/if}
      <span class="dot">·</span>
      <span class="time">{timeStr(tx.date)}</span>
    </div>
  </div>
</button>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid #f2f2f7;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s;
    font-family: inherit;
  }
  :global(.dark) .row { border-color: #2c2c2e; }
  .row:last-child { border-bottom: none; }
  .row:active { background: rgba(0, 141, 163, 0.04); }
  :global(.dark) .row:active { background: rgba(110, 212, 236, 0.04); }

  .icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .icon.income { background: rgba(46, 229, 175, 0.12); color: #006c50; }
  .icon.expense { background: rgba(186, 26, 26, 0.06); color: #ba1a1a; }
  :global(.dark) .icon.income { color: #24e0ab; background: rgba(36, 224, 171, 0.1); }
  :global(.dark) .icon.expense { color: #ffb4ab; background: rgba(255, 180, 171, 0.06); }

  .info { flex: 1; min-width: 0; }
  .top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .title { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; color: #1a1c1e; }
  :global(.dark) .title { color: #f0f0f3; }
  .amount { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .amount.income { color: #006c50; }
  .amount.expense { color: #ba1a1a; }
  :global(.dark) .amount.income { color: #24e0ab; }
  :global(.dark) .amount.expense { color: #ffb4ab; }

  .bottom { display: flex; align-items: center; gap: 4px; margin-top: 2px; flex-wrap: wrap; }
  .label { font-family: 'Public Sans', sans-serif; font-size: 12px; font-weight: 500; color: #6b7b72; }
  .dot { color: #aeaeb2; font-size: 10px; }
  .time { font-family: 'Public Sans', sans-serif; font-size: 12px; font-weight: 500; color: #aeaeb2; }
</style>

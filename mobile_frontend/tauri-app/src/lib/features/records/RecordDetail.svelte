<script lang="ts">
  import type { Transaction } from './types'

  let { tx, onClose }: { tx: Transaction | null; onClose?: () => void } = $props()

  let transitioning = $state(false)
  let visible = $state(false)

  $effect(() => {
    if (tx) {
      visible = true
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { transitioning = true })
      })
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  function dateStr(d: Date) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  function timeStr(d: Date) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
</script>

{#if visible && tx}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="header">
      <div class="icon-lg" class:income={tx.flow === 'income'} class:expense={tx.flow === 'expense'}>
        {#if tx.categoryIcon === 'food'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
          </svg>
        {:else if tx.categoryIcon === 'transport'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        {:else if tx.categoryIcon === 'shopping'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
        {:else if tx.categoryIcon === 'wallet'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        {:else if tx.categoryIcon === 'bill'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        {:else if tx.categoryIcon === 'income'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        {:else}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
        {/if}
      </div>
      <div class="header-text">
        <h2 class="merchant-name">{tx.merchant}</h2>
        <span class="category-label">{tx.category}</span>
      </div>
      <p class="amount-main" class:income={tx.flow === 'income'} class:expense={tx.flow === 'expense'}>
        {tx.flow === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
      </p>
    </div>

    <div class="details">
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">{dateStr(tx.date)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">{timeStr(tx.date)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Type</span>
        <span class="detail-value" class:income={tx.flow === 'income'} class:expense={tx.flow === 'expense'}>
          {tx.flow === 'income' ? 'Income' : 'Expense'}
        </span>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed; inset: 0; z-index: 14000;
    background: rgba(0,0,0,0.4);
    opacity: 0; transition: opacity 0.25s ease-out;
  }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.6); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0;
    z-index: 14001;
    background: #fff;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
  }
  :global(.dark) .sheet { background: #1c1c1e; }
  .sheet.show { transform: translateY(0); }

  .handle {
    width: 40px; height: 5px; border-radius: 3px;
    background: #d1d1d6; margin: 10px auto 6px;
  }
  :global(.dark) .handle { background: #48484a; }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 8px 24px 16px;
    text-align: center;
  }

  .icon-lg {
    width: 56px; height: 56px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
  }
  .icon-lg.income { background: rgba(46, 229, 175, 0.12); color: #006c50; }
  .icon-lg.expense { background: rgba(186, 26, 26, 0.06); color: #ba1a1a; }
  :global(.dark) .icon-lg.income { color: #24e0ab; background: rgba(36, 224, 171, 0.1); }
  :global(.dark) .icon-lg.expense { color: #ffb4ab; background: rgba(255, 180, 171, 0.06); }

  .header-text { display: flex; flex-direction: column; gap: 2px; }
  .merchant-name {
    font-family: 'Manrope', sans-serif;
    font-size: 18px; font-weight: 700;
    margin: 0; color: #1a1c1e;
  }
  :global(.dark) .merchant-name { color: #f0f0f3; }

  .category-label {
    font-family: 'Public Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: #6b7b72;
  }

  .amount-main {
    font-family: 'Manrope', sans-serif;
    font-size: 28px; font-weight: 700;
    margin: 4px 0 0;
    font-variant-numeric: tabular-nums;
  }
  .amount-main.income { color: #006c50; }
  .amount-main.expense { color: #ba1a1a; }
  :global(.dark) .amount-main.income { color: #24e0ab; }
  :global(.dark) .amount-main.expense { color: #ffb4ab; }

  .details {
    padding: 8px 24px 24px;
    display: flex; flex-direction: column; gap: 12px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f7;
  }
  :global(.dark) .detail-row { border-color: #2c2c2e; }
  .detail-row:last-child { border-bottom: none; }

  .detail-label {
    font-family: 'Public Sans', sans-serif;
    font-size: 14px; font-weight: 500; color: #6b7b72;
  }
  .detail-value {
    font-family: 'Manrope', sans-serif;
    font-size: 14px; font-weight: 600; color: #1a1c1e;
  }
  :global(.dark) .detail-value { color: #f0f0f3; }
  .detail-value.income { color: #006c50; }
  .detail-value.expense { color: #ba1a1a; }
  :global(.dark) .detail-value.income { color: #24e0ab; }
  :global(.dark) .detail-value.expense { color: #ffb4ab; }
</style>

<script lang="ts">
  import type { Entry } from './types'
  import { CURRENCIES, TYPE_UI, typeIcon } from './types'

  let { tx, onClose }: { tx: Entry | null; onClose?: () => void } = $props()

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

  let icon = $derived(typeIcon(tx?.type, tx?.flow))

  function dateStr(d: Date) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  function timeStr(d: Date) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  function categoryLabel() {
    if (!tx) return ''
    if (tx.flow === 'income') return tx.source || 'Income'
    return tx.type || 'Expense'
  }

  function isImage(link: string) {
    return link.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(link)
  }
</script>

{#if visible && tx}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="header">
      <div class="icon-lg" class:income={tx.flow === 'income'} class:expense={tx.flow === 'expense'}>
        {#if icon === 'food'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
          </svg>
        {:else if icon === 'transport'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        {:else if icon === 'shopping'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
        {:else if icon === 'bill'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        {:else if icon === 'income' || icon === 'freelance'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        {:else}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        {/if}
      </div>
      <div class="header-text">
        <h2 class="entry-title headline-sm">{tx.title}</h2>
        <span class="category-label">{categoryLabel()}</span>
      </div>
      <p class="amount-main" class:income={tx.flow === 'income'} class:expense={tx.flow === 'expense'}>
        {tx.flow === 'income' ? '+' : '-'}{CURRENCIES[tx.currency]} {tx.amount.toLocaleString('id-ID')}
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
      {#if tx.flow === 'expense' && tx.paymentMethod}
        <div class="detail-row">
          <span class="detail-label">Payment</span>
          <span class="detail-value">{tx.paymentMethod}</span>
        </div>
      {/if}
      {#if tx.flow === 'income' && tx.source}
        <div class="detail-row">
          <span class="detail-label">Source</span>
          <span class="detail-value">{tx.source}</span>
        </div>
      {/if}
      {#if tx.description}
        <div class="detail-row">
          <span class="detail-label">Notes</span>
          <span class="detail-value">{tx.description}</span>
        </div>
      {/if}
      {#if tx.documentLink}
        <div class="doc-section">
          <span class="detail-label">Payment Proof</span>
          {#if isImage(tx.documentLink)}
            <a class="doc-preview" href={tx.documentLink} target="_blank" rel="noopener noreferrer">
              <img src={tx.documentLink} alt="Payment proof" />
            </a>
          {:else}
            <a class="doc-link" href={tx.documentLink} target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download</span>
            </a>
          {/if}
        </div>
      {/if}
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
    background: var(--deneb-surface);
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
  }
  .sheet.show { transform: translateY(0); }

  .handle {
    width: 40px; height: 5px; border-radius: 3px;
    background: var(--deneb-border); margin: 10px auto 6px;
  }

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
  .icon-lg.income { background: var(--deneb-positive-bg); color: var(--deneb-positive); }
  .icon-lg.expense { background: var(--deneb-negative-bg); color: var(--deneb-negative); }

  .header-text { display: flex; flex-direction: column; gap: 2px; }
  .entry-title {
    margin: 0;
  }

  .category-label {
    font-family: var(--deneb-mono);
    font-size: 13px; font-weight: 500; color: var(--deneb-text-secondary);
  }

  .amount-main {
    font-family: 'JetBrains Mono', monospace;
    font-size: 28px; font-weight: 700;
    margin: 4px 0 0;
    font-variant-numeric: tabular-nums;
  }
  .amount-main.income { color: var(--deneb-positive); }
  .amount-main.expense { color: var(--deneb-negative); }

  .details {
    padding: 8px 24px 24px;
    display: flex; flex-direction: column; gap: 12px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--deneb-rule);
  }
  .detail-row:last-child { border-bottom: none; }

  .doc-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    font-family: var(--deneb-sans);
    font-size: 13px;
    font-weight: 600;
    color: var(--deneb-info);
    text-decoration: none;
    transition: background 0.1s;
  }
  .doc-link:active { background: var(--deneb-divider); }

  .doc-section { display: flex; flex-direction: column; gap: 8px; padding-top: 4px; }
  .doc-preview { display: block; border-radius: 10px; overflow: hidden; border: 1px solid var(--deneb-border); }
  .doc-preview img { display: block; width: 100%; max-height: 220px; object-fit: cover; }

  .detail-label {
    font-family: var(--deneb-mono);
    font-size: 14px; font-weight: 500; color: var(--deneb-text-secondary);
  }
  .detail-value {
    font-family: var(--deneb-sans);
    font-size: 14px; font-weight: 600; color: var(--deneb-ink);
  }
  .detail-value.income { color: var(--deneb-positive); }
  .detail-value.expense { color: var(--deneb-negative); }
</style>

<script lang="ts">
  import { Button } from 'framework7-svelte'
  import { showToast, dismissToast } from '$lib/features/core/toast.svelte'
  import { TYPES, PAYMENTS, INCOME_SOURCES, CURRENCIES } from '$lib/features/records/types'
  import type { Entry } from '$lib/features/records/types'
  import { addEntry } from '$lib/features/records/store.svelte'
  import AttachmentField from './AttachmentField.svelte'
  import ReceiptScanner from './ReceiptScanner.svelte'

  let { scanTitle = '', scanAmount = '' }: { scanTitle?: string; scanAmount?: string } = $props()

  let title = $state(scanTitle)
  let amount = $state(scanAmount)
  let flow: 'expense' | 'income' = $state('expense')
  let currency: keyof typeof CURRENCIES = $state('IDR')
  let date = $state(new Date().toISOString().slice(0, 10))
  let type = $state('')
  let paymentMethod = $state('')
  let source = $state('')
  let description = $state('')
  let documentLink = $state('')
  let submitting = $state(false)
  let scannerOpen = $state(false)

  let currencyKeys = $derived(Object.keys(CURRENCIES) as (keyof typeof CURRENCIES)[])

  function openScanner() {
    showToast({ type: 'success', title: 'QR Scanner', message: 'Point camera at QRIS code', duration: 2000 })
  }

  function openCamera() {
    scannerOpen = true
  }

  function applyReceipt(result: { title: string; amount: string; date: string; description: string; image: string }) {
    if (result.title) title = result.title
    if (result.amount) amount = result.amount
    if (result.date) date = result.date
    if (result.description) description = result.description
    if (result.image) documentLink = result.image
    showToast({ type: 'success', title: 'Receipt scanned', message: 'Review the details below', duration: 2000 })
  }

  function entryDate(value: string): Date {
    const now = new Date()
    const [y, m, d] = value.split('-').map(Number)
    if (!y || !m || !d) return now
    return new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds())
  }

  async function handleSave() {
    if (!title || !amount) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Title and amount are required', duration: 2500 })
      return
    }
    if (flow === 'expense' && (!type || !paymentMethod)) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Expense needs type and payment method', duration: 2500 })
      return
    }
    if (flow === 'income' && !source) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Income needs a source', duration: 2500 })
      return
    }
    submitting = true
    showToast({ type: 'loading', title: 'Saving...' })
    try {
      await new Promise((r) => setTimeout(r, 400))
      const entry: Entry = {
        id: globalThis.crypto?.randomUUID?.() ?? `tx-${Date.now()}`,
        title: title.trim(),
        amount: Number(amount),
        currency,
        date: entryDate(date),
        flow,
        type: flow === 'expense' ? (type as Entry['type']) : undefined,
        paymentMethod: flow === 'expense' ? (paymentMethod as Entry['paymentMethod']) : undefined,
        source: flow === 'income' ? (source as Entry['source']) : undefined,
        description: description.trim() || undefined,
        documentLink: documentLink || undefined,
      }
      addEntry(entry)
      dismissToast()
      showToast({ type: 'success', title: 'Entry added!', duration: 2000 })
      title = ''
      amount = ''
      type = ''
      paymentMethod = ''
      source = ''
      description = ''
      documentLink = ''
    } catch {
      dismissToast()
      showToast({ type: 'error', title: 'Failed to save', duration: 3000 })
    } finally {
      submitting = false
    }
  }
</script>

<div class="card">
  <div class="card-header">
    <h2 class="card-title headline-md">New Entry</h2>
    <div class="card-actions">
      <button class="icon-btn" onclick={openScanner} aria-label="Scan QR">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7V5a2 2 0 012-2h2" /><path d="M17 3h2a2 2 0 012 2v2" /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path d="M7 21H5a2 2 0 01-2-2v-2" /><rect x="7" y="7" width="10" height="10" rx="2" />
        </svg>
      </button>
      <button class="icon-btn" onclick={openCamera} aria-label="Scan Receipt">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="12" r="4" />
        </svg>
      </button>
    </div>
  </div>

  <div class="fields">
    <div class="field-row">
      <div class="field flex-1">
        <label class="field-label">Type</label>
        <div class="flow-switch">
          <button class="flow-btn" class:active={flow === 'expense'} onclick={() => flow = 'expense'}>Expense</button>
          <button class="flow-btn" class:active={flow === 'income'} onclick={() => flow = 'income'}>Income</button>
        </div>
      </div>
      <div class="field" style="flex: 0.6">
        <label class="field-label" for="exp-currency">Currency</label>
        <select id="exp-currency" class="field-input field-select" bind:value={currency}>
          {#each currencyKeys as c}
            <option value={c}>{c} ({CURRENCIES[c]})</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="exp-title">Title</label>
      <input id="exp-title" class="field-input" type="text" placeholder="e.g. Starbucks" bind:value={title} />
    </div>

    <div class="field-row">
      <div class="field flex-1">
        <label class="field-label" for="exp-amount">Amount</label>
        <input id="exp-amount" class="field-input" type="number" placeholder="0" bind:value={amount} />
      </div>
      <div class="field flex-1">
        <label class="field-label" for="exp-date">Date</label>
        <input id="exp-date" class="field-input" type="date" bind:value={date} />
      </div>
    </div>

    {#if flow === 'expense'}
      <div class="field-row">
        <div class="field flex-1">
          <label class="field-label" for="exp-type">Category</label>
          <select id="exp-type" class="field-input field-select" bind:value={type}>
            <option value="" disabled>Select type</option>
            {#each TYPES as t}
              <option value={t}>{t}</option>
            {/each}
          </select>
        </div>
        <div class="field flex-1">
          <label class="field-label" for="exp-payment">Payment</label>
          <select id="exp-payment" class="field-input field-select" bind:value={paymentMethod}>
            <option value="" disabled>Select method</option>
            {#each PAYMENTS as p}
              <option value={p}>{p}</option>
            {/each}
          </select>
        </div>
      </div>
    {:else}
      <div class="field">
        <label class="field-label" for="exp-source">Source</label>
        <select id="exp-source" class="field-input field-select" bind:value={source}>
          <option value="" disabled>Select source</option>
          {#each INCOME_SOURCES as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>
    {/if}

    <div class="field">
      <label class="field-label" for="exp-notes">Notes</label>
      <textarea id="exp-notes" class="field-input field-textarea" placeholder="Optional" rows="2" bind:value={description}></textarea>
    </div>

    <AttachmentField bind:value={documentLink} />
  </div>

  <Button fill large round {...({ class: 'save-btn' } as any)} onclick={handleSave} disabled={submitting}>
    {submitting ? 'Saving...' : 'Save Entry'}
  </Button>
</div>

<ReceiptScanner opened={scannerOpen} onClose={() => scannerOpen = false} onResult={applyReceipt} />

<style>
  .card {
    background: var(--deneb-surface);
    border: 1px solid var(--deneb-border);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .card-title {
    margin: 0;
  }

  .card-actions { display: flex; gap: 8px; }
  .icon-btn {
    width: 38px; height: 38px;
    border: none; border-radius: 10px;
    background: var(--deneb-info-bg);
    color: var(--deneb-info);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s;
  }
  .icon-btn:active { background: var(--deneb-divider); }

  .fields { display: flex; flex-direction: column; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-row { display: flex; gap: 12px; }
  .flex-1 { flex: 1; }

  .field-label {
    font-family: var(--deneb-mono);
    font-size: 12px; font-weight: 500;
    color: var(--deneb-text-secondary); letter-spacing: 0.02em;
  }

  .field-input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    font-family: var(--deneb-sans);
    font-size: 15px;
    color: var(--deneb-ink);
    background: var(--deneb-canvas);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .field-input:focus { border-color: var(--deneb-ink); }
  .field-input::placeholder { color: var(--deneb-text-muted); }

  .field-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23787774' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }

  .field-textarea {
    height: auto;
    padding: 12px 14px;
    resize: none;
  }

  .flow-switch {
    display: flex;
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    overflow: hidden;
    height: 44px;
  }
  .flow-btn {
    flex: 1;
    border: none;
    background: transparent;
    font-family: var(--deneb-sans);
    font-size: 14px;
    font-weight: 600;
    color: var(--deneb-text-secondary);
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .flow-btn.active {
    background: var(--deneb-ink);
    color: var(--f7-page-bg-color);
  }

  :global(.save-btn) {
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
    margin-top: 8px;
  }
</style>

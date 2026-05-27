<script lang="ts">
  import { Button } from 'framework7-svelte'
  import { showToast, dismissToast } from '$lib/features/core/toast.svelte'
  import { TYPES, PAYMENTS, INCOME_SOURCES, CURRENCIES } from '$lib/features/records/types'

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
  let submitting = $state(false)

  let currencyKeys = $derived(Object.keys(CURRENCIES) as (keyof typeof CURRENCIES)[])

  function openScanner() {
    showToast({ type: 'success', title: 'QR Scanner', message: 'Point camera at QRIS code', duration: 2000 })
  }

  function openCamera() {
    showToast({ type: 'success', title: 'Receipt Camera', message: 'Take a photo of your receipt', duration: 2000 })
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
      await new Promise((r) => setTimeout(r, 800))
      dismissToast()
      showToast({ type: 'success', title: 'Entry added!', duration: 2000 })
      title = ''
      amount = ''
      type = ''
      paymentMethod = ''
      source = ''
      description = ''
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
  </div>

  <Button fill large round class="save-btn" onclick={handleSave} disabled={submitting}>
    {submitting ? 'Saving...' : 'Save Entry'}
  </Button>
</div>

<style>
  .card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }
  :global(.dark) .card { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); }

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
    background: rgba(0, 141, 163, 0.06);
    color: #008da3;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s;
  }
  :global(.dark) .icon-btn { color: #6ed4ec; background: rgba(110, 212, 236, 0.06); }
  .icon-btn:active { background: rgba(0, 141, 163, 0.12); }

  .fields { display: flex; flex-direction: column; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-row { display: flex; gap: 12px; }
  .flex-1 { flex: 1; }

  .field-label {
    font-family: 'Public Sans', sans-serif;
    font-size: 12px; font-weight: 600;
    color: #6b7b72; letter-spacing: 0.02em;
  }

  .field-input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border: 1.5px solid transparent;
    border-radius: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 15px;
    color: #1a1c1e;
    background: #f0f9f8;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  :global(.dark) .field-input { background: #2f3133; color: #f0f0f3; }
  .field-input:focus { border-color: #2ee5af; }
  :global(.dark) .field-input:focus { border-color: #24e0ab; }
  .field-input::placeholder { color: #aeaeb2; }

  .field-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b7b72' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
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
    border: 1.5px solid rgba(0, 141, 163, 0.15);
    border-radius: 10px;
    overflow: hidden;
    height: 44px;
  }
  .flow-btn {
    flex: 1;
    border: none;
    background: transparent;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #6b7b72;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .flow-btn.active {
    background: #006c50;
    color: #fff;
  }
  :global(.dark) .flow-btn.active {
    background: #24e0ab;
    color: #1a1c1e;
  }

  :global(.save-btn) {
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
    margin-top: 8px;
  }
</style>

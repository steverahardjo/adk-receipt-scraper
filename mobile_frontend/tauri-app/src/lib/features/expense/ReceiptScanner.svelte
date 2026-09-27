<script lang="ts">
  import { recognizeReceipt } from './receiptOcr'

  let {
    opened = false,
    onClose,
    onResult,
  }: {
    opened?: boolean
    onClose?: () => void
    onResult?: (result: { title: string; amount: string; date: string; description: string; image: string }) => void
  } = $props()

  type Step = 'choose' | 'processing' | 'review'
  let step = $state<Step>('choose')
  let image = $state('')
  let error = $state('')
  let title = $state('')
  let amount = $state('')
  let date = $state('')
  let description = $state('')
  let ocrUsed = $state(false)

  let cameraInput = $state<HTMLInputElement | null>(null)
  let galleryInput = $state<HTMLInputElement | null>(null)
  let transitioning = $state(false)
  let visible = $state(false)

  const MAX_BYTES = 5 * 1024 * 1024

  $effect(() => {
    if (opened) {
      step = 'choose'; image = ''; error = ''
      title = ''; amount = ''; date = ''; description = ''; ocrUsed = false
      visible = true
      requestAnimationFrame(() => requestAnimationFrame(() => { transitioning = true }))
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(new Error('read failed'))
      reader.readAsDataURL(file)
    })
  }

  async function onFile(event: Event) {
    error = ''
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { error = 'Only images are supported'; return }
    if (file.size > MAX_BYTES) { error = 'Image must be under 5 MB'; return }
    try {
      image = await readFile(file)
      await process()
    } catch {
      error = 'Could not read image'
    }
  }

  async function process() {
    step = 'processing'
    const result = await recognizeReceipt(image)
    if (result) {
      title = result.title ?? ''
      amount = result.amount ?? ''
      date = result.date ?? new Date().toISOString().slice(0, 10)
      description = result.description ?? ''
      ocrUsed = true
    } else {
      date = new Date().toISOString().slice(0, 10)
      ocrUsed = false
    }
    step = 'review'
  }

  function confirm() {
    onResult?.({ title: title.trim(), amount: amount.trim(), date, description: description.trim(), image })
    onClose?.()
  }

  function retake() {
    step = 'choose'
    image = ''
    error = ''
  }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="body">
      <h2 class="title headline-md">Scan Receipt</h2>

      {#if step === 'choose'}
        <p class="hint">Take a photo of your receipt or pick one from your library.</p>
        <div class="choose-actions">
          <button class="big-btn primary" onclick={() => cameraInput?.click()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="12" r="4" /></svg>
            <span>Take photo</span>
          </button>
          <button class="big-btn secondary" onclick={() => galleryInput?.click()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            <span>Choose image</span>
          </button>
        </div>
      {:else if step === 'processing'}
        <div class="processing">
          {#if image}<img src={image} alt="Receipt" />{/if}
          <div class="spinner"></div>
          <p class="hint">Reading receipt...</p>
        </div>
      {:else}
        {#if image}<img class="review-image" src={image} alt="Receipt" />{/if}
        {#if !ocrUsed}
          <p class="notice">Automatic recognition isn't available yet. Enter the details below.</p>
        {/if}
        <div class="fields">
          <div class="field">
            <label class="field-label" for="rcpt-title">Merchant</label>
            <input id="rcpt-title" class="field-input" type="text" placeholder="e.g. Starbucks" bind:value={title} />
          </div>
          <div class="field-row">
            <div class="field flex-1">
              <label class="field-label" for="rcpt-amount">Amount</label>
              <input id="rcpt-amount" class="field-input" type="number" placeholder="0" bind:value={amount} />
            </div>
            <div class="field flex-1">
              <label class="field-label" for="rcpt-date">Date</label>
              <input id="rcpt-date" class="field-input" type="date" bind:value={date} />
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="rcpt-notes">Notes</label>
            <input id="rcpt-notes" class="field-input" type="text" placeholder="Optional" bind:value={description} />
          </div>
        </div>
        <div class="review-actions">
          <button class="big-btn secondary" onclick={retake}>Retake</button>
          <button class="big-btn primary" onclick={confirm} disabled={!title.trim() || !amount}>Use details</button>
        </div>
      {/if}

      {#if error}<p class="error">{error}</p>{/if}

      <input bind:this={cameraInput} class="hidden" type="file" accept="image/*" capture="environment" onchange={onFile} />
      <input bind:this={galleryInput} class="hidden" type="file" accept="image/*" onchange={onFile} />
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 16000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 16001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); max-height: 92dvh; overflow-y: auto;
  }
  .sheet.show { transform: translateY(0); }
  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border); margin: 10px auto 6px; }

  .body { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 4px 24px 32px; }
  .title { margin: 4px 0 0; }
  .hint { font-family: var(--deneb-sans); font-size: 14px; color: var(--deneb-text-secondary); margin: 0; text-align: center; }
  .hidden { display: none; }

  .choose-actions, .review-actions { display: flex; gap: 10px; width: 100%; }
  .big-btn {
    flex: 1; height: 48px; display: flex; align-items: center; justify-content: center; gap: 8px;
    border-radius: 10px; border: none;
    font-family: var(--deneb-sans); font-size: 14px; font-weight: 500; cursor: pointer;
    -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
  }
  .big-btn.primary { background: var(--f7-page-text-color); color: var(--f7-page-bg-color); }
  .big-btn.secondary { background: transparent; border: 1px solid var(--deneb-border); color: var(--f7-page-text-color); }
  .big-btn:disabled { opacity: 0.4; cursor: default; }
  .big-btn:active:not(:disabled) { opacity: 0.85; }

  .processing { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 12px 0; }
  .processing img { width: 140px; border-radius: 10px; border: 1px solid var(--deneb-border); }

  .review-image { width: 100%; max-height: 180px; object-fit: cover; border-radius: 10px; border: 1px solid var(--deneb-border); }
  .notice {
    width: 100%; margin: 0; padding: 10px 12px; border-radius: 8px;
    background: var(--deneb-warning-bg); color: var(--deneb-warning);
    font-family: var(--deneb-sans); font-size: 12px;
  }

  .fields { display: flex; flex-direction: column; gap: 12px; width: 100%; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-row { display: flex; gap: 12px; }
  .flex-1 { flex: 1; }
  .field-label { font-family: 'Geist Mono', monospace; font-size: 12px; font-weight: 500; color: var(--deneb-text-secondary); }
  .field-input {
    width: 100%; height: 44px; padding: 0 14px;
    border: 1px solid var(--deneb-border); border-radius: 10px;
    font-family: var(--deneb-sans); font-size: 15px;
    color: var(--f7-page-text-color); background: var(--deneb-canvas);
    outline: none; transition: border-color 0.15s; box-sizing: border-box;
  }
  .field-input:focus { border-color: var(--f7-page-text-color); }
  .field-input::placeholder { color: var(--deneb-text-muted); }

  .spinner { width: 32px; height: 32px; border: 2.5px solid var(--deneb-divider); border-top-color: var(--f7-page-text-color); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .error { margin: 0; font-family: var(--deneb-sans); font-size: 13px; color: var(--deneb-negative); }
</style>

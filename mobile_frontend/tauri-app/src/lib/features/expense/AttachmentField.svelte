<script lang="ts">
  let {
    value = $bindable(''),
    label = 'Receipt',
    disabled = false,
  }: { value?: string; label?: string; disabled?: boolean } = $props()

  let input = $state<HTMLInputElement | null>(null)
  let error = $state('')
  const MAX_BYTES = 3 * 1024 * 1024

  function pick() {
    if (!disabled) input?.click()
  }

  function onFile(event: Event) {
    error = ''
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      error = 'Only images are supported'
      return
    }
    if (file.size > MAX_BYTES) {
      error = 'Image must be under 3 MB'
      return
    }
    const reader = new FileReader()
    reader.onload = () => { value = String(reader.result ?? '') }
    reader.onerror = () => { error = 'Could not read image' }
    reader.readAsDataURL(file)
    target.value = ''
  }

  function remove() {
    value = ''
    error = ''
  }
</script>

<div class="field">
  <span class="field-label">{label}</span>
  <input bind:this={input} class="hidden" type="file" accept="image/*" onchange={onFile} {disabled} />

  {#if value}
    <div class="preview">
      <img src={value} alt="Receipt attachment" />
      <div class="preview-info">
        <span class="preview-name">Receipt attached</span>
        <button class="preview-remove" onclick={remove} {disabled}>Remove</button>
      </div>
    </div>
  {:else}
    <button class="attach-btn" onclick={pick} {disabled}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="12" r="4" />
      </svg>
      <span>Attach receipt photo</span>
    </button>
  {/if}

  {#if error}<p class="error">{error}</p>{/if}
</div>

<style>
  .field { display: flex; flex-direction: column; gap: 6px; }
  .hidden { display: none; }

  .field-label {
    font-family: var(--deneb-mono);
    font-size: 12px; font-weight: 500;
    color: var(--deneb-text-secondary); letter-spacing: 0.02em;
  }

  .attach-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; height: 44px;
    border: 1px dashed var(--deneb-border); border-radius: 10px;
    background: var(--deneb-canvas);
    font-family: var(--deneb-sans); font-size: 14px; font-weight: 500;
    color: var(--deneb-text-secondary); cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: border-color 0.15s, color 0.15s;
  }
  .attach-btn:active { border-color: var(--deneb-ink); color: var(--deneb-ink); }
  .attach-btn:disabled { opacity: 0.4; cursor: default; }

  .preview {
    display: flex; align-items: center; gap: 12px;
    padding: 10px;
    border: 1px solid var(--deneb-border); border-radius: 10px;
    background: var(--deneb-canvas);
  }
  .preview img {
    width: 48px; height: 48px; object-fit: cover;
    border-radius: 8px; border: 1px solid var(--deneb-border); flex-shrink: 0;
  }
  .preview-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .preview-name { font-family: var(--deneb-sans); font-size: 13px; font-weight: 500; color: var(--deneb-ink); }
  .preview-remove {
    align-self: flex-start; border: none; background: transparent; padding: 0;
    font-family: var(--deneb-sans); font-size: 12px; font-weight: 500;
    color: var(--deneb-negative); cursor: pointer;
  }
  .preview-remove:disabled { opacity: 0.4; cursor: default; }

  .error { margin: 0; font-family: var(--deneb-sans); font-size: 12px; color: var(--deneb-negative); }
</style>

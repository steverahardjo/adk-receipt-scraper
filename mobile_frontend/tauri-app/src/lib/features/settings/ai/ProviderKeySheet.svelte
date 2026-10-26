<script lang="ts">
  import AIProviderLogo from './AIProviderLogo.svelte'
  import ConfirmSheet from '../ConfirmSheet.svelte'
  import { ai } from './ai.svelte'
  import type { Provider } from './ai.svelte'
  import { showToast } from '$lib/features/core/toast.svelte'

  let {
    opened = false,
    provider = null,
    onClose,
  }: { opened?: boolean; provider?: Provider | null; onClose?: () => void } = $props()

  let key = $state('')
  let showKey = $state(false)
  let busy = $state(false)
  let confirmRemove = $state(false)
  let transitioning = $state(false)
  let visible = $state(false)

  let connected = $derived(!!provider && ai.isConnected(provider.id))

  $effect(() => {
    if (opened && provider) {
      key = ''
      showKey = false
      visible = true
      requestAnimationFrame(() => requestAnimationFrame(() => { transitioning = true }))
    } else if (!opened) {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  async function save() {
    if (!provider || !key.trim()) return
    busy = true
    const ok = await ai.setKey(provider.id, key)
    busy = false
    if (ok) {
      showToast({ type: 'success', title: `${provider.name} connected`, duration: 2000 })
      onClose?.()
    } else {
      showToast({ type: 'error', title: 'Invalid API key', message: 'The key looks too short', duration: 2500 })
    }
  }

  async function remove() {
    if (!provider) return
    await ai.removeKey(provider.id)
    showToast({ type: 'success', title: `${provider.name} disconnected`, duration: 2000 })
    onClose?.()
  }
</script>

{#if visible && provider}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="head">
      <AIProviderLogo id={provider.id} size={40} />
      <div class="head-text">
        <span class="head-name">{provider.name}</span>
        <span class="head-status" class:ok={connected}>{connected ? 'Connected' : 'Not configured'}</span>
      </div>
    </div>

    {#if connected}
      <div class="saved">
        <span class="saved-label">Saved key</span>
        <span class="saved-value">{ai.maskedKey(provider.id)}</span>
      </div>
    {/if}

    <div class="field">
      <label class="field-label" for="pk-key">{connected ? 'Replace API key' : 'API key'}</label>
      <div class="key-row">
        <input
          id="pk-key"
          class="field-input"
          type={showKey ? 'text' : 'password'}
          placeholder={connected ? 'Enter a new key' : 'Paste your API key'}
          autocomplete="off"
          spellcheck="false"
          bind:value={key}
        />
        <button class="reveal" onclick={() => showKey = !showKey} aria-label={showKey ? 'Hide key' : 'Show key'}>
          {#if showKey}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
          {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          {/if}
        </button>
      </div>
    </div>

    <div class="actions">
      {#if connected}
        <button class="btn danger-text" onclick={() => confirmRemove = true}>Remove</button>
      {/if}
      <button class="btn primary" onclick={save} disabled={!key.trim() || busy}>{busy ? 'Validating...' : 'Validate & save'}</button>
    </div>
  </div>
{/if}

<ConfirmSheet
  opened={confirmRemove}
  title={`Remove ${provider?.name ?? ''} key?`}
  message="The stored API key and its models will be removed."
  confirmLabel="Remove key"
  onConfirm={remove}
  onClose={() => confirmRemove = false}
/>

<style>
  .backdrop { position: fixed; inset: 0; z-index: 16000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 16001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); max-height: 90dvh; overflow-y: auto;
    padding: 0 20px calc(20px + env(safe-area-inset-bottom, 0px));
  }
  .sheet.show { transform: translateY(0); }
  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border); margin: 10px auto 12px; }

  .head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  .head-text { display: flex; flex-direction: column; gap: 2px; }
  .head-name { font-family: var(--deneb-sans); font-size: 17px; font-weight: 600; color: var(--deneb-ink); }
  .head-status { font-family: var(--deneb-mono); font-size: 11px; color: var(--deneb-text-secondary); }
  .head-status.ok { color: var(--deneb-positive); }

  .saved {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; margin-bottom: 14px;
    border: 1px solid var(--deneb-border); border-radius: 10px; background: var(--deneb-canvas);
  }
  .saved-label { font-family: var(--deneb-mono); font-size: 11px; color: var(--deneb-text-secondary); }
  .saved-value { font-family: var(--deneb-mono); font-size: 13px; color: var(--deneb-ink); }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-family: var(--deneb-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.02em; color: var(--deneb-text-secondary); }
  .field-input {
    width: 100%; height: 44px; padding: 0 44px 0 14px;
    border: 1px solid var(--deneb-border); border-radius: 10px;
    font-family: var(--deneb-mono); font-size: 14px;
    color: var(--deneb-ink); background: var(--deneb-canvas);
    outline: none; transition: border-color 0.15s; box-sizing: border-box;
  }
  .field-input:focus { border-color: var(--deneb-ink); }
  .key-row { position: relative; display: flex; align-items: center; }
  .reveal {
    position: absolute; right: 6px;
    width: 34px; height: 34px; border: none; border-radius: 8px; background: transparent;
    color: var(--deneb-text-secondary); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }

  .actions { display: flex; gap: 10px; margin-top: 18px; }
  .btn {
    flex: 1; height: 48px; border-radius: 10px; border: none;
    font-family: var(--deneb-sans); font-size: 15px; font-weight: 600;
    cursor: pointer; -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
  }
  .btn.primary { background: var(--deneb-ink); color: var(--f7-page-bg-color); }
  .btn.primary:disabled { opacity: 0.4; }
  .btn.danger-text { flex: 0 0 auto; padding: 0 18px; background: transparent; border: 1px solid var(--deneb-border); color: var(--deneb-negative); }
  .btn:active:not(:disabled) { opacity: 0.85; }
</style>

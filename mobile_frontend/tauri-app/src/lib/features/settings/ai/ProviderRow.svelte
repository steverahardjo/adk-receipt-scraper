<script lang="ts">
  import { longpress } from '$lib/features/core/longpress'
  import { showToast } from '$lib/features/core/toast.svelte'
  import AIProviderLogo from './AIProviderLogo.svelte'
  import { ai } from './ai.svelte'
  import type { Provider } from './ai.svelte'

  let { provider, onManage }: { provider: Provider; onManage?: () => void } = $props()

  let draft = $state('')
  let busy = $state(false)
  let connected = $derived(ai.isConnected(provider.id))

  async function submit() {
    if (busy || !draft.trim()) return
    busy = true
    const ok = await ai.setKey(provider.id, draft)
    busy = false
    if (ok) {
      draft = ''
      showToast({ type: 'success', title: `${provider.name} connected`, duration: 2000 })
    } else {
      showToast({ type: 'error', title: 'Invalid API key', message: 'The key looks too short', duration: 2500 })
    }
  }
</script>

<div class="row" use:longpress={{ duration: 500, onLongPress: () => onManage?.() }}>
  <AIProviderLogo id={provider.id} />

  <div class="info">
    <span class="name">{provider.name}</span>
    <span class="desc">{connected ? ai.maskedKey(provider.id) : provider.description}</span>
  </div>

  {#if connected}
    <button class="check" onclick={onManage} aria-label={`${provider.name} connected`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" />
      </svg>
    </button>
  {:else}
    <div class="key-entry">
      <input
        class="key-input"
        type="password"
        placeholder="API key"
        autocomplete="off"
        spellcheck="false"
        bind:value={draft}
        onkeydown={(e) => { if (e.key === 'Enter') submit() }}
      />
      <button class="save" onclick={submit} disabled={!draft.trim() || busy} aria-label="Save API key">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </button>
    </div>
  {/if}
</div>

<style>
  .row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--deneb-rule);
    -webkit-tap-highlight-color: transparent;
  }
  .row:last-child { border-bottom: none; }

  .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .name { font-family: var(--deneb-sans); font-size: 15px; font-weight: 500; color: var(--deneb-ink); }
  .desc {
    font-family: var(--deneb-mono); font-size: 11px; color: var(--deneb-text-secondary);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .check {
    width: 36px; height: 36px; flex-shrink: 0;
    border: none; border-radius: 8px; background: transparent;
    color: var(--deneb-positive); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
  }
  .check:active { background: var(--deneb-canvas); }

  .key-entry { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .key-input {
    width: 116px; height: 36px; padding: 0 10px;
    border: 1px solid var(--deneb-border); border-radius: 8px;
    font-family: var(--deneb-mono); font-size: 12px;
    color: var(--deneb-ink); background: var(--deneb-canvas);
    outline: none; box-sizing: border-box;
  }
  .key-input:focus { border-color: var(--deneb-ink); }
  .key-input::placeholder { color: var(--deneb-text-muted); }

  .save {
    width: 36px; height: 36px; flex-shrink: 0;
    border: none; border-radius: 8px;
    background: var(--deneb-ink); color: var(--f7-page-bg-color);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
  }
  .save:disabled { opacity: 0.3; cursor: default; }
</style>

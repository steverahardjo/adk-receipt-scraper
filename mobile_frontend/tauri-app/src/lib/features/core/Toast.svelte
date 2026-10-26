<script lang="ts">
  import { Preloader } from 'framework7-svelte'
  import { getToastState, dismissToast } from './toast.svelte'

  let state = getToastState()

  function handleDismiss() {
    if (state.type !== 'loading') dismissToast()
  }
</script>

{#if state.visible}
  <div
    class="toast"
    class:toast-success={state.type === 'success'}
    class:toast-error={state.type === 'error'}
    class:toast-loading={state.type === 'loading'}
    onclick={handleDismiss}
    role="button"
    tabindex="0"
    onkeydown={(e) => { if (e.key === 'Enter') handleDismiss() }}
  >
    <div class="toast-icon">
      {#if state.type === 'success'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      {:else if state.type === 'error'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      {:else}
        <Preloader size={20} {...({ style: '--f7-preloader-color: var(--ds-neutral-0)' } as any)} />
      {/if}
    </div>
    <div class="toast-content">
      <div class="toast-title">{state.title}</div>
      {#if state.message}
        <div class="toast-message">{state.message}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .toast {
    position: fixed; top: 0; left: 12px; right: 12px; z-index: 20000;
    margin-top: calc(10px + env(safe-area-inset-top, 0px));
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-radius: var(--deneb-radius-md);
    box-shadow: var(--deneb-shadow-md);
    font-family: var(--deneb-sans);
    animation: slideDown 0.3s var(--deneb-ease);
    cursor: pointer;
  }
  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .toast-success { background: var(--toast-bg-success); color: var(--ds-neutral-0); }
  .toast-error { background: var(--toast-bg-error); color: var(--ds-neutral-0); }
  .toast-loading { background: var(--toast-bg-loading); color: var(--ds-neutral-0); }

  .toast-icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; }
  .toast-content { flex: 1; min-width: 0; }
  .toast-title { font-size: 14px; font-weight: 600; line-height: 1.4; }
  .toast-message { font-size: 12px; opacity: 0.8; margin-top: 2px; line-height: 1.4; }
</style>

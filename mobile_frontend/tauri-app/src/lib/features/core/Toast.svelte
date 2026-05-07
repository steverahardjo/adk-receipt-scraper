<script lang="ts">
  import { getToastState, dismissToast } from './toast.svelte'

  let state = getToastState()

  function handleDismiss() {
    if (state.type !== 'loading') {
      dismissToast()
    }
  }
</script>

{#if state.visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="toast-overlay"
    class:toast-success={state.type === 'success'}
    class:toast-error={state.type === 'error'}
    class:toast-loading={state.type === 'loading'}
    onclick={handleDismiss}
  >
    <div class="toast-icon">
      {#if state.type === 'success'}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      {:else if state.type === 'error'}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      {:else}
        <div class="spinner"></div>
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
  .toast-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20000;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    padding-top: calc(14px + env(safe-area-inset-top, 0px));
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    animation: slideDown 0.25s ease-out;
    cursor: pointer;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .toast-success {
    background: var(--toast-bg-success, #34c759);
    color: #fff;
  }

  .toast-error {
    background: var(--toast-bg-error, #ff3b30);
    color: #fff;
  }

  .toast-loading {
    background: var(--toast-bg-loading, #8e8e93);
    color: #fff;
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
  }

  .toast-content {
    flex: 1;
    min-width: 0;
  }

  .toast-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
  }

  .toast-message {
    font-size: 13px;
    opacity: 0.85;
    margin-top: 2px;
    line-height: 1.3;
  }

  .spinner {
    width: 22px;
    height: 22px;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>

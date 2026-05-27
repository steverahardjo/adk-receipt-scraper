<script lang="ts">
  import { getLoadingState } from './loading-overlay.svelte'

  let state = getLoadingState()
</script>

{#if state.visible}
  <div class="loading-overlay">
    <div class="loading-backdrop"></div>
    <div class="loading-content">
      <div class="spinner"></div>
      {#if state.message}
        <p class="loading-msg">{state.message}</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 21000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .loading-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(26, 28, 30, 0.45);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .loading-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .spinner {
    width: 44px;
    height: 44px;
    border: 3px solid rgba(46, 229, 175, 0.2);
    border-top-color: var(--f7-theme-color, #2ee5af);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-msg {
    margin: 0;
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--f7-page-text-color, #f0f0f3);
    letter-spacing: 0.01em;
    opacity: 0.8;
  }
</style>

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
    position: fixed; inset: 0; z-index: 21000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .loading-backdrop {
    position: absolute; inset: 0;
    background: rgba(244, 239, 227, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  :global(.dark) .loading-backdrop {
    background: rgba(23, 21, 17, 0.78);
  }
  .loading-content {
    position: relative;
    display: flex; flex-direction: column; align-items: center; gap: 20px;
  }
  .spinner {
    width: 40px; height: 40px;
    border: 2.5px solid var(--deneb-divider);
    border-top-color: var(--deneb-ink);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-msg {
    margin: 0;
    font-family: var(--deneb-mono);
    font-size: 12px; font-weight: 500;
    color: var(--deneb-text-secondary);
    letter-spacing: 0.02em;
  }
</style>

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
    background: rgba(251, 251, 250, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  :global(.dark) .loading-backdrop {
    background: rgba(24, 24, 26, 0.75);
  }
  .loading-content {
    position: relative;
    display: flex; flex-direction: column; align-items: center; gap: 20px;
  }
  .spinner {
    width: 40px; height: 40px;
    border: 2.5px solid #F0F0EE;
    border-top-color: #111111;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  :global(.dark) .spinner {
    border-color: rgba(255,255,255,0.06);
    border-top-color: #ECECEC;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-msg {
    margin: 0;
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 13px; font-weight: 500;
    color: var(--deneb-text-secondary, #787774);
    letter-spacing: 0.01em;
  }
</style>

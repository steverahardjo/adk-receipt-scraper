<script lang="ts">
  import { Preloader } from 'framework7-svelte'
  import { getLoadingState } from './loading-overlay.svelte'
  let state = getLoadingState()
</script>

{#if state.visible}
  <div class="loading-overlay">
    <div class="loading-backdrop"></div>
    <div class="loading-content">
      <Preloader size={40} {...({ style: '--f7-preloader-color: var(--deneb-ink)' } as any)} />
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
    background: rgba(250, 250, 250, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  :global(.dark) .loading-backdrop {
    background: rgba(15, 17, 21, 0.78);
  }
  .loading-content {
    position: relative;
    display: flex; flex-direction: column; align-items: center; gap: 20px;
  }
  .loading-msg {
    margin: 0;
    font-family: var(--deneb-mono);
    font-size: 12px; font-weight: 500;
    color: var(--deneb-text-secondary);
    letter-spacing: 0.02em;
  }
</style>

<script lang="ts">
  type FpState = 'idle' | 'scanning' | 'success' | 'failure'

  let { onScan }: { onScan?: () => void } = $props()

  let fpState = $state<FpState>('idle')

  export function setState(s: FpState) {
    fpState = s
  }

  function handleTap() {
    if (fpState === 'scanning') return
    fpState = 'scanning'
    onScan?.()
  }
</script>

<button class="fingerprint" class:scanning={fpState === 'scanning'} class:success={fpState === 'success'} class:failure={fpState === 'failure'} onclick={handleTap} aria-label="Touch ID">
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a10 10 0 0 0-7.07 2.93" />
    <path d="M12 6a6 6 0 0 0-4.24 1.76" />
    <path d="M12 10a2 2 0 0 0-1.41.59" />
    <path d="M12 14a2 2 0 0 1 1.41.59" />
    <path d="M12 18a2 2 0 0 0 1.41.59" />
    <path d="M19.07 4.93A10 10 0 0 1 22 12" />
    <path d="M17.66 7.34A6 6 0 0 1 18 12" />
    <path d="M20 21a2 2 0 0 1-4 0v-5" />
    <path d="M4 21a2 2 0 0 0 4 0v-5" />
    <path d="M8 12a4 4 0 0 1 8 0" />
  </svg>
  <span class="label">
    {#if fpState === 'scanning'}
      Scanning...
    {:else}
      Touch ID
    {/if}
  </span>
</button>

<style>
  .fingerprint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    border: none;
    background: none;
    cursor: pointer;
    color: #8e8e93;
    padding: 16px;
    border-radius: 20px;
    transition: color 0.2s, background 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  :global(.dark) .fingerprint {
    color: #636366;
  }

  .fingerprint:active {
    background: rgba(0, 0, 0, 0.04);
  }

  :global(.dark) .fingerprint:active {
    background: rgba(255, 255, 255, 0.06);
  }

  .fingerprint.success {
    color: #34c759;
  }

  :global(.dark) .fingerprint.success {
    color: #30d158;
  }

  .fingerprint.failure {
    color: #ff3b30;
  }

  :global(.dark) .fingerprint.failure {
    color: #ff453a;
  }

  .fingerprint.scanning {
    color: #006c50;
    animation: fpPulse 0.8s ease-in-out infinite;
  }

  :global(.dark) .fingerprint.scanning {
    color: #24e0ab;
  }

  @keyframes fpPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  .fingerprint svg {
    transition: transform 0.2s;
  }

  .fingerprint.scanning svg {
    animation: scanGlow 0.8s ease-in-out infinite;
  }

  @keyframes scanGlow {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(0, 108, 80, 0.3)); }
    50% { filter: drop-shadow(0 0 16px rgba(0, 108, 80, 0.6)); }
  }

  :global(.dark) .fingerprint.scanning svg {
    animation: scanGlowDark 0.8s ease-in-out infinite;
  }

  @keyframes scanGlowDark {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(36, 224, 171, 0.3)); }
    50% { filter: drop-shadow(0 0 16px rgba(36, 224, 171, 0.6)); }
  }

  .label {
    font-size: 13px;
    font-weight: 400;
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    letter-spacing: 0.02em;
  }
</style>

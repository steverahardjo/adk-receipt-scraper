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
    color: var(--deneb-text-secondary);
    padding: 16px;
    border-radius: var(--deneb-radius-lg);
    transition: color 0.2s, background 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  /* Theme pairs collapse — the tokens carry both palettes. Scanning reads as
     the brand accent (in progress), success/failure as status. */
  .fingerprint:active {
    background: var(--deneb-surface-2);
  }

  .fingerprint.success {
    color: var(--deneb-positive);
  }

  .fingerprint.failure {
    color: var(--deneb-negative);
  }

  .fingerprint.scanning {
    color: var(--deneb-accent);
    animation: fpPulse 0.8s ease-in-out infinite;
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

  /* currentColor follows the scanning state's accent, so one keyframe replaces
     the hard-coded light/dark teal glows. */
  @keyframes scanGlow {
    0%, 100% { filter: drop-shadow(0 0 4px currentColor); opacity: 0.7; }
    50% { filter: drop-shadow(0 0 14px currentColor); opacity: 1; }
  }

  .label {
    font-size: 13px;
    font-weight: 400;
    font-family: var(--deneb-sans);
    letter-spacing: 0.02em;
  }
</style>

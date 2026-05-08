<script lang="ts">
  import { goto } from '$app/navigation'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import Passcode from '$lib/features/core/Passcode.svelte'
  import Fingerprint from '$lib/features/core/Fingerprint.svelte'

  let fpRef = $state<Fingerprint>(null!)

  function onPasscodeSubmit(code: string) {
    return code === '111111'
  }

  function onPasscodeSuccess() {
    goto('/')
  }

  function onFingerprintScan() {
    fpRef?.setState('scanning')
    setTimeout(() => {
      fpRef?.setState('success')
      goto('/')
    }, 600)
  }
</script>

<BaseLayer noDrawer>
  <div class="lock-screen">
    <div class="brand">
      <svg class="logo" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <h1>Deneb</h1>
      <p>Enter passcode or use Touch ID</p>
    </div>

    <Fingerprint bind:this={fpRef} onScan={onFingerprintScan} />

    <div class="divider">
      <span></span>
      <span class="divider-text">or enter passcode</span>
      <span></span>
    </div>

    <Passcode onSubmit={onPasscodeSubmit} onSuccess={onPasscodeSuccess} />
  </div>
</BaseLayer>

<style>
  .lock-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 48px;
  }

  .brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 32px;
  }

  .logo {
    color: #007aff;
    margin-bottom: 4px;
  }

  :global(.dark) .logo {
    color: #0a84ff;
  }

  .brand h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: #000000;
    letter-spacing: -0.02em;
  }

  :global(.dark) .brand h1 {
    color: #ffffff;
  }

  .brand p {
    font-size: 15px;
    color: #8e8e93;
    margin: 0;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 240px;
    margin: 24px 0;
  }

  .divider span:first-child,
  .divider span:last-child {
    flex: 1;
    height: 1px;
    background: #e5e5ea;
  }

  :global(.dark) .divider span:first-child,
  :global(.dark) .divider span:last-child {
    background: #38383a;
  }

  .divider-text {
    font-size: 12px;
    color: #8e8e93;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
</style>

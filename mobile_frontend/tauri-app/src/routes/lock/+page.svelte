<script lang="ts">
  import { goto } from '$app/navigation'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import Passcode from '$lib/features/core/Passcode.svelte'
  import Fingerprint from '$lib/features/core/Fingerprint.svelte'
  import { lock } from '$lib/features/core/lock.svelte'

  let fpRef = $state<Fingerprint>(null!)

  let showBiometric = $derived(lock.biometricEnabled && lock.biometricAvailable)

  function onPasscodeSubmit(code: string) {
    return lock.verifyPasscode(code)
  }

  function onPasscodeSuccess() {
    lock.unlock()
    goto('/')
  }

  async function onFingerprintScan() {
    const ok = await lock.tryBiometric()
    if (ok) {
      fpRef?.setState('success')
      setTimeout(() => { lock.unlock(); goto('/') }, 350)
    } else {
      fpRef?.setState('failure')
      setTimeout(() => fpRef?.setState('idle'), 2000)
    }
  }
</script>

<BaseLayer noNavbar noDrawer>
  <div class="lock-screen">
    <div class="brand">
      <svg class="logo" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <h1>Deneb</h1>
      <p>{showBiometric ? 'Enter passcode or use biometrics' : 'Enter passcode to unlock'}</p>
    </div>
    {#if showBiometric}
      <Fingerprint bind:this={fpRef} onScan={onFingerprintScan} />
      <div class="divider"><span></span><span class="divider-text">or enter passcode</span><span></span></div>
    {/if}
    <Passcode onSubmit={onPasscodeSubmit} onSuccess={onPasscodeSuccess} />
  </div>
</BaseLayer>

<style>
  .lock-screen { display: flex; flex-direction: column; align-items: center; padding-top: 48px; }
  .brand { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 32px; }
  .logo { color: var(--deneb-ink); margin-bottom: 4px; }
  .brand h1 { font-size: 28px; font-weight: 700; margin: 0; color: var(--deneb-ink); letter-spacing: -0.02em; }
  .brand p { font-size: 15px; color: var(--deneb-text-secondary); margin: 0; }
  .divider { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 240px; margin: 24px 0; }
  .divider span:first-child, .divider span:last-child { flex: 1; height: 1px; background: var(--deneb-border); }
  .divider-text { font-size: 11px; color: var(--deneb-text-muted); font-family: var(--deneb-mono); letter-spacing: 0.04em; white-space: nowrap; }
</style>

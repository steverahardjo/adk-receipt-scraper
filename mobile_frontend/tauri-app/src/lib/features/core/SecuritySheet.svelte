<script lang="ts">
  import Passcode from './Passcode.svelte'
  import { lock } from './lock.svelte'

  let { opened = false, onClose }: { opened?: boolean; onClose?: () => void } = $props()

  type Step = 'main' | 'setup-new' | 'setup-confirm' | 'verify-disable' | 'verify-change'
  let step = $state<Step>('main')
  let pendingCode = $state('')
  let transitioning = $state(false)
  let visible = $state(false)

  let stepTitle = $derived(
    step === 'setup-new' ? 'Create passcode'
      : step === 'setup-confirm' ? 'Confirm passcode'
      : 'Enter current passcode'
  )
  let stepHint = $derived(
    step === 'setup-new' ? 'Choose a 6-digit passcode'
      : step === 'setup-confirm' ? 'Re-enter your new passcode'
      : step === 'verify-disable' ? 'Confirm to turn off App Lock'
      : 'Verify to change your passcode'
  )

  $effect(() => {
    if (opened) {
      step = 'main'
      pendingCode = ''
      visible = true
      lock.refreshBiometric()
      requestAnimationFrame(() => requestAnimationFrame(() => { transitioning = true }))
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  function close() { onClose?.() }
  function back() { step = 'main'; pendingCode = '' }

  async function toggleBiometric() {
    if (!lock.biometricAvailable || !lock.enabled) return
    await lock.setBiometric(!lock.biometricEnabled)
  }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={close} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="body">
      {#if step === 'main'}
        <h2 class="title headline-md">Security</h2>
        <div class="rows">
          <div class="row">
            <div class="row-text">
              <span class="row-label">App Lock</span>
              <span class="row-desc">{lock.enabled ? 'Passcode required to open Deneb' : 'Off'}</span>
            </div>
            <button class="switch" class:on={lock.enabled} role="switch" aria-checked={lock.enabled}
              onclick={() => step = lock.enabled ? 'verify-disable' : 'setup-new'} aria-label="Toggle app lock">
              <span></span>
            </button>
          </div>

          <div class="row">
            <div class="row-text">
              <span class="row-label">Biometrics</span>
              <span class="row-desc">
                {#if !lock.biometricAvailable}Not available on this device
                {:else if !lock.enabled}Enable App Lock first
                {:else}Use fingerprint or face to unlock{/if}
              </span>
            </div>
            <button class="switch" class:on={lock.biometricEnabled} role="switch" aria-checked={lock.biometricEnabled}
              disabled={!lock.biometricAvailable || !lock.enabled} onclick={toggleBiometric} aria-label="Toggle biometrics">
              <span></span>
            </button>
          </div>

          {#if lock.enabled}
            <button class="action" onclick={() => step = 'verify-change'}>
              <span>Change passcode</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <button class="action" onclick={() => { lock.lockNow(); close() }}>
              <span>Lock now</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </button>
          {/if}
        </div>
      {:else}
        <div class="step-head">
          <button class="back-btn" onclick={back} aria-label="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <span class="step-title">{stepTitle}</span>
          <span class="step-spacer"></span>
        </div>
        <p class="step-hint">{stepHint}</p>

        {#if step === 'setup-new'}
          <Passcode onSubmit={(code) => { pendingCode = code; return true }} onSuccess={() => { step = 'setup-confirm' }} />
        {:else if step === 'setup-confirm'}
          <Passcode
            onSubmit={async (code) => { if (code !== pendingCode) return false; await lock.setPasscode(code); return true }}
            onSuccess={() => { step = 'main' }} />
        {:else if step === 'verify-disable'}
          <Passcode
            onSubmit={async (code) => { const ok = await lock.verifyPasscode(code); if (ok) await lock.disable(); return ok }}
            onSuccess={() => { step = 'main' }} />
        {:else if step === 'verify-change'}
          <Passcode onSubmit={(code) => lock.verifyPasscode(code)} onSuccess={() => { step = 'setup-new' }} />
        {/if}
      {/if}
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 15000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 15001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); max-height: 90dvh; overflow-y: auto;
  }
  .sheet.show { transform: translateY(0); }

  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border); margin: 10px auto 6px; }

  .body { display: flex; flex-direction: column; gap: 8px; padding: 4px 20px 28px; }
  .title { margin: 8px 0 4px; }

  .rows { display: flex; flex-direction: column; }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--deneb-divider); }
  .row-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .row-label { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 15px; font-weight: 500; color: var(--f7-page-text-color); }
  .row-desc { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 12px; color: var(--deneb-text-secondary); }

  .switch {
    width: 46px; height: 28px; flex-shrink: 0;
    border: none; border-radius: 9999px; cursor: pointer; padding: 3px;
    background: var(--deneb-border); transition: background 0.15s;
    display: flex; align-items: center;
    -webkit-tap-highlight-color: transparent;
  }
  .switch span { width: 22px; height: 22px; border-radius: 50%; background: var(--deneb-surface); box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: transform 0.15s; }
  .switch.on { background: var(--f7-page-text-color); }
  .switch.on span { transform: translateX(18px); background: var(--f7-page-bg-color); }
  .switch:disabled { opacity: 0.35; cursor: default; }

  .action {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 14px 0; border: none; background: transparent;
    border-bottom: 1px solid var(--deneb-divider);
    font-family: 'Geist Sans', system-ui, sans-serif; font-size: 15px; font-weight: 500;
    color: var(--f7-page-text-color); cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .action:active { opacity: 0.6; }
  .action svg { color: var(--deneb-text-muted); }

  .step-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 0 0; }
  .back-btn {
    width: 34px; height: 34px; border: none; border-radius: 8px; background: transparent;
    color: var(--deneb-text-secondary); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
  }
  .back-btn:active { background: var(--deneb-divider); }
  .step-title { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 15px; font-weight: 600; color: var(--f7-page-text-color); }
  .step-spacer { width: 34px; }
  .step-hint { text-align: center; font-family: 'Geist Sans', system-ui, sans-serif; font-size: 13px; color: var(--deneb-text-secondary); margin: 2px 0 0; }
</style>

<script lang="ts">
  import PasswordField from '$lib/features/core/PasswordField.svelte'
  import { isPasswordValid } from '$lib/features/core/passwordRules'

  let {
    opened = false,
    onClose,
    onSaved,
  }: { opened?: boolean; onClose?: () => void; onSaved?: () => void } = $props()

  let current = $state('')
  let next = $state('')
  let confirm = $state('')
  let error = $state('')
  let saving = $state(false)
  let transitioning = $state(false)
  let visible = $state(false)

  $effect(() => {
    if (opened) {
      current = ''; next = ''; confirm = ''; error = ''
      visible = true
      requestAnimationFrame(() => requestAnimationFrame(() => { transitioning = true }))
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  async function save() {
    error = ''
    if (!current) { error = 'Enter your current password'; return }
    if (!isPasswordValid(next)) { error = 'New password does not meet the requirements'; return }
    if (next !== confirm) { error = 'New passwords do not match'; return }
    saving = true
    await new Promise((r) => setTimeout(r, 600))
    saving = false
    onSaved?.()
    onClose?.()
  }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>
    <h2 class="title headline-md">Change password</h2>

    <div class="fields">
      <PasswordField bind:value={current} id="pw-current" label="Current password" placeholder="Enter current password" />
      <PasswordField bind:value={next} id="pw-new" label="New password" />
      <PasswordField bind:value={confirm} id="pw-confirm" label="Confirm new password" placeholder="Re-enter new password" />
    </div>

    {#if error}<p class="error">{error}</p>{/if}

    <div class="actions">
      <button class="btn secondary" onclick={onClose}>Cancel</button>
      <button class="btn primary" onclick={save} disabled={saving}>{saving ? 'Saving...' : 'Update password'}</button>
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 16000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 16001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); max-height: 92dvh; overflow-y: auto;
    padding: 0 20px calc(20px + env(safe-area-inset-bottom, 0px));
  }
  .sheet.show { transform: translateY(0); }
  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border); margin: 10px auto 10px; }
  .title { margin: 0 0 16px; }

  .fields { display: flex; flex-direction: column; gap: 14px; }
  .error { margin: 12px 0 0; font-family: var(--deneb-sans); font-size: 13px; color: var(--deneb-negative); }

  .actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn {
    flex: 1; height: 48px; border-radius: 10px; border: none;
    font-family: var(--deneb-sans); font-size: 15px; font-weight: 600;
    cursor: pointer; -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
  }
  .btn.secondary { background: transparent; border: 1px solid var(--deneb-border); color: var(--deneb-ink); }
  .btn.primary { background: var(--deneb-ink); color: var(--f7-page-bg-color); }
  .btn.primary:disabled { opacity: 0.5; }
  .btn:active:not(:disabled) { opacity: 0.85; }
</style>

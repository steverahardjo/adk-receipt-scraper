<script lang="ts">
  import { Button, Link } from 'framework7-svelte'
  import { showToast, dismissToast } from '$lib/features/core/toast.svelte'
  import PasswordField from '$lib/features/core/PasswordField.svelte'
  import * as api from '$lib/features/core/api'

  let { onSuccess, onNavigateSignup }: { onSuccess?: (email: string) => void; onNavigateSignup?: () => void } = $props()
  let email = $state(''), password = $state(''), emailError = $state(''), passwordError = $state('')
  let submitting = $state(false), validated = $state(false)
  let emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))

  function validate() {
    validated = true; let valid = true; emailError = ''; passwordError = ''
    if (!email) { emailError = 'Required'; valid = false }
    else if (!emailValid) { emailError = 'Invalid email'; valid = false }
    if (!password) { passwordError = 'Required'; valid = false }
    return valid
  }
  function handleKeydown(event: KeyboardEvent) { if (event.key === 'Enter' && !submitting) handleLogin() }

  async function handleLogin() {
    if (!validate() || submitting) return
    submitting = true; showToast({ type: 'loading', title: 'Logging in...' })
    try { await api.login(email, password); dismissToast(); showToast({ type: 'success', title: 'Welcome back!', duration: 2000 }); onSuccess?.(email) }
    catch (e) { dismissToast(); const msg = e instanceof Error ? e.message : 'Login failed'; showToast({ type: 'error', title: 'Login failed', message: msg, duration: 3000 }) }
    finally { submitting = false }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="form-content">
  <h2 class="form-title headline-lg">Welcome back</h2>
  <p class="form-subtitle">Enter your details to continue</p>
  <div class="fields">
    <div class="field">
      <label class="field-label" for="login-email">Email</label>
      <div class="input-wrap">
        <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
        <input id="login-email" class="field-input" type="email" placeholder="your@email.com" bind:value={email} autocomplete="email" />
      </div>
      {#if emailError}<p class="field-error">{emailError}</p>{/if}
    </div>
    <PasswordField bind:value={password} id="login-password" label="Password" placeholder="Enter password" />
    {#if validated && passwordError}<p class="field-error">{passwordError}</p>{/if}
  </div>
  <Button fill large class="submit-btn" onclick={handleLogin} disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</Button>
  <div class="divider"><span></span><span class="divider-text">or</span><span></span></div>
  <Button outline large class="google-btn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg>
    <span>Continue with Google</span>
  </Button>
  <p class="footer-text">Don't have an account? <Link onclick={() => onNavigateSignup?.()}>Sign up</Link></p>
</div>

<style>
  .form-content { display: flex; flex-direction: column; gap: 20px; }
  .form-title { margin: 0; }
  .form-subtitle { font-size: 14px; color: var(--deneb-text-secondary); margin: -16px 0 0; }
  .fields { display: flex; flex-direction: column; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 13px; font-weight: 500; color: var(--f7-page-text-color); }
  .input-wrap { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 12px; color: var(--deneb-text-muted); pointer-events: none; }
  .field-input { width: 100%; height: 44px; padding: 0 12px 0 38px; border: 1px solid var(--deneb-border); border-radius: 8px; font-size: 15px; font-family: 'Geist Sans', system-ui, sans-serif; color: var(--f7-page-text-color); background: var(--deneb-canvas); outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .field-input:focus { border-color: var(--deneb-text-secondary); }
  .field-input::placeholder { color: var(--deneb-text-muted); }
  .field-error { font-size: 12px; color: var(--deneb-negative); margin: 0; }
  :global(.submit-btn) { width: 100%; height: 48px; font-size: 15px; font-weight: 500; margin-top: 4px; }
  .divider { display: flex; align-items: center; gap: 12px; }
  .divider span:first-child, .divider span:last-child { flex: 1; height: 1px; background: var(--deneb-border); }
  .divider-text { font-size: 11px; color: var(--deneb-text-muted); font-family: 'Geist Mono', monospace; letter-spacing: 0.04em; }
  :global(.google-btn) { width: 100%; height: 48px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; }
  .footer-text { text-align: center; font-size: 14px; color: var(--deneb-text-secondary); margin: 0; }
</style>

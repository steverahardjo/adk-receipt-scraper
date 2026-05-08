<script lang="ts">
  import { Button, Link } from 'framework7-svelte'
  import { showToast, dismissToast } from '$lib/features/core/toast.svelte'
  import PasswordField from '$lib/features/core/PasswordField.svelte'
  import * as api from '$lib/features/core/api'

  let { onSuccess, onNavigateSignup }: { onSuccess?: (email: string) => void; onNavigateSignup?: () => void } = $props()

  let email = $state('')
  let password = $state('')
  let emailError = $state('')
  let passwordError = $state('')
  let submitting = $state(false)
  let validated = $state(false)

  let emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))

  function validate() {
    validated = true
    let valid = true
    emailError = ''
    passwordError = ''
    if (!email) { emailError = 'Required'; valid = false }
    else if (!emailValid) { emailError = 'Invalid email'; valid = false }
    if (!password) { passwordError = 'Required'; valid = false }
    return valid
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !submitting) handleLogin()
  }

  async function handleLogin() {
    if (!validate() || submitting) return
    submitting = true
    showToast({ type: 'loading', title: 'Logging in...' })
    try {
      await api.login(email, password)
      dismissToast()
      showToast({ type: 'success', title: 'Welcome back!', duration: 2000 })
      onSuccess?.(email)
    } catch (e) {
      dismissToast()
      const msg = e instanceof Error ? e.message : 'Login failed'
      showToast({ type: 'error', title: 'Login failed', message: msg, duration: 3000 })
    } finally {
      submitting = false
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="form-content">
  <h2 class="form-title">Welcome back</h2>
  <p class="form-subtitle">Enter your details to continue</p>

  <div class="fields">
    <div class="field">
      <label class="field-label" for="login-email">Email</label>
      <div class="input-wrap">
        <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
        <input id="login-email" class="field-input" type="email" placeholder="your@email.com" bind:value={email} autocomplete="email" />
      </div>
      {#if emailError}
        <p class="field-error">{emailError}</p>
      {/if}
    </div>

    <PasswordField bind:value={password} id="login-password" label="Password" placeholder="Enter password" />

    {#if validated && passwordError}
      <p class="field-error">{passwordError}</p>
    {/if}
  </div>

  <Button fill large round class="submit-btn" onclick={handleLogin} disabled={submitting}>
    {submitting ? 'Logging in...' : 'Login'}
  </Button>

  <div class="divider">
    <span></span>
    <span class="divider-text">or</span>
    <span></span>
  </div>

  <Button outline large round class="google-btn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg>
    <span>Continue with Google</span>
  </Button>

  <p class="footer-text">
    Don&rsquo;t have an account?
    <Link onclick={() => onNavigateSignup?.()}>Sign up</Link>
  </p>
</div>

<style>
  .form-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
    color: #000000;
  }

  :global(.dark) .form-title {
    color: #ffffff;
  }

  .form-subtitle {
    font-size: 14px;
    color: #8e8e93;
    margin: -16px 0 0;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: #555555;
  }

  :global(.dark) .field-label {
    color: #a0a0a5;
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    color: #8e8e93;
    pointer-events: none;
  }

  .field-input {
    width: 100%;
    height: 44px;
    padding: 0 12px 0 38px;
    border: 1.5px solid #e5e5ea;
    border-radius: 10px;
    font-size: 15px;
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: #000000;
    background: #ffffff;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  :global(.dark) .field-input {
    border-color: #38383a;
    color: #ffffff;
    background: #1c1c1e;
  }

  .field-input:focus {
    border-color: #2ee5af;
    box-shadow: 0 0 0 3px rgba(46, 229, 175, 0.12);
  }

  :global(.dark) .field-input:focus {
    border-color: #24e0ab;
    box-shadow: 0 0 0 3px rgba(36, 224, 171, 0.12);
  }

  .field-input::placeholder {
    color: #aeaeb2;
  }

  .field-error {
    font-size: 12px;
    color: #ff3b30;
    margin: 0;
  }

  :global(.submit-btn) {
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
    margin-top: 4px;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
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
  }

  :global(.google-btn) {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
  }

  .footer-text {
    text-align: center;
    font-size: 14px;
    color: #8e8e93;
    margin: 0;
  }
</style>

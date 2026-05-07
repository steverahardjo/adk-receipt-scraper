<script lang="ts">
  import { Button, Link } from 'framework7-svelte'
  import { showToast, dismissToast } from '$lib/features/core/toast.svelte'

  let { onSuccess, onNavigateLogin }: { onSuccess?: (email: string) => void; onNavigateLogin?: () => void } = $props()

  let name = $state('')
  let email = $state('')
  let password = $state('')
  let confirmPassword = $state('')

  let nameError = $state('')
  let emailError = $state('')
  let passwordError = $state('')
  let confirmError = $state('')
  let submitting = $state(false)

  let hasUpper = $derived(/[A-Z]/.test(password))
  let hasNumber = $derived(/[0-9]/.test(password))
  let hasSpecial = $derived(/[@$!%*?&#^()_\-+=]/.test(password))
  let hasLength = $derived(password.length >= 14)
  let allPass = $derived(hasUpper && hasNumber && hasSpecial && hasLength)

  function validate() {
    let valid = true
    nameError = ''
    emailError = ''
    passwordError = ''
    confirmError = ''
    if (!name) { nameError = 'Required'; valid = false }
    if (!email) { emailError = 'Required'; valid = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailError = 'Invalid email'; valid = false }
    if (!password) { passwordError = 'Required'; valid = false }
    else if (!allPass) { passwordError = 'Does not meet requirements'; valid = false }
    if (!confirmPassword) { confirmError = 'Required'; valid = false }
    else if (password !== confirmPassword) { confirmError = 'Passwords do not match'; valid = false }
    return valid
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !submitting) handleSignup()
  }

  async function handleSignup() {
    if (!validate() || submitting) return
    submitting = true
    showToast({ type: 'loading', title: 'Creating account...' })
    try {
      await new Promise((r) => setTimeout(r, 1500))
      dismissToast()
      showToast({ type: 'success', title: 'Account created!', message: 'Check your email for the verification code', duration: 2500 })
      onSuccess?.(email)
    } catch {
      dismissToast()
      showToast({ type: 'error', title: 'Sign up failed', message: 'Try again later', duration: 3000 })
    } finally {
      submitting = false
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="form-content">
  <h2 class="form-title">Create account</h2>
  <p class="form-subtitle">Secure your account and continue</p>

  <div class="fields">
    <div class="field">
      <label class="field-label" for="signup-name">Full Name</label>
      <input id="signup-name" class="field-input" type="text" placeholder="Your full name" bind:value={name} />
      {#if nameError}
        <p class="field-error">{nameError}</p>
      {/if}
    </div>

    <div class="field">
      <label class="field-label" for="signup-email">Email</label>
      <input id="signup-email" class="field-input" type="email" placeholder="your@email.com" bind:value={email} />
      {#if emailError}
        <p class="field-error">{emailError}</p>
      {/if}
    </div>

    <div class="field">
      <label class="field-label" for="signup-password">Password</label>
      <input id="signup-password" class="field-input" type="password" placeholder="Enter a strong password" bind:value={password} />
      {#if password.length > 0}
        <div class="rules">
          <p class="rule" class:met={hasLength}><span class="bullet">•</span> At least 14 characters</p>
          <p class="rule" class:met={hasUpper}><span class="bullet">•</span> One uppercase letter</p>
          <p class="rule" class:met={hasNumber}><span class="bullet">•</span> One number</p>
          <p class="rule" class:met={hasSpecial}><span class="bullet">•</span> One special character</p>
        </div>
      {/if}
      {#if passwordError}
        <p class="field-error">{passwordError}</p>
      {/if}
    </div>

    <div class="field">
      <label class="field-label" for="signup-confirm">Confirm Password</label>
      <input id="signup-confirm" class="field-input" type="password" placeholder="Re-enter password" bind:value={confirmPassword} />
      {#if confirmError}
        <p class="field-error">{confirmError}</p>
      {/if}
    </div>
  </div>

  <Button fill large round class="submit-btn" onclick={handleSignup} disabled={submitting}>
    {submitting ? 'Creating account...' : 'Create account'}
  </Button>

  <p class="footer-text">
    Already have an account?
    <Link onclick={() => onNavigateLogin?.()}>Log in</Link>
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

  .field-input {
    width: 100%;
    height: 44px;
    padding: 0 12px;
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
    border-color: #007aff;
  }

  :global(.dark) .field-input:focus {
    border-color: #0a84ff;
  }

  .field-input::placeholder {
    color: #aeaeb2;
  }

  .field-error {
    font-size: 12px;
    color: #ff3b30;
    margin: 0;
  }

  .rules {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 2px;
  }

  .rule {
    margin: 0;
    font-size: 13px;
    color: #8e8e93;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .rule.met {
    color: #34c759;
  }

  :global(.dark) .rule.met {
    color: #30d158;
  }

  .bullet {
    display: inline-block;
    width: 8px;
  }

  :global(.submit-btn) {
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
    margin-top: 4px;
  }

  .footer-text {
    text-align: center;
    font-size: 14px;
    color: #8e8e93;
    margin: 0;
  }
</style>

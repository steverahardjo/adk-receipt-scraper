<script lang="ts">
  import { Button, Link } from 'framework7-svelte'
  import PasswordField from '$lib/features/core/PasswordField.svelte'
  import OtpInput from './OtpInput.svelte'
  import { createSignupState } from './useSignup.svelte'

  let { onSuccess, onNavigateLogin }: { onSuccess?: (email: string) => void; onNavigateLogin?: () => void } = $props()

  const s = createSignupState((email) => onSuccess?.(email))

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && s.canSubmit && !s.submitting) s.signup()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="form-content">
  <h2 class="form-title">Create account</h2>
  <p class="form-subtitle">Secure your account and continue</p>

  <div class="fields">
    <div class="field">
      <label class="field-label" for="signup-name">Full Name</label>
      <input
        id="signup-name"
        class="field-input"
        type="text"
        placeholder="Your full name"
        bind:value={s.name}
        autocomplete="name"
      />
      {#if s.nameError}
        <p class="field-error">{s.nameError}</p>
      {/if}
    </div>

    <div class="field">
      <label class="field-label" for="signup-email">Email</label>
      <input
        id="signup-email"
        class="field-input"
        type="email"
        placeholder="your@email.com"
        bind:value={s.email}
        autocomplete="email"
      />
      {#if s.emailError}
        <p class="field-error">{s.emailError}</p>
      {/if}
    </div>

    <PasswordField bind:value={s.password} id="signup-password" />

    <OtpInput
      email={s.email}
      disabled={!s.emailValid || !s.passwordValid}
      onSend={s.sendOtp}
      onChange={(code) => s.otp = code}
    />
  </div>

  {#if s.error}
    <p class="form-error">{s.error}</p>
  {/if}

  <Button fill large round class="submit-btn" onclick={s.signup} disabled={!s.canSubmit}>
    {#if s.submitting}
      <span class="btn-inner">
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
        </svg>
        Creating account...
      </span>
    {:else}
      Create account
    {/if}
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

  .form-error {
    font-size: 13px;
    color: #ff3b30;
    margin: -4px 0;
    text-align: center;
  }

  :global(.submit-btn) {
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
    margin-top: 4px;
  }

  .btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .footer-text {
    text-align: center;
    font-size: 14px;
    color: #8e8e93;
    margin: 0;
  }
</style>

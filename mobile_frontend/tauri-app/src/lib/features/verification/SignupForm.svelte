<script lang="ts">
  import { Button, Link, Preloader } from 'framework7-svelte'
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
  <h2 class="form-title headline-lg">Create account</h2>
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

  <Button fill large round {...({ class: 'submit-btn' } as any)} onclick={s.signup} disabled={!s.canSubmit}>
    {#if s.submitting}
      <span class="btn-inner">
        <Preloader size={16} {...({ style: '--f7-preloader-color: currentColor' } as any)} />
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
    margin: 0;
  }

  .form-subtitle {
    font-size: 14px;
    color: var(--deneb-text-secondary);
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
    color: var(--deneb-text-secondary);
  }

  /* One token set covers both themes, so the :global(.dark) pairs are gone.
     Border radius follows the shared radius scale. */
  .field-input {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border: 1.5px solid var(--deneb-border);
    border-radius: var(--deneb-radius-sm);
    font-size: 15px;
    font-family: var(--deneb-sans);
    color: var(--deneb-ink);
    background: var(--deneb-surface);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .field-input:focus {
    border-color: var(--deneb-accent);
  }

  .field-input::placeholder {
    color: var(--deneb-text-muted);
  }

  .field-error {
    font-size: 12px;
    color: var(--deneb-negative);
    margin: 0;
  }

  .form-error {
    font-size: 13px;
    color: var(--deneb-negative);
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

  .footer-text {
    text-align: center;
    font-size: 14px;
    color: var(--deneb-text-secondary);
    margin: 0;
  }
</style>

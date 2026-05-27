<script lang="ts">
  import { fade } from 'svelte/transition'
  import { showToast } from '$lib/features/core/toast.svelte'
  import LoginForm from '$lib/features/verification/LoginForm.svelte'
  import SignupForm from '$lib/features/verification/SignupForm.svelte'
  import OtpVerify from '$lib/features/verification/OtpVerify.svelte'

  type AuthMode = 'login' | 'signup' | 'otp'
  let mode = $state<AuthMode>('login'), pendingEmail = $state('')

  function onSignupSuccess(_email: string) { showToast({ type: 'success', title: 'Account created!', duration: 2500 }); mode = 'login' }
  function onLoginSuccess(email: string) { pendingEmail = email; mode = 'otp' }
  function onVerified() { mode = 'login' }
</script>

<div class="page-wrap">
  <div class="auth-card">
    <div class="brand">
      <svg class="brand-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <h1>Deneb</h1>
    </div>
    {#key mode}
      <div in:fade={{ duration: 200 }}>
        {#if mode === 'login'}<LoginForm onSuccess={onLoginSuccess} onNavigateSignup={() => mode = 'signup'} />
        {:else if mode === 'signup'}<SignupForm onSuccess={onSignupSuccess} onNavigateLogin={() => mode = 'login'} />
        {:else if mode === 'otp'}<OtpVerify email={pendingEmail} onSuccess={onVerified} onBack={() => mode = 'login'} />{/if}
      </div>
    {/key}
  </div>
</div>

<style>
  .page-wrap { display: flex; align-items: center; justify-content: center; min-height: 100dvh; padding: 24px 16px; background: var(--deneb-canvas); }
  .auth-card { width: 100%; max-width: 400px; background: var(--deneb-surface); border-radius: 12px; padding: 32px 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); border: 1px solid var(--deneb-border); }
  .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .brand-icon { color: #111111; }
  :global(.dark) .brand-icon { color: #ECECEC; }
  .brand h1 { font-size: 22px; font-weight: 700; margin: 0; color: var(--f7-page-text-color); letter-spacing: -0.02em; }
</style>

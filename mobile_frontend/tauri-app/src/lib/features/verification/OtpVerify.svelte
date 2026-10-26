<script lang="ts">
  import { Button, Link } from 'framework7-svelte'
  import { showToast } from '$lib/features/core/toast.svelte'

  let { email, onSuccess, onBack }: { email: string; onSuccess?: () => void; onBack?: () => void } = $props()

  let digits = $state(['', '', '', '', '', ''])
  let timer = $state(60)
  let timerInterval: ReturnType<typeof setInterval> | undefined

  $effect(() => {
    timerInterval = setInterval(() => {
      if (timer > 0) timer--
    }, 1000)
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  })

  function handleInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement
    const val = input.value.replace(/\D/g, '')
    if (val) {
      digits[index] = val.slice(-1)
      const next = document.getElementById(`otp-${index + 1}`)
      if (next && index < 5) next.focus()
    }
  }

  function handleKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      if (prev) prev.focus()
    }
    if (event.key === 'Enter' && isComplete()) handleVerify()
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const data = event.clipboardData?.getData('text') ?? ''
    const nums = data.replace(/\D/g, '').slice(0, 6).split('')
    for (let i = 0; i < 6; i++) digits[i] = nums[i] ?? ''
    const lastIdx = Math.min(nums.length, 5)
    document.getElementById(`otp-${lastIdx}`)?.focus()
  }

  function isComplete() {
    return digits.every((d) => d !== '')
  }

  async function handleVerify() {
    if (!isComplete()) {
      showToast({ type: 'error', title: 'Incomplete code', message: 'Enter all 6 digits', duration: 2000 })
      return
    }
    showToast({ type: 'loading', title: 'Verifying...' })
    try {
      await new Promise((r) => setTimeout(r, 1000))
      showToast({ type: 'success', title: 'Verified!', duration: 2000 })
      onSuccess?.()
    } catch {
      showToast({ type: 'error', title: 'Invalid code', message: 'Try again', duration: 3000 })
    }
  }

  function handleResend() {
    digits = ['', '', '', '', '', '']
    timer = 60
    showToast({ type: 'success', title: 'Code resent to', message: email, duration: 2500 })
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }
</script>

<div class="form-content">
  <div class="back-row">
    <Link onclick={() => onBack?.()}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
      <span>Back</span>
    </Link>
  </div>

  <h2 class="form-title headline-lg">Verify Email</h2>
  <p class="form-subtitle">Enter the 6-digit code sent to<br /><strong>{email}</strong></p>

  <div class="otp-row" onpaste={handlePaste}>
    {#each digits as _, i}
      <input
        id="otp-{i}"
        type="tel"
        maxlength={1}
        inputmode="numeric"
        pattern="[0-9]"
        autocomplete="one-time-code"
        value={digits[i]}
        oninput={(e) => handleInput(i, e)}
        onkeydown={(e) => handleKeydown(i, e)}
        class="otp-box"
        class:filled={digits[i] !== ''}
      />
    {/each}
  </div>

  <Button fill large round {...({ class: 'submit-btn' } as any)} onclick={handleVerify} disabled={!isComplete()}>
    Verify
  </Button>

  <p class="resend-text">
    {#if timer > 0}
      Resend code in {formatTime(timer)}
    {:else}
      <Link onclick={handleResend}>Resend Code</Link>
    {/if}
  </p>
</div>

<style>
  .form-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .back-row {
    align-self: flex-start;
    margin-bottom: -8px;
  }

  .form-title {
    margin: 0;
  }

  .form-subtitle {
    font-size: 14px;
    color: var(--deneb-text-secondary);
    margin: -20px 0 0;
    text-align: center;
    line-height: 1.4;
  }

  .form-subtitle strong {
    color: var(--deneb-ink);
  }

  .otp-row {
    display: flex;
    justify-content: center;
    gap: 8px;
    min-width: 0;
  }

  /* Six boxes must fit a 320px screen: they share the row and cap at 46px
     instead of forcing 6x44px + gaps of fixed width. Tokens replace the old
     light/dark hex pairs, so the :global(.dark) overrides are gone. */
  .otp-box {
    flex: 1 1 0;
    min-width: 0;
    max-width: 46px;
    height: 52px;
    border: 1.5px solid var(--deneb-border);
    border-radius: var(--deneb-radius-sm);
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    font-family: var(--deneb-mono);
    color: var(--deneb-ink);
    background: var(--deneb-surface);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    caret-color: var(--deneb-accent);
  }

  .otp-box:focus {
    border-color: var(--deneb-accent);
    box-shadow: 0 0 0 3px var(--deneb-accent-bg);
  }

  .otp-box.filled {
    border-color: var(--deneb-positive);
    background: var(--deneb-positive-bg);
  }

  :global(.submit-btn) {
    width: 100%;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
  }

  .resend-text {
    font-size: 14px;
    color: var(--deneb-text-secondary);
    text-align: center;
    margin: 0;
  }
</style>

<script lang="ts">
  import { Button, Preloader } from 'framework7-svelte'

  let {
    email,
    onSend,
    onChange,
    disabled = false,
    duration = 60,
  }: {
    email: string
    onSend: (email: string) => Promise<void>
    onChange: (code: string) => void
    disabled?: boolean
    duration?: number
  } = $props()

  let otp = $state('')
  let sending = $state(false)
  let timeLeft = $state(0)
  let timerInterval: ReturnType<typeof setInterval> | undefined

  let isCounting = $derived(timeLeft > 0)

  $effect(() => {
    if (!isCounting) {
      if (timerInterval) clearInterval(timerInterval)
      timerInterval = undefined
      return
    }
    timerInterval = setInterval(() => {
      timeLeft = timeLeft - 1
    }, 1000)
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  })

  function handleDigitInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement
    const val = input.value.replace(/\D/g, '')
    if (val) {
      otp = otp.slice(0, index) + val.slice(-1) + otp.slice(index + 1)
      const next = document.getElementById(`so-otp-${index + 1}`)
      if (next && index < 5) next.focus()
    }
    onChange(otp)
  }

  function handleDigitKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`so-otp-${index - 1}`)
      if (prev) prev.focus()
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const data = event.clipboardData?.getData('text') ?? ''
    const nums = data.replace(/\D/g, '').slice(0, 6)
    otp = nums.padEnd(6, '').slice(0, 6)
    onChange(otp)
    const lastIdx = Math.min(nums.length, 5)
    document.getElementById(`so-otp-${lastIdx}`)?.focus()
  }

  async function handleSend() {
    if (disabled || sending || isCounting || !email) return
    sending = true
    try {
      await onSend(email)
      timeLeft = duration
    } finally {
      sending = false
    }
  }

  function handleOtpChange() {
    onChange(otp)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }
</script>

<div class="otp-section">
  <Button
    fill
    large
    round
    {...({ class: 'otp-send-btn' } as any)}
    onclick={handleSend}
    disabled={disabled || sending || isCounting || !email}
  >
    {#if sending}
      <span class="btn-inner">
        <Preloader size={16} {...({ style: '--f7-preloader-color: currentColor' } as any)} />
        Sending...
      </span>
    {:else if isCounting}
      Resend in {formatTime(timeLeft)}
    {:else}
      Send verification code
    {/if}
  </Button>

  {#if isCounting}
    <div class="otp-row" onpaste={handlePaste}>
      {#each Array(6) as _, i}
        <input
          id="so-otp-{i}"
          type="tel"
          maxlength={1}
          inputmode="numeric"
          pattern="[0-9]"
          autocomplete="one-time-code"
          value={otp[i] ?? ''}
          oninput={(e) => handleDigitInput(i, e)}
          onkeydown={(e) => handleDigitKeydown(i, e)}
          onchange={handleOtpChange}
          class="otp-box"
          class:filled={otp[i] !== undefined && otp[i] !== ''}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .otp-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  :global(.otp-send-btn) {
    width: 100%;
    height: 44px;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
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
</style>

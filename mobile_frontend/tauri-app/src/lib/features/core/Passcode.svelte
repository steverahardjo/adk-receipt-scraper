<script lang="ts">
  import { tick } from 'svelte'

  let {
    length = 6,
    onSubmit,
    onSuccess,
  }: {
    length?: number
    onSubmit?: (code: string) => boolean | Promise<boolean>
    onSuccess?: () => void
  } = $props()

  let digits = $state<string[]>([])
  let result = $state<'success' | 'failure' | null>(null)
  let shake = $state(false)

  let filled = $derived(digits.length)
  let isComplete = $derived(filled === length)

  function press(n: number) {
    if (isComplete || result) return
    digits = [...digits, String(n)]
    if (digits.length === length) {
      checkCode(digits.join(''))
    }
  }

  async function checkCode(code: string) {
    // A rejecting onSubmit (e.g. Web Crypto unavailable while setting a
    // passcode) used to leave the keypad filled and inert with no feedback.
    let ok = false
    try {
      ok = (await onSubmit?.(code)) ?? false
    } catch {
      ok = false
    }
    if (ok) {
      result = 'success'
      await tick()
      await new Promise(r => setTimeout(r, 400))
      result = null
      digits = []
      onSuccess?.()
    } else {
      result = 'failure'
      shake = true
      await tick()
      await new Promise(r => setTimeout(r, 1000))
      shake = false
      result = null
      digits = []
    }
  }

  function backspace() {
    if (digits.length === 0 || result) return
    digits = digits.slice(0, -1)
  }
</script>

<div class="passcode" class:shake>
  <div class="dots">
    {#each Array(length) as _, i}
      <div
        class="dot"
        class:filled={i < filled}
        class:current={i === filled}
        class:success={result === 'success'}
        class:failure={result === 'failure'}
      ></div>
    {/each}
  </div>

  {#if result === 'failure'}
    <p class="error-label">Wrong Passcode</p>
  {/if}

  <div class="keypad">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
      <button class="key" onclick={() => press(n)}>{n}</button>
    {/each}
    <div class="key empty"></div>
    <button class="key" onclick={() => press(0)}>0</button>
    <button class="key key-back" onclick={backspace} disabled={filled === 0} aria-label="Delete">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
        <line x1="18" y1="9" x2="12" y2="15" />
        <line x1="12" y1="9" x2="18" y2="15" />
      </svg>
    </button>
  </div>
</div>

<style>
  .passcode {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
    padding: 32px 16px;
    user-select: none;
  }

  .passcode.shake {
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-12px); }
    40% { transform: translateX(12px); }
    60% { transform: translateX(-8px); }
    80% { transform: translateX(8px); }
  }

  .dots {
    display: flex;
    gap: 14px;
  }

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--deneb-border-strong);
    transition: background 0.15s, transform 0.15s;
  }

  /* Progress reads as the brand accent; success/failure as status. */
  .dot.filled {
    background: var(--deneb-accent);
    transform: scale(1.15);
  }

  .dot.success {
    background: var(--deneb-positive) !important;
    transform: scale(1.2) !important;
  }

  .dot.failure {
    background: var(--deneb-negative) !important;
    transform: scale(1.2) !important;
  }

  .dot.current {
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .error-label {
    margin: -40px 0 0;
    font-size: 14px;
    color: var(--deneb-negative);
    font-weight: 500;
    font-family: var(--deneb-sans);
    text-align: center;
    animation: fadeIn 0.15s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .keypad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 280px;
  }

  .key {
    aspect-ratio: 1;
    border: none;
    border-radius: 50%;
    background: var(--deneb-surface-2);
    color: var(--deneb-ink);
    font-size: 26px;
    font-weight: 400;
    font-family: var(--deneb-sans);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s;
    -webkit-tap-highlight-color: transparent;
  }

  .key:active {
    background: var(--deneb-border-strong);
  }

  .key:disabled {
    opacity: 0.3;
  }

  .key.empty {
    background: transparent;
    pointer-events: none;
  }

  .key-back {
    font-size: 20px;
  }
</style>

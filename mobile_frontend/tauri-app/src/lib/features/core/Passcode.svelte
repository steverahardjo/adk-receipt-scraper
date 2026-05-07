<script lang="ts">
  import { tick } from 'svelte'

  let {
    length = 6,
    onSubmit,
    onSuccess,
  }: {
    length?: number
    onSubmit?: (code: string) => boolean
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
    const ok = onSubmit?.(code) ?? false
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
    background: #e5e5ea;
    transition: background 0.15s, transform 0.15s;
  }

  :global(.dark) .dot {
    background: #38383a;
  }

  .dot.filled {
    background: #006c50;
    transform: scale(1.15);
  }

  :global(.dark) .dot.filled {
    background: #24e0ab;
  }

  .dot.success {
    background: #34c759 !important;
    transform: scale(1.2) !important;
  }

  :global(.dark) .dot.success {
    background: #30d158 !important;
  }

  .dot.failure {
    background: #ff3b30 !important;
    transform: scale(1.2) !important;
  }

  :global(.dark) .dot.failure {
    background: #ff453a !important;
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
    color: #ff3b30;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    text-align: center;
    animation: fadeIn 0.15s ease-out;
  }

  :global(.dark) .error-label {
    color: #ff453a;
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
    background: #e5e5ea;
    color: #000000;
    font-size: 26px;
    font-weight: 400;
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s;
    -webkit-tap-highlight-color: transparent;
  }

  :global(.dark) .key {
    background: #38383a;
    color: #ffffff;
  }

  .key:active {
    background: #d1d1d6;
  }

  :global(.dark) .key:active {
    background: #48484a;
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

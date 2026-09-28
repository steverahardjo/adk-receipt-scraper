<script lang="ts">
  import type { BudgetCategory } from './budgets.svelte'

  let {
    opened = false,
    category = null,
    onClose,
    onSave,
  }: {
    opened?: boolean
    category?: BudgetCategory | null
    onClose?: () => void
    onSave?: (limit: number) => void
  } = $props()

  let value = $state('')
  let visible = $state(false)
  let show = $state(false)

  $effect(() => {
    if (opened) {
      value = String(category?.limit ?? '')
      visible = true
      requestAnimationFrame(() => requestAnimationFrame(() => (show = true)))
    } else {
      show = false
      const t = setTimeout(() => (visible = false), 250)
      return () => clearTimeout(t)
    }
  })

  let numeric = $derived(Number(value.replace(/[^0-9]/g, '')) || 0)
  let formatted = $derived('Rp ' + numeric.toLocaleString('id-ID'))

  const presets = [500000, 1000000, 2000000, 5000000]

  function submit() {
    onSave?.(numeric)
    onClose?.()
  }
</script>

{#if visible}
  <div class="backdrop" class:show onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show role="dialog" aria-label="Set monthly limit">
    <div class="handle"></div>

    <div class="head">
      <span class="emoji">{category?.emoji ?? '💰'}</span>
      <div class="head-text">
        <span class="head-title">{category?.name ?? 'Category'}</span>
        <span class="head-sub">Monthly limit</span>
      </div>
    </div>

    <div class="display">{formatted}</div>

    <input
      class="input"
      type="text"
      inputmode="numeric"
      aria-label="Monthly limit in rupiah"
      placeholder="0"
      bind:value
      onkeydown={(e) => { if (e.key === 'Enter') submit() }}
    />

    <div class="presets">
      {#each presets as p}
        <button class="preset" class:on={numeric === p} onclick={() => (value = String(p))}>
          {p >= 1000000 ? `${p / 1000000}jt` : `${p / 1000}k`}
        </button>
      {/each}
    </div>

    <button class="save" onclick={submit}>Save limit</button>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed; inset: 0; z-index: 14000;
    background: rgba(28, 22, 10, 0.38);
    opacity: 0; transition: opacity var(--deneb-dur) var(--deneb-ease-standard);
  }
  :global(.dark) .backdrop { background: rgba(0, 0, 0, 0.6); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 14001;
    background: var(--deneb-surface);
    border-radius: var(--deneb-radius-sheet) var(--deneb-radius-sheet) 0 0;
    transform: translateY(100%);
    transition: transform 0.35s var(--deneb-ease);
    box-shadow: var(--deneb-shadow-lg);
    padding: 0 20px calc(24px + env(safe-area-inset-bottom, 0px));
  }
  .sheet.show { transform: translateY(0); }

  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border-strong); margin: 10px auto 14px; }

  .head { display: flex; align-items: center; gap: 12px; }
  .emoji {
    display: flex; align-items: center; justify-content: center;
    width: 46px; height: 46px; flex-shrink: 0;
    border-radius: var(--deneb-radius-sm);
    background: var(--deneb-surface-2);
    font-size: 22px;
  }
  .head-text { display: flex; flex-direction: column; gap: 1px; }
  .head-title { font-family: var(--deneb-sans); font-size: 17px; font-weight: 600; color: var(--deneb-ink); }
  .head-sub { font-family: var(--deneb-mono); font-size: 11px; letter-spacing: 0.03em; text-transform: uppercase; color: var(--deneb-text-muted); }

  .display {
    margin: 20px 0 10px;
    font-family: var(--deneb-sans);
    font-size: 34px; font-weight: 700; letter-spacing: -0.03em;
    color: var(--deneb-ink);
    font-variant-numeric: tabular-nums;
    text-align: center;
  }

  .input {
    width: 100%; height: 52px;
    padding: 0 16px;
    border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-sm);
    background: var(--deneb-surface-2);
    color: var(--deneb-ink);
    font-family: var(--deneb-mono);
    font-size: 17px; font-weight: 600;
    text-align: center;
    outline: none;
    box-sizing: border-box;
    transition: border-color var(--deneb-dur-fast) var(--deneb-ease), box-shadow var(--deneb-dur-fast) var(--deneb-ease);
  }
  .input:focus { border-color: var(--deneb-accent); box-shadow: 0 0 0 3px var(--deneb-accent-bg); }
  .input::placeholder { color: var(--deneb-text-muted); }

  .presets { display: flex; gap: 8px; margin: 14px 0 18px; }
  .preset {
    flex: 1; height: 44px;
    border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-pill);
    background: transparent;
    color: var(--deneb-ink);
    font-family: var(--deneb-mono);
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--deneb-dur-fast) var(--deneb-ease), color var(--deneb-dur-fast) var(--deneb-ease), border-color var(--deneb-dur-fast) var(--deneb-ease);
  }
  .preset.on { background: var(--deneb-accent-bg); color: var(--deneb-accent); border-color: var(--deneb-accent); }
  .preset:active { transform: scale(0.97); }

  .save {
    width: 100%; height: 50px;
    border: none; border-radius: var(--deneb-radius-sm);
    background: var(--deneb-accent); color: var(--deneb-accent-text);
    font-family: var(--deneb-sans);
    font-size: 16px; font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform var(--deneb-dur-fast) var(--deneb-ease), opacity var(--deneb-dur-fast) var(--deneb-ease);
  }
  .save:active { transform: scale(0.98); opacity: 0.9; }
</style>

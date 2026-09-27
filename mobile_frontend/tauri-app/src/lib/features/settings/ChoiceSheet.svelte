<script lang="ts">
  interface ChoiceOption {
    value: string
    label?: string
    desc?: string
  }

  let {
    opened = false,
    title = 'Select',
    options = [],
    value = '',
    onSelect,
    onClose,
  }: {
    opened?: boolean
    title?: string
    options?: ChoiceOption[]
    value?: string
    onSelect?: (value: string) => void
    onClose?: () => void
  } = $props()

  let transitioning = $state(false)
  let visible = $state(false)

  $effect(() => {
    if (opened) {
      visible = true
      requestAnimationFrame(() => requestAnimationFrame(() => { transitioning = true }))
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  function choose(next: string) {
    onSelect?.(next)
    onClose?.()
  }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>
    <h2 class="title headline-md">{title}</h2>
    <div class="options">
      {#each options as option}
        <button class="option" class:active={option.value === value} onclick={() => choose(option.value)}>
          <div class="option-text">
            <span class="option-label">{option.label ?? option.value}</span>
            {#if option.desc}<span class="option-desc">{option.desc}</span>{/if}
          </div>
          {#if option.value === value}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          {/if}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 15000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 15001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); max-height: 85dvh; overflow-y: auto;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }
  .sheet.show { transform: translateY(0); }
  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border); margin: 10px auto 6px; }
  .title { margin: 4px 20px 10px; }

  .options { display: flex; flex-direction: column; padding: 0 8px; }
  .option {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    width: 100%; padding: 14px 12px; border: none; background: transparent;
    border-radius: 8px; cursor: pointer; text-align: left;
    -webkit-tap-highlight-color: transparent;
  }
  .option:active { background: var(--deneb-canvas); }
  .option.active { background: var(--deneb-canvas); }
  .option-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .option-label { font-family: var(--deneb-sans); font-size: 15px; font-weight: 500; color: var(--f7-page-text-color); }
  .option-desc { font-family: var(--deneb-sans); font-size: 12px; color: var(--deneb-text-secondary); }
  .option svg { color: var(--deneb-positive); flex-shrink: 0; }
</style>

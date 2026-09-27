<script lang="ts">
  let {
    opened = false,
    title = 'Are you sure?',
    message = '',
    confirmLabel = 'Confirm',
    danger = true,
    onConfirm,
    onClose,
  }: {
    opened?: boolean
    title?: string
    message?: string
    confirmLabel?: string
    danger?: boolean
    onConfirm?: () => void
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

  function confirm() {
    onConfirm?.()
    onClose?.()
  }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>
    <h2 class="title headline-md">{title}</h2>
    {#if message}<p class="message">{message}</p>{/if}
    <div class="actions">
      <button class="btn secondary" onclick={onClose}>Cancel</button>
      <button class="btn" class:danger onclick={confirm}>{confirmLabel}</button>
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 16000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 16001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
    padding: 0 20px calc(20px + env(safe-area-inset-bottom, 0px));
  }
  .sheet.show { transform: translateY(0); }
  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border); margin: 10px auto 10px; }
  .title { margin: 0 0 6px; }
  .message { margin: 0 0 18px; font-family: var(--deneb-sans); font-size: 14px; line-height: 1.5; color: var(--deneb-text-secondary); }

  .actions { display: flex; gap: 10px; }
  .btn {
    flex: 1; height: 48px; border-radius: 10px; border: none;
    font-family: var(--deneb-sans); font-size: 15px; font-weight: 600;
    cursor: pointer; -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
  }
  .btn.secondary { background: transparent; border: 1px solid var(--deneb-border); color: var(--f7-page-text-color); }
  .btn.danger { background: var(--deneb-negative); color: #FFFFFF; }
  .btn:active { opacity: 0.85; }
</style>

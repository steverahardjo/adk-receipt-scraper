<script lang="ts">
  import { goto } from '$app/navigation'

  let {
    opened = false, title = '', message = '', onClose,
  }: { opened?: boolean; title?: string; message?: string; onClose?: () => void } = $props()

  let transitioning = $state(false)
  let visible = $state(false)

  $effect(() => {
    if (opened) {
      visible = true
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { transitioning = true })
      })
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  function talkAbout() {
    onClose?.()
    goto(`/chatbot?context=${encodeURIComponent(message)}`)
  }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="body">
      <div class="preview">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div class="preview-text">
          <span class="preview-label">Selected</span>
          <span class="preview-title">{title}</span>
        </div>
      </div>

      <button class="action-btn" onclick={talkAbout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <div class="action-text">
          <span class="action-label">Talk about this</span>
          <span class="action-desc">AI insights on {title.toLowerCase()}</span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 15000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 15001;
    background: #FFFFFF; border-radius: 16px 16px 0 0;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
    padding: 0 20px 24px;
  }
  :global(.dark) .sheet { background: #252528; }
  .sheet.show { transform: translateY(0); }

  .handle { width: 36px; height: 4px; border-radius: 2px; background: #E5E5E5; margin: 10px auto 6px; }
  :global(.dark) .handle { background: #48484A; }

  .body { display: flex; flex-direction: column; gap: 0; }

  .preview {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; background: #FBFBFA;
    border: 1px solid #F0F0EE; border-radius: 10px;
    color: #111111; margin-bottom: 8px;
  }
  :global(.dark) .preview { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.06); }

  .preview-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .preview-label { font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.04em; color: #B0B0AD; }
  :global(.dark) .preview-label { color: #6F6F72; }
  .preview-title { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 15px; font-weight: 600; color: #111111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  :global(.dark) .preview-title { color: #ECECEC; }

  .action-btn {
    display: flex; align-items: center; gap: 12px;
    width: 100%; padding: 14px 16px;
    border: none; border-radius: 10px;
    background: transparent; color: #111111;
    cursor: pointer; text-align: left;
    font-family: inherit; font-size: inherit;
    transition: background 0.1s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  :global(.dark) .action-btn { color: #ECECEC; }
  .action-btn:active { background: #F5F5F4; transform: scale(0.98); }
  :global(.dark) .action-btn:active { background: rgba(255,255,255,0.04); }
  .action-btn svg:first-child { color: #787774; flex-shrink: 0; }
  :global(.dark) .action-btn svg:first-child { color: #9D9D9F; }
  .action-btn svg:last-child { margin-left: auto; color: #B0B0AD; flex-shrink: 0; }
  :global(.dark) .action-btn svg:last-child { color: #6F6F72; }

  .action-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
  .action-label { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 15px; font-weight: 500; }
  .action-desc { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 12px; font-weight: 400; color: #787774; }
  :global(.dark) .action-desc { color: #9D9D9F; }
</style>

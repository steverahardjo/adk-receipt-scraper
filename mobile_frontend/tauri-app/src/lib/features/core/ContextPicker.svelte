<script lang="ts">
  import { goto } from '$app/navigation'

  let {
    opened = false,
    title = '',
    message = '',
    onClose,
  }: {
    opened?: boolean
    title?: string
    message?: string
    onClose?: () => void
  } = $props()

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
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="body">
      <div class="card-preview">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div class="preview-text">
          <span class="preview-label">Selected</span>
          <span class="preview-title">{title}</span>
        </div>
      </div>

      <button class="action-btn" onclick={talkAbout}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <div class="action-text">
          <span class="action-label">Talk about this</span>
          <span class="action-desc">Get AI insights on {title.toLowerCase()}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed; inset: 0; z-index: 15000;
    background: rgba(0,0,0,0.4);
    opacity: 0; transition: opacity 0.25s ease-out;
  }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.6); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0;
    z-index: 15001;
    background: #fff;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
    padding: 0 20px 24px;
  }
  :global(.dark) .sheet { background: #1c1c1e; }
  .sheet.show { transform: translateY(0); }

  .handle {
    width: 40px; height: 5px; border-radius: 3px;
    background: #d1d1d6; margin: 10px auto 6px;
  }
  :global(.dark) .handle { background: #48484a; }

  .body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-preview {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #f0f9f8;
    border-radius: 12px;
    color: #006c50;
  }
  :global(.dark) .card-preview {
    background: rgba(36, 224, 171, 0.06);
    color: #24e0ab;
  }

  .preview-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .preview-label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #6b7b72;
  }
  .preview-title {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1a1c1e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :global(.dark) .preview-title { color: #f0f0f3; }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 16px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: #1a1c1e;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    transition: background 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  :global(.dark) .action-btn { color: #f0f0f3; }
  .action-btn:active { background: #f2f2f7; }
  :global(.dark) .action-btn:active { background: #2c2c2e; }
  .action-btn svg:first-child { color: #006c50; flex-shrink: 0; }
  :global(.dark) .action-btn svg:first-child { color: #24e0ab; }
  .action-btn svg:last-child { margin-left: auto; color: #aeaeb2; flex-shrink: 0; }
  :global(.dark) .action-btn svg:last-child { color: #6b7b72; }

  .action-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .action-label {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
  }
  .action-desc {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #6b7b72;
  }
</style>

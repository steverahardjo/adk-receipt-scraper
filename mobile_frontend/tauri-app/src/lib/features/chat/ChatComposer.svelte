<script lang="ts">
  let {
    value = $bindable(''),
    disabled = false,
    onsubmit,
  }: { value?: string; disabled?: boolean; onsubmit?: () => void } = $props()

  let textarea = $state<HTMLTextAreaElement | null>(null)

  function submit() {
    if (value.trim() && !disabled) onsubmit?.()
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  function autosize() {
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }
</script>

<div class="composer">
  <textarea
    bind:this={textarea}
    bind:value
    rows="1"
    placeholder="Ask about your finances..."
    onkeydown={keydown}
    oninput={autosize}
    {disabled}
  ></textarea>
  <button class="send" disabled={!value.trim() || disabled} onclick={submit} aria-label="Send message">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  </button>
</div>

<style>
  .composer { display: flex; align-items: flex-end; gap: 8px; width: 100%; }

  textarea {
    flex: 1;
    min-height: 44px;
    max-height: 120px;
    padding: 12px 16px;
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--f7-page-text-color);
    background: var(--deneb-surface);
    outline: none;
    resize: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }
  textarea:focus { border-color: var(--f7-page-text-color); }
  textarea::placeholder { color: var(--deneb-text-muted); }

  .send {
    width: 44px; height: 44px; flex-shrink: 0;
    border: none; border-radius: 10px;
    background: var(--f7-page-text-color); color: var(--f7-page-bg-color);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.15s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .send:disabled { opacity: 0.35; cursor: default; }
  .send:active:not(:disabled) { transform: scale(0.95); }
</style>

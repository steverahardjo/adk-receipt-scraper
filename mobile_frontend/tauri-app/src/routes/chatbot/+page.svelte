<script lang="ts">
  import { page } from '$app/stores'
  import BaseLayer from '$lib/BaseLayer.svelte'

  let contextMessage = $derived($page.url.searchParams.get('context') ?? '')
  let input = $state(contextMessage)
  let sent = $state(!!contextMessage)
</script>

<BaseLayer title="Chat" noDrawer>
  <div class="page">
    {#if !sent}
      <div class="empty">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <p class="empty-title headline-md">AI Assistant</p>
        <p class="empty-desc">
          {#if contextMessage}
            Tap send to discuss the selected card
          {:else}
            Ask anything about your finances
          {/if}
        </p>
      </div>
    {:else}
      <div class="chat-area">
        <div class="bubble user">
          <div class="bubble-text">{contextMessage || input}</div>
        </div>
        <div class="bubble ai">
          <div class="bubble-text">
            {contextMessage ? 'Looking at your data...' : 'I hear you.'} What would you like to know?
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="input-bar">
    <input class="input-field" type="text" placeholder="Ask about your finances..."
      bind:value={input}
      onkeydown={(e) => { if (e.key === 'Enter' && input.trim()) sent = true }} />
    <button class="send-btn" disabled={!input.trim()} onclick={() => { if (input.trim()) sent = true }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </button>
  </div>
</BaseLayer>

<style>
  .page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: calc(100dvh - 200px); padding: 0 0 16px; }
  .empty { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
  .empty-icon { width: 56px; height: 56px; border-radius: 12px; background: var(--deneb-canvas); border: 1px solid var(--deneb-border); color: var(--f7-page-text-color); display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
  .empty-title { margin: 0; }
  .empty-desc { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 14px; color: var(--deneb-text-secondary); margin: 0; max-width: 240px; }
  .chat-area { width: 100%; display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }
  .bubble { max-width: 85%; padding: 14px 16px; border-radius: 10px; }
  .bubble.user { align-self: flex-end; background: #111111; color: #FFFFFF; border-bottom-right-radius: 2px; }
  :global(.dark) .bubble.user { background: #ECECEC; color: #18181A; }
  .bubble.ai { align-self: flex-start; background: var(--deneb-canvas); border: 1px solid var(--deneb-border); color: var(--f7-page-text-color); border-bottom-left-radius: 2px; }
  .bubble-text { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 14px; line-height: 1.4; }
  .input-bar {
    position: fixed; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    background: rgba(251, 251, 250, 0.95);
    border-top: 1px solid var(--deneb-border);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    z-index: 100;
  }
  :global(.dark) .input-bar { background: rgba(24, 24, 26, 0.95); }
  .input-field {
    flex: 1; height: 44px; padding: 0 16px;
    border: 1px solid var(--deneb-border); border-radius: 8px;
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 14px; color: var(--f7-page-text-color);
    background: var(--deneb-surface); outline: none;
    transition: border-color 0.15s; box-sizing: border-box;
  }
  .input-field:focus { border-color: var(--deneb-text-secondary); }
  .input-field::placeholder { color: var(--deneb-text-muted); }
  .send-btn {
    width: 44px; height: 44px; border: none; border-radius: 8px;
    background: #111111; color: #FFFFFF;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: opacity 0.15s, transform 0.1s;
  }
  :global(.dark) .send-btn { background: #ECECEC; color: #18181A; }
  .send-btn:disabled { opacity: 0.35; }
  .send-btn:active { transform: scale(0.95); }
</style>

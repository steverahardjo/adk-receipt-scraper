<script lang="ts">
  import { page } from '$app/stores'
  import BaseLayer from '$lib/BaseLayer.svelte'

  let contextMessage = $derived($page.url.searchParams.get('context') ?? '')

  let input = $state(contextMessage)
  let sent = $state(!!contextMessage)
</script>

<BaseLayer title="Chat">
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
            I can see your {contextMessage ? 'dashboard data' : 'message'}. What would you like to know more about?
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="input-bar">
    <input
      class="input-field"
      type="text"
      placeholder="Ask about your finances..."
      bind:value={input}
      onkeydown={(e) => { if (e.key === 'Enter' && input.trim()) sent = true }}
    />
    <button class="send-btn" disabled={!input.trim()} onclick={() => { if (input.trim()) sent = true }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </button>
  </div>
</BaseLayer>

<style>
  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100dvh - 180px);
    padding: 0 0 16px;
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }

  .empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(0, 141, 163, 0.06);
    color: #006c50;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }
  :global(.dark) .empty-icon {
    background: rgba(36, 224, 171, 0.06);
    color: #24e0ab;
  }

  .empty-title {
    margin: 0;
  }

  .empty-desc {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    color: #6b7b72;
    margin: 0;
    max-width: 220px;
  }

  .chat-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 8px;
  }

  .bubble {
    max-width: 85%;
    padding: 14px 16px;
    border-radius: 16px;
  }

  .bubble.user {
    align-self: flex-end;
    background: #006c50;
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  :global(.dark) .bubble.user {
    background: #24e0ab;
    color: #1a1c1e;
  }

  .bubble.ai {
    align-self: flex-start;
    background: #f0f9f8;
    color: #1a1c1e;
    border-bottom-left-radius: 4px;
  }
  :global(.dark) .bubble.ai {
    background: #2f3133;
    color: #f0f0f3;
  }

  .bubble-text {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }

  .input-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    background: rgba(249, 249, 252, 0.95);
    border-top: 1px solid rgba(0, 141, 163, 0.08);
    backdrop-filter: blur(12px);
    z-index: 100;
  }
  :global(.dark) .input-bar {
    background: rgba(26, 28, 30, 0.95);
    border-color: rgba(110, 212, 236, 0.08);
  }

  .input-field {
    flex: 1;
    height: 44px;
    padding: 0 16px;
    border: 1.5px solid transparent;
    border-radius: 12px;
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    color: #1a1c1e;
    background: #f0f9f8;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  :global(.dark) .input-field { background: #2f3133; color: #f0f0f3; }
  .input-field:focus { border-color: #2ee5af; }
  :global(.dark) .input-field:focus { border-color: #24e0ab; }
  .input-field::placeholder { color: #aeaeb2; }

  .send-btn {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 12px;
    background: #006c50;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.1s, opacity 0.15s;
  }
  :global(.dark) .send-btn { background: #24e0ab; color: #1a1c1e; }
  .send-btn:disabled { opacity: 0.4; }
  .send-btn:active { background: #00513b; }
  :global(.dark) .send-btn:active { background: #1bc49a; }
</style>

<script lang="ts">
  import type { ChatMessage } from './chat'
  import ChatChart from './ChatChart.svelte'

  let { message }: { message: ChatMessage } = $props()

  let time = $derived(
    new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  )
</script>

<div class="row" class:user={message.role === 'user'}>
  <div
    class="bubble"
    class:user={message.role === 'user'}
    class:assistant={message.role === 'assistant'}
    class:wide={!!message.chart}
  >
    {#if message.status === 'sending'}
      <div class="typing" aria-label="Assistant is typing">
        <span></span><span></span><span></span>
      </div>
    {:else}
      <p class="text">{message.content}</p>
      {#if message.chart}
        <div class="chart-wrap"><ChatChart spec={message.chart} /></div>
      {/if}
      <div class="meta">
        <span>{time}</span>
        {#if message.status === 'error'}<span class="error">Failed</span>{/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .row { display: flex; width: 100%; }
  .row.user { justify-content: flex-end; }

  .bubble {
    max-width: 82%;
    padding: 12px 14px;
    border-radius: 12px;
    font-family: 'Geist Sans', system-ui, sans-serif;
  }
  .bubble.user { background: var(--f7-page-text-color); color: var(--f7-page-bg-color); border-bottom-right-radius: 4px; }
  .bubble.assistant { background: var(--deneb-surface); border: 1px solid var(--deneb-border); color: var(--f7-page-text-color); border-bottom-left-radius: 4px; }
  .bubble.wide { max-width: 100%; width: 100%; }

  .text { margin: 0; font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }

  .chart-wrap { margin-top: 10px; }

  .meta {
    display: flex; align-items: center; gap: 8px;
    margin-top: 4px;
    font-family: 'Geist Mono', monospace; font-size: 10px;
    opacity: 0.55;
  }
  .meta .error { color: var(--deneb-negative); opacity: 1; }

  .typing { display: flex; align-items: center; gap: 4px; padding: 4px 2px; }
  .typing span {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--deneb-text-secondary);
    animation: blink 1.2s infinite ease-in-out both;
  }
  .typing span:nth-child(2) { animation-delay: 0.15s; }
  .typing span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes blink { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
</style>

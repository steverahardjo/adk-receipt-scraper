<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { page } from '$app/stores'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import ChatMessage from '$lib/features/chat/ChatMessage.svelte'
  import ChatComposer from '$lib/features/chat/ChatComposer.svelte'
  import ChatSuggestions from '$lib/features/chat/ChatSuggestions.svelte'
  import { sendChat } from '$lib/features/chat/chat'
  import type { ChatMessage as ChatMsg } from '$lib/features/chat/chat'
  import { readValue, writeValue } from '$lib/features/core/storage'

  let input = $state('')
  let messages = $state<ChatMsg[]>([])
  let loading = $state(false)
  let anchor = $state<HTMLDivElement | null>(null)
  let contextMessage = $derived($page.url.searchParams.get('context') ?? '')

  function uid() {
    return globalThis.crypto?.randomUUID?.() ?? `m-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  async function scrollToEnd() {
    await tick()
    anchor?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    input = ''
    messages = [...messages, { id: uid(), role: 'user', content: trimmed, createdAt: Date.now(), status: 'sent' }]
    const placeholder: ChatMsg = { id: uid(), role: 'assistant', content: '', createdAt: Date.now(), status: 'sending' }
    messages = [...messages, placeholder]
    loading = true
    scrollToEnd()
    try {
      const history = messages.filter((m) => m.id !== placeholder.id)
      const reply = await sendChat(history, contextMessage || undefined)
      messages = messages.map((m) => (m.id === placeholder.id ? { ...m, content: reply, status: 'sent' } : m))
    } catch {
      messages = messages.map((m) => (m.id === placeholder.id ? { ...m, content: 'Something went wrong. Please try again.', status: 'error' } : m))
    } finally {
      loading = false
      await writeValue('chat-history', messages)
      scrollToEnd()
    }
  }

  onMount(async () => {
    const saved = await readValue<ChatMsg[]>('chat-history')
    if (saved?.length) messages = saved.filter((m) => m.status !== 'sending')
    if (contextMessage) {
      await send(contextMessage)
    } else if (messages.length === 0) {
      messages = [{
        id: uid(),
        role: 'assistant',
        content: 'Hi! Ask me anything about your finances — spending, budgets, or where to save.',
        createdAt: Date.now(),
        status: 'sent',
      }]
    }
    scrollToEnd()
  })
</script>

<BaseLayer title="Chat" noDrawer>
  <div class="page">
    {#if messages.length === 0}
      <div class="empty">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <p class="empty-title headline-md">AI Assistant</p>
        <p class="empty-desc">Ask anything about your finances</p>
        <div class="suggestions"><ChatSuggestions onPick={(t) => send(t)} /></div>
      </div>
    {:else}
      <div class="chat-area">
        {#each messages as message (message.id)}
          <ChatMessage {message} />
        {/each}
      </div>
    {/if}
    <div bind:this={anchor} class="anchor"></div>
  </div>

  <div class="input-bar">
    <ChatComposer bind:value={input} disabled={loading} onsubmit={() => send(input)} />
  </div>
</BaseLayer>

<style>
  .page {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 8px 16px 96px;
  }

  .empty {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding-bottom: 40px;
  }
  .empty-icon {
    width: 56px; height: 56px; border-radius: 12px;
    background: var(--deneb-canvas); border: 1px solid var(--deneb-border);
    color: var(--f7-page-text-color);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .empty-title { margin: 0; }
  .empty-desc { font-family: 'Geist Sans', system-ui, sans-serif; font-size: 14px; color: var(--deneb-text-secondary); margin: 0; }
  .suggestions { margin-top: 16px; }

  .chat-area { display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }
  .anchor { height: 1px; }

  .input-bar {
    position: fixed; left: 0; right: 0; bottom: 0;
    padding: 10px 16px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    background: rgba(251, 251, 250, 0.95);
    border-top: 1px solid var(--deneb-border);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    z-index: 100;
  }
  :global(.dark) .input-bar { background: rgba(24, 24, 26, 0.95); }
</style>

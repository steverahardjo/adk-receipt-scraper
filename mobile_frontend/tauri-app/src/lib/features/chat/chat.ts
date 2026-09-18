import { API_BASE } from '$lib/features/core/api'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  status?: 'sending' | 'sent' | 'error'
}

/**
 * Send the conversation and resolve with the assistant reply.
 *
 * Order of preference:
 *  1. Rust `chat` command — keeps API keys out of the webview.
 *  2. HTTP backend at `/chat`.
 *  3. Local offline reply so the UI stays usable without a backend.
 */
export async function sendChat(messages: ChatMessage[], context?: string): Promise<string> {
  const payload = messages.map((m) => ({ role: m.role, content: m.content }))

  try {
    const { invoke } = await import('@tauri-apps/api/core')
    const reply = await invoke<string>('chat', { messages: payload, context: context ?? '' })
    if (reply) return reply
  } catch {
    /* native command not available */
  }

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: payload, context }),
    })
    if (res.ok) {
      const data = await res.json().catch(() => null)
      if (typeof data?.reply === 'string') return data.reply
      if (typeof data?.message === 'string') return data.message
    }
  } catch {
    /* offline or backend down */
  }

  return offlineReply(messages, context)
}

function offlineReply(messages: ChatMessage[], context?: string): string {
  const last = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() ?? ''

  if (context) {
    return `I can see the card you selected: "${context.slice(0, 140)}". Once the AI backend is connected I'll break this down in detail. For now, try asking about your budget, spending, or savings.`
  }
  if (last.includes('budget')) {
    return 'Your daily budget is Rp 150.000. Open the Daily Budget ring on the dashboard to see what is left for today.'
  }
  if (last.includes('spend') || last.includes('expense')) {
    return 'Your biggest expense categories this month are Food & Drinks, Transportation, and Shopping. Open Records → Flow Overview for the full breakdown.'
  }
  if (last.includes('save') || last.includes('saving')) {
    return 'A simple target is to keep expenses under 60% of income. This month shows a surplus — consider moving the difference into savings.'
  }
  return "I'm not connected to an AI backend yet, so I can only give general guidance. Try asking about your budget, spending, or savings."
}

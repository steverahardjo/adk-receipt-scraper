import { API_BASE } from '$lib/features/core/api'
import { getEntries } from '$lib/features/records/store.svelte'

export interface ChatChartSpec {
  data: Record<string, unknown>[]
  layout?: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  status?: 'sending' | 'sent' | 'error'
  chart?: ChatChartSpec
}

export interface ChatReply {
  content: string
  chart?: ChatChartSpec
}

/**
 * Send the conversation and resolve with the assistant reply.
 *
 * Order of preference:
 *  1. Rust `chat` command — keeps API keys out of the webview.
 *  2. HTTP backend at `/chat`.
 *  3. Local offline reply (with a chart) so the UI stays usable without a backend.
 */
export async function sendChat(messages: ChatMessage[], context?: string): Promise<ChatReply> {
  const payload = messages.map((m) => ({ role: m.role, content: m.content }))

  try {
    const { invoke } = await import('@tauri-apps/api/core')
    const reply = await invoke<string | ChatReply>('chat', { messages: payload, context: context ?? '' })
    if (typeof reply === 'string' && reply) return { content: reply }
    if (reply && typeof reply === 'object' && typeof reply.content === 'string') return reply
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
      if (typeof data?.reply === 'string') return { content: data.reply, chart: data.chart }
      if (typeof data?.message === 'string') return { content: data.message, chart: data.chart }
    }
  } catch {
    /* offline or backend down */
  }

  return offlineReply(messages, context)
}

function offlineReply(messages: ChatMessage[], context?: string): ChatReply {
  const last = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() ?? ''

  if (context) {
    return {
      content: `I can see the card you selected: "${context.slice(0, 140)}". Once the AI backend is connected I'll break this down in detail. For now, try asking about your budget, spending, or savings.`,
    }
  }
  if (last.includes('budget')) {
    return {
      content: 'Your daily budget is Rp 150.000. Open the Daily Budget ring on the dashboard to see what is left for today.',
    }
  }
  if (last.includes('spend') || last.includes('expense') || last.includes('categor')) {
    return {
      content: 'Here is where your money went by category this period. Open Records → Flow Overview for the full breakdown.',
      chart: expenseByCategory(),
    }
  }
  if (last.includes('save') || last.includes('saving')) {
    return {
      content: 'A simple target is to keep expenses under 60% of income. This month shows a surplus — consider moving the difference into savings.',
    }
  }
  return {
    content: "I'm not connected to an AI backend yet, so I can only give general guidance. Try asking about your budget, spending, or savings.",
  }
}

function expenseByCategory(): ChatChartSpec | undefined {
  const totals: Record<string, number> = {}
  for (const entry of getEntries()) {
    if (entry.flow === 'expense' && entry.type) {
      totals[entry.type] = (totals[entry.type] || 0) + entry.amount
    }
  }
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 6)
  if (sorted.length === 0) return undefined

  const dark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  // Read the live design tokens so AI charts follow the DeepSeek palette and
  // switch with the theme instead of hard-coding hexes.
  const token = (name: string, fallback: string) => {
    if (typeof window === 'undefined') return fallback
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  }
  const text = token('--ds-ink', dark ? '#f5f5f5' : '#0f1115')
  const grid = token('--ds-border', dark ? 'rgba(255,255,255,0.10)' : '#e5e5e5')
  const accent = token('--ds-accent', dark ? '#7aaaff' : '#4176e6')

  return {
    data: [{
      type: 'bar',
      x: sorted.map(([category]) => category),
      y: sorted.map(([, total]) => total),
      marker: { color: accent },
      hovertemplate: '%{x}<br>Rp %{y:,.0f}<extra></extra>',
    }],
    layout: {
      margin: { t: 10, r: 8, b: 56, l: 56 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: token('--ds-font-sans', '-apple-system, BlinkMacSystemFont, "Inter Variable", system-ui, sans-serif'), size: 10, color: text },
      xaxis: { fixedrange: true, tickangle: -35, color: text, gridcolor: 'rgba(0,0,0,0)' },
      yaxis: { fixedrange: true, color: text, gridcolor: grid, zeroline: false },
      showlegend: false,
      bargap: 0.35,
    },
  }
}

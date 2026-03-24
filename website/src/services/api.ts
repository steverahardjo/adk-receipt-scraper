import type { Expense } from '@/schema'
import { CURRENCIES } from '@/schema'

const BASE_URL = 'https://expense-tracker.com'
export const chatAPI = {
  fetchMessages: async () => {
    const res = await fetch(`${BASE_URL}/chat`)
    if (!res.ok) {
      throw new Error('Failed to fetch messages')
    }
    return res.json()
  },
  sendMessage: async (text: string) => {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'Content-Type': 'application/json' },
    })
    return res.json()
  },
  fetchProfileInput: async () => {
    const res = await fetch(`${BASE_URL}/chat/profile`)
    if (!res.ok) {
      throw new Error('Failed to enable profile input through chat platform')
    }
    return res.json()
  },
}

export const expenseAPI = {
  sendExpense: async (newExpense: Omit<Expense, 'id'>) => {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense),
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      throw new Error(errorBody.message || 'Failed to save expense')
    }

    return res.json() as Promise<Expense>
  },
  fetchExpenses: async () => {
    const res = await fetch(`${BASE_URL}/expenses`)
    if (!res.ok) {
      throw new Error('Failed to fetch expenses')
    }
    return res.json()
  },
}

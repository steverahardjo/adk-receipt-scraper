import { ref, computed, readonly } from 'vue'
import type { ExpensePayload } from '@/services/types'

const STORAGE_KEY = 'expenses'

export interface Expense extends ExpensePayload {
  id: string
  created_at: string
}

export interface ExpenseFilters {
  search?: string
  type?: string
  payment_type?: string
  startDate?: string
  endDate?: string
  sortBy?: 'date' | 'amount'
  sortOrder?: 'asc' | 'desc'
}

const expenses = ref<Expense[]>([])
const isLoading = ref(false)

const loadExpenses = (): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      expenses.value = JSON.parse(stored)
    }
  } catch {
    expenses.value = []
  }
}

const saveExpenses = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses.value))
}

const addExpense = (expense: Expense): void => {
  expenses.value = [expense, ...expenses.value]
  saveExpenses()
}

const updateExpense = (id: string, updates: Partial<Expense>): void => {
  const index = expenses.value.findIndex(e => e.id === id)
  if (index !== -1) {
    expenses.value[index] = { ...expenses.value[index], ...updates }
    saveExpenses()
  }
}

const deleteExpense = (id: string): void => {
  expenses.value = expenses.value.filter(e => e.id !== id)
  saveExpenses()
}

const getExpense = (id: string): Expense | undefined => {
  return expenses.value.find(e => e.id === id)
}

const filteredExpenses = computed(() => {
  return (filters: ExpenseFilters = {}): Expense[] => {
    let result = [...expenses.value]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(searchLower) ||
          e.description?.toLowerCase().includes(searchLower)
      )
    }

    // Type filter
    if (filters.type) {
      result = result.filter(e => e.type === filters.type)
    }

    // Payment type filter
    if (filters.payment_type) {
      result = result.filter(e => e.payment_type === filters.payment_type)
    }

    // Date range filter
    if (filters.startDate) {
      result = result.filter(e => e.date >= filters.startDate!)
    }
    if (filters.endDate) {
      result = result.filter(e => e.date <= filters.endDate!)
    }

    // Sorting
    const sortKey = filters.sortBy || 'date'
    const order = filters.sortOrder === 'asc' ? 1 : -1
    result.sort((a, b) => {
      if (sortKey === 'date') {
        return order * (new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      if (sortKey === 'amount') {
        return order * (a.amount - b.amount)
      }
      return 0
    })

    return result
  }
})

const getTotalAmount = computed(() => {
  return (filters?: ExpenseFilters): number => {
    const list = filters ? filteredExpenses.value(filters) : expenses.value
    return list.reduce((sum, e) => sum + e.amount, 0)
  }
})

const getExpensesByType = computed(() => {
  return (type: string): Expense[] => {
    return expenses.value.filter(e => e.type === type)
  }
})

// Load expenses on module init
loadExpenses()

export function useExpenses() {
  return {
    expenses: readonly(expenses),
    isLoading: readonly(isLoading),
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
    filteredExpenses,
    getTotalAmount,
    getExpensesByType,
    loadExpenses,
  }
}

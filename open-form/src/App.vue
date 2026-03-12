<script setup lang="ts">
import { computed, ref } from 'vue'
import { useExpenseForm } from '@/composables/useExpenseForm'
import { useExpenses } from '@/composables/useExpenses'
import { useToast } from '@/composables/useToast'
import { usePreviousTitles } from '@/composables/usePreviousTitles'
import { useDraft } from '@/composables/useDraft'
import { haptic } from '@/utils/haptic'
import type { ExpensePayload } from '@/services/types'
import PageHeader from '@/components/layout/PageHeader.vue'
import ExpenseForm from '@/components/form/ExpenseForm.vue'
import ExpenseList from '@/components/ui/ExpenseList.vue'
import NotificationToast from '@/components/ui/NotificationToast.vue'

import 'flag-icons/css/flag-icons.min.css'
import '@material/web/button/elevated-button.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/text-button.js'
import '@material/web/icon/icon.js'
import '@material/web/progress/circular-progress.js'
import '@material/web/textfield/filled-text-field.js'

// Types
type Currency = 'USD' | 'IDR' | 'SGD' | 'MYR' | 'JPY'

// Constants
const EXPENSE_TYPES = [
  { value: 'Food', label: 'Food & Dining', icon: '🍔' },
  { value: 'Transport', label: 'Transport', icon: '🚗' },
  { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'Bills', label: 'Bills & Utilities', icon: '📄' },
  { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'Health', label: 'Health', icon: '💊' },
  { value: 'Other', label: 'Other', icon: '📦' },
]

const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash', icon: '💵' },
  { value: 'Debit', label: 'Debit Card', icon: '💳' },
  { value: 'Credit', label: 'Credit Card', icon: '💳' },
  { value: 'E-Wallet', label: 'E-Wallet', icon: '📱' },
  { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦' },
]

const CURRENCY_MAP: Record<Currency, { code: string; label: string }> = {
  USD: { code: 'us', label: 'US Dollar' },
  IDR: { code: 'id', label: 'Indonesian Rupiah' },
  SGD: { code: 'sg', label: 'Singapore Dollar' },
  MYR: { code: 'my', label: 'Malaysian Ringgit' },
  JPY: { code: 'jp', label: 'Japanese Yen' },
}

// Composables
const { form, errors, isLoading, isSuccess, error, submit, resetForm } = useExpenseForm()
const { expenses, addExpense, deleteExpense, filteredExpenses, getTotalAmount } = useExpenses()
const { toast, success, error: showError, hide } = useToast()
const { addTitle, previousTitles } = usePreviousTitles()
const { draft, hasDraft, loadDraft, saveDraft, clearDraft, setupAutoSave } = useDraft()

// Initialize currency from localStorage
const savedCurrency = (localStorage.getItem('currency') as Currency) || 'USD'
form.currency = savedCurrency

// Load draft on mount
const hasLoadedDraft = ref(false)
if (!hasLoadedDraft.value) {
  const savedDraft = loadDraft()
  if (savedDraft) {
    Object.assign(form, savedDraft)
  }
  setupAutoSave({ ...form } as any)
  hasLoadedDraft.value = true
}

// Sample expense title suggestions
const DEFAULT_SUGGESTIONS = [
  'Morning coffee',
  'Lunch at restaurant',
  'Grocery shopping',
  'Gas station',
  'Bus ticket',
  'Train ticket',
  'Netflix subscription',
  'Spotify subscription',
  'Electric bill',
  'Water bill',
  'Internet bill',
  'Movie tickets',
  'Gym membership',
  'Pharmacy',
  'Doctor visit',
  'Online shopping',
  'Clothing store',
  'Electronics store',
]

// Merge previous titles with default suggestions (previous titles first)
const titleSuggestions = computed(() => {
  const previous = previousTitles.value || []
  const defaults = DEFAULT_SUGGESTIONS.filter(
    d => !previous.some(p => p.toLowerCase() === d.toLowerCase())
  )
  return [...previous, ...defaults]
})

// Tab state
const activeTab = ref<'form' | 'list'>('form')

// Filter state
const searchQuery = ref('')
const selectedType = ref<string>('')

const filteredList = computed(() => {
  const filters = {
    search: searchQuery.value || undefined,
    type: selectedType.value || undefined,
  }
  return filteredExpenses.value(filters)
})

const totalAmount = computed(() => getTotalAmount.value())

// Form submission handler
const handleSubmit = async () => {
  haptic.medium()
  const submitted = await submit()
  if (submitted) {
    const expenseData = {
      id: crypto.randomUUID(),
      title: form.title,
      type: form.type as ExpensePayload['type'],
      amount: form.amount!,
      currency: form.currency as Currency,
      date: typeof form.date === 'string' ? form.date : form.date.toISOString().slice(0, 10),
      payment_type: form.payment_type as ExpensePayload['payment_type'],
      description: form.description || undefined,
      created_at: new Date().toISOString(),
    }
    addExpense(expenseData)
    success('Expense saved successfully!')
    addTitle(form.title)
    clearDraft()
    resetForm()
    haptic.success()
  } else if (error.value) {
    showError(error.value)
    haptic.error()
  }
}

// Delete handler
const handleDelete = (id: string) => {
  deleteExpense(id)
  success('Expense deleted')
  haptic.success()
}

// Edit handler
const handleEdit = (expense: ExpensePayload & { id: string; created_at: string }) => {
  Object.assign(form, {
    title: expense.title,
    type: expense.type,
    amount: expense.amount,
    currency: expense.currency,
    date: expense.date,
    payment_type: expense.payment_type,
    description: expense.description || '',
  })
  activeTab.value = 'form'
  haptic.light()
}

// Clear draft
const handleClearDraft = () => {
  if (hasDraft.value) {
    clearDraft()
    resetForm()
    success('Draft cleared')
  }
}

// Clear toast when it's closed
const handleToastClose = () => {
  hide()
}
</script>

<template>
  <main class="container">
    <NotificationToast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @update:visible="toast.visible = $event"
      @close="handleToastClose"
    />

    <PageHeader
      title="Expense Tracker"
      subtitle="Track your spending, one transaction at a time"
    />

    <!-- Tab Navigation -->
    <nav class="tabs" role="tablist" aria-label="Navigation tabs">
      <button
        class="tab"
        :class="{ 'tab--active': activeTab === 'form' }"
        role="tab"
        :aria-selected="activeTab === 'form'"
        aria-controls="form-panel"
        @click="activeTab = 'form'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>Add Expense</span>
      </button>
      <button
        class="tab"
        :class="{ 'tab--active': activeTab === 'list' }"
        role="tab"
        :aria-selected="activeTab === 'list'"
        aria-controls="list-panel"
        @click="activeTab = 'list'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5H2v7l5-5 5 5V5z"/>
          <path d="M9 5l5 5 5-5v7l-5 5-5-5"/>
        </svg>
        <span>History</span>
        <span class="tab__badge">{{ expenses.length }}</span>
      </button>
    </nav>

    <!-- Form Panel -->
    <section
      v-show="activeTab === 'form'"
      id="form-panel"
      role="tabpanel"
      aria-labelledby="form-tab"
      class="panel"
    >
      <!-- Draft indicator -->
      <div v-if="hasDraft" class="draft-indicator">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        <span>Draft saved</span>
        <button class="draft-clear" @click="handleClearDraft" aria-label="Clear draft">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <ExpenseForm
        :form="form"
        :errors="errors"
        :is-loading="isLoading"
        :is-success="isSuccess"
        :error="error"
        :expense-types="EXPENSE_TYPES"
        :currencies="CURRENCY_MAP"
        :payment-methods="PAYMENT_METHODS"
        :title-suggestions="titleSuggestions"
        @update:form="(value) => Object.assign(form, value)"
        @submit="handleSubmit"
      />
    </section>

    <!-- List Panel -->
    <section
      v-show="activeTab === 'list'"
      id="list-panel"
      role="tabpanel"
      aria-labelledby="list-tab"
      class="panel"
    >
      <!-- Summary Card -->
      <div class="summary-card">
        <div class="summary-card__content">
          <span class="summary-card__label">Total Spent</span>
          <span class="summary-card__amount">
            ${{ totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </span>
        </div>
        <div class="summary-card__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-input">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-field"
            placeholder="Search expenses..."
            aria-label="Search expenses"
          />
        </div>
        <select
          v-model="selectedType"
          class="type-filter"
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          <option v-for="type in EXPENSE_TYPES" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>

      <!-- Expense List -->
      <ExpenseList
        :expenses="filteredList"
        :is-loading="false"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </section>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');

:root {
  --primary: #4285f4;
  --primary-dark: #1a73e8;
  --primary-light: #e8f0fe;
  --success: #22c55e;
  --error: #dc2626;
  --warning: #f59e0b;
  --bg-primary: #fafafa;
  --bg-card: #ffffff;
  --text-primary: #1f1f1f;
  --text-secondary: #5f6368;
  --border: #e8eaed;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.1);
  --radius: 16px;
  --radius-sm: 8px;
}

body {
  margin: 0;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
}
</style>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-card);
  padding: 0.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: calc(var(--radius) - 4px);
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.tab--active {
  background: var(--primary);
  color: white;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
}

.tab__badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tab--active .tab__badge {
  background: rgba(255, 255, 255, 0.3);
}

/* Panels */
.panel {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Draft indicator */
.draft-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--primary-light);
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--primary-dark);
}

.draft-indicator svg:first-child {
  flex-shrink: 0;
}

.draft-clear {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.draft-clear:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Summary Card */
.summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: var(--radius);
  color: white;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.summary-card__label {
  display: block;
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.summary-card__amount {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Google Sans', sans-serif;
}

.summary-card__icon {
  opacity: 0.8;
}

/* Filters */
.filters {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.search-input {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.search-field {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-field::placeholder {
  color: var(--text-secondary);
}

.search-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.type-filter {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.9375rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.type-filter:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

/* Responsive */
@media (max-width: 640px) {
  .container {
    margin: 0;
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    padding: 1rem;
  }

  .tabs {
    margin: 0 -1rem 1rem;
    border-radius: 0;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .summary-card__amount {
    font-size: 1.5rem;
  }
}
</style>

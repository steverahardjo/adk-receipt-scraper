<script setup lang="ts">
import { ref, watch } from 'vue'
import { useExpenseForm } from '@/composables/useExpenseForm'
import { useToast } from '@/composables/useToast'
import { useDarkMode } from '@/composables/useDarkMode'
import PageHeader from '@/components/layout/PageHeader.vue'
import ExpenseForm from '@/components/form/ExpenseForm.vue'
import NotificationToast from '@/components/ui/NotificationToast.vue'

import 'flag-icons/css/flag-icons.min.css'
import '@material/web/button/elevated-button.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/text-button.js'
import '@material/web/icon/icon.js'
import '@material/web/progress/circular-progress.js'

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
const { toast, success, error: showError } = useToast()
const { isDarkMode, toggleDarkMode } = useDarkMode()

// Initialize currency from localStorage
const savedCurrency = (localStorage.getItem('currency') as Currency) || 'USD'
form.currency = savedCurrency

// Form submission handler
const handleSubmit = async () => {
  const submitted = await submit()
  if (submitted) {
    success('Expense saved successfully!')
    resetForm()
  } else if (error.value) {
    showError(error.value)
  }
}
</script>

<template>
  <main class="container">
    <NotificationToast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @update:visible="toast.visible = $event"
    />

    <PageHeader
      title="Add Expense"
      subtitle="Track your spending, one transaction at a time"
      :is-dark-mode="isDarkMode"
      @toggle="toggleDarkMode"
    />

    <ExpenseForm
      :form="form"
      :errors="errors"
      :is-loading="isLoading"
      :is-success="isSuccess"
      :error="error"
      :expense-types="EXPENSE_TYPES"
      :currencies="CURRENCY_MAP"
      :payment-methods="PAYMENT_METHODS"
      @update:form="(value) => Object.assign(form, value)"
      @submit="handleSubmit"
    />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Roboto:wght@400;500&display=swap');

body {
  margin: 0;
  font-family: 'Roboto', system-ui, sans-serif;
}
</style>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  font-family: 'Roboto', system-ui, sans-serif;
  background: linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%);
  border-radius: 24px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.dark-mode .container {
  background: linear-gradient(135deg, #1e1e2e 0%, #252542 100%);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 640px) {
  .container {
    margin: 0;
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    padding: 1.5rem 1rem;
    box-shadow: none;
  }
}
</style>

import { ref, reactive } from 'vue'
import type { ExpensePayload, ExpenseResponse } from '@/services/types'
import { submitExpense } from '@/services/api'

interface FormState {
  title: string
  type: string
  amount: number | null
  currency: string
  date: Date | string
  payment_type: string
  description: string
}

interface FormErrors {
  title?: string
  type?: string
  amount?: string
  date?: string
  payment_type?: string
}

export function useExpenseForm() {
  const form = reactive<FormState>({
    title: '',
    type: '',
    amount: null,
    currency: 'USD',
    date: new Date(),
    payment_type: '',
    description: '',
  })

  const errors = reactive<FormErrors>({})
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const error = ref<string | null>(null)
  const response = ref<ExpenseResponse | null>(null)

  const validate = (): boolean => {
    errors.title = undefined
    errors.type = undefined
    errors.amount = undefined
    errors.date = undefined
    errors.payment_type = undefined

    let isValid = true

    if (!form.title.trim()) {
      errors.title = 'Title is required'
      isValid = false
    } else if (form.title.length < 2) {
      errors.title = 'Title must be at least 2 characters'
      isValid = false
    }

    if (!form.type) {
      errors.type = 'Please select an expense type'
      isValid = false
    }

    if (!form.amount || form.amount <= 0) {
      errors.amount = 'Amount must be greater than 0'
      isValid = false
    }

    if (!form.date) {
      errors.date = 'Date is required'
      isValid = false
    }

    if (!form.payment_type) {
      errors.payment_type = 'Please select a payment method'
      isValid = false
    }

    return isValid
  }

  const resetForm = () => {
    form.title = ''
    form.type = ''
    form.amount = null
    form.date = new Date()
    form.payment_type = ''
    form.description = ''
    errors.title = undefined
    errors.type = undefined
    errors.amount = undefined
    errors.date = undefined
    errors.payment_type = undefined
    isSuccess.value = false
    error.value = null
    response.value = null
  }

  const submit = async (): Promise<boolean> => {
    if (!validate()) {
      return false
    }

    isLoading.value = true
    isSuccess.value = false
    error.value = null

    try {
      const dateValue = typeof form.date === 'string'
        ? form.date
        : form.date.toISOString().slice(0, 10)

      const payload: ExpensePayload = {
        title: form.title.trim(),
        type: form.type as ExpensePayload['type'],
        amount: form.amount!,
        currency: form.currency as ExpensePayload['currency'],
        date: dateValue,
        payment_type: form.payment_type as ExpensePayload['payment_type'],
        description: form.description.trim() || undefined,
      }

      // Simulate API call for testing (remove when backend is available)
      await new Promise(resolve => setTimeout(resolve, 500))
      response.value = {
        id: crypto.randomUUID(),
        ...payload,
        created_at: new Date().toISOString(),
      }
      
      // Uncomment below to use real API
      // response.value = await submitExpense(payload)
      
      isSuccess.value = true
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit expense'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    form,
    errors,
    isLoading,
    isSuccess,
    error,
    response,
    validate,
    resetForm,
    submit,
  }
}

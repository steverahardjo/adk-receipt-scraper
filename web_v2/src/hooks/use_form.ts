import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { expenseSchema } from '../features/form/types'
import { createExpenseAPI } from '../features/form/expense_api' // ✅ add this

export type ExpenseFormValues = z.infer<typeof expenseSchema>

export function useExpenseForm() {
  const navigate = useNavigate()

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: 0,
      currency: 'USD',
      date: new Date(),
      type: 'Food',
      paymentMethod: 'E-Wallet',
      description: '',
    },
  })

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      await createExpenseAPI({
        userId: '123', // 🔁 replace with real user id
        ...data,
      })

      toast.success('Expense added')
      navigate({ to: '/' })
    } catch (err) {
      console.error(err)
      toast.error('Failed to add expense')
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  }
}

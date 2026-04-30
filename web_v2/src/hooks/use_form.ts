import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import type { Expense } from '../features/form/types'
import { expenseSchema } from '../features/form/types'
import {
  createExpenseAPI,
  createExpenseFromOCR,
} from '../features/form/expense_api'

export function useExpenseForm() {
  const navigate = useNavigate()

  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: 0,
      currency: 'USD',
      date: new Date(),
      type: 'Food',
      paymentMethod: 'Cash',
      description: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createExpenseAPI({
      userId: '123',
      ...data,
    })

    toast.success('Expense saved')
    navigate({ to: '/' })
  })

  const runOCR = async (file: File) => {
    const expense = await createExpenseFromOCR(file)

    form.reset(expense, {
      keepDirty: false,
      keepTouched: true,
    })

    toast.success('OCR autofill complete')
    return expense
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    runOCR,
  }
}

function dummy() {}

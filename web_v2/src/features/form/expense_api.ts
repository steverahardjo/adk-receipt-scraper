import type { Expense } from './types'
import { expenseSchema } from './types'

const apiUrl = 'https://api.example.com'

function parseExpense(data: any): Expense {
  return expenseSchema.parse({
    ...data,
    date: new Date(data.date),
  })
}

/* ---------- CREATE EXPENSE ---------- */

export async function createExpenseAPI(params: {
  userId: string
  title: string
  amount: number
  currency: Expense['currency']
  date: Date
  type: Expense['type']
  paymentMethod: Expense['paymentMethod']
  description?: string
}) {
  const res = await fetch(
    `${apiUrl}/deneb/expense/create/userid=${params.userId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        date: params.date.toISOString(),
      }),
    },
  )

  if (!res.ok) throw new Error('Failed to create expense')

  return parseExpense(await res.json())
}

export async function createExpenseFromOCR(file: File): Promise<Expense> {
  const fd = new FormData()
  fd.append('file', file)

  const res = await fetch(`${apiUrl}/deneb/expense/ocr`, {
    method: 'POST',
    body: fd,
  })

  if (!res.ok) throw new Error('OCR failed')

  return parseExpense(await res.json())
}

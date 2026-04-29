import type { Expense } from './types'

const apiUrl = 'https://api.example.com'

export async function createExpenseAPI(params: {
  userId: string
  title: string
  amount: number
  currency: string
  date: Date
  type: string
  paymentMethod: string
  description?: string
}) {
  const res = await fetch(
    `${apiUrl}/deneb/expense/create/userid=${params.userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: params.title,
        amount: params.amount,
        currency: params.currency,
        date: params.date.toISOString(),
        type: params.type,
        paymentMethod: params.paymentMethod,
        description: params.description,
      }),
    },
  )

  if (!res.ok) {
    throw new Error('Failed to create expense')
  }

  return res.json() as Promise<Expense>
}

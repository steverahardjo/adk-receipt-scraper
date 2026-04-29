import { z } from 'zod'

/* ---------- CONSTANTS ---------- */

export const TYPES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Other',
] as const

export const PAYMENTS = ['Cash', 'Card', 'Transfer', 'E-Wallet'] as const

export const CURRENCIES = {
  MYR: 'RM',
  USD: '$',
  EUR: '€',
  IDR: 'Rp',
} as const

const currencySchema = z.enum(['MYR', 'USD', 'EUR', 'IDR'])

/* ---------- EXPENSE ---------- */

export const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),

  amount: z.number().min(0.01, 'Amount must be > 0'),

  currency: currencySchema,

  date: z.date(),

  type: z.enum(TYPES),

  paymentMethod: z.enum(PAYMENTS),

  description: z.string().optional(),
})

/* ---------- TYPES ---------- */

export type Expense = z.infer<typeof expenseSchema>

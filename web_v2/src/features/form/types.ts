import { z } from 'zod'
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  MoreHorizontal,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
} from 'lucide-react'

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

export const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().min(0.01),
  currency: z.enum(['MYR', 'USD', 'EUR', 'IDR']),
  date: z.date(),
  type: z.enum(TYPES),
  paymentMethod: z.enum(PAYMENTS),
  description: z.string().optional(),
})

export type Expense = z.infer<typeof expenseSchema>

export const TYPE_UI = {
  Food: { icon: Utensils },
  Transport: { icon: Car },
  Shopping: { icon: ShoppingBag },
  Bills: { icon: Receipt },
  Other: { icon: MoreHorizontal },
} as const

export const PAYMENT_UI = {
  Cash: { icon: Wallet },
  Card: { icon: CreditCard },
  Transfer: { icon: Banknote },
  'E-Wallet': { icon: Smartphone },
} as const

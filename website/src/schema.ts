/*Absolute file filled with data object/schema being used in this repo */
import { z } from 'zod'

const TYPES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
]

const PAYMENTS = ['Cash', 'Debit', 'Credit', 'E-Wallet', 'Bank Transfer']

const CURRENCIES = {
  USD: '$',
  IDR: 'Rp',
  SGD: 'S$',
  MYR: 'RM',
  JPY: '¥',
}

const schema = z.object({
  title: z.string().min(1),
  amount: z.number().min(0.01),
  currency: z.string(),
  date: z.date(),
  type: z.string(),
  paymentMethod: z.string(),
  description: z.string().optional(),
})

export { schema, TYPES, PAYMENTS, CURRENCIES }
export type Expense = z.infer<typeof schema>

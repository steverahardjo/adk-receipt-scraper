import { z } from 'zod'

/* ------------------ constants ------------------ */

export const TYPES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Other',
] as const

export const PAYMENTS = ['Cash', 'Card', 'Transfer', 'E-Wallet'] as const

export const INCOME_SOURCES = ['Salary', 'Freelance', 'Gift', 'Other'] as const

export const CURRENCIES = {
  MYR: 'RM',
  USD: '$',
  EUR: '€',
  IDR: 'Rp',
} as const

export const FLOW = ['expense', 'income'] as const

/* ------------------ schema ------------------ */

export const entrySchema = z
  .object({
    id: z.string().uuid().optional(), // optional for local entries

    title: z.string().min(1),
    amount: z.number().min(0.01),

    currency: z.enum(
      Object.keys(CURRENCIES) as [keyof typeof CURRENCIES, ...string[]],
    ),

    date: z.date(),

    flow: z.enum(FLOW),

    // expense-only
    type: z.enum(TYPES).optional(),
    paymentMethod: z.enum(PAYMENTS).optional(),

    // income-only
    source: z.enum(INCOME_SOURCES).optional(),

    description: z.string().optional(),
  })

  // enforce expense rules
  .refine(
    (data) => data.flow === 'income' || (data.type && data.paymentMethod),
    {
      message: 'Expense must include type and payment method',
      path: ['type'],
    },
  )

  // enforce income rules
  .refine((data) => data.flow === 'expense' || data.source, {
    message: 'Income must include a source',
    path: ['source'],
  })

/* ------------------ types ------------------ */

export type Entry = z.infer<typeof entrySchema>

export type Flow = (typeof FLOW)[number]
export type Currency = keyof typeof CURRENCIES
export type ExpenseType = (typeof TYPES)[number]
export type PaymentMethod = (typeof PAYMENTS)[number]
export type IncomeSource = (typeof INCOME_SOURCES)[number]

/* ------------------ UI helpers ------------------ */

export const FLOW_UI = {
  expense: {
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-500',
    sign: '-',
  },
  income: {
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-500',
    sign: '+',
  },
} as const

export const TYPE_UI = {
  Food: { icon: 'Utensils' },
  Transport: { icon: 'Car' },
  Shopping: { icon: 'ShoppingBag' },
  Bills: { icon: 'Receipt' },
  Other: { icon: 'MoreHorizontal' },
} as const

export const PAYMENT_UI = {
  Cash: { icon: 'Wallet' },
  Card: { icon: 'CreditCard' },
  Transfer: { icon: 'Banknote' },
  'E-Wallet': { icon: 'Smartphone' },
} as const

export const INCOME_UI = {
  Salary: { icon: 'Banknote' },
  Freelance: { icon: 'Laptop' },
  Gift: { icon: 'Gift' },
  Other: { icon: 'MoreHorizontal' },
} as const

/* ------------------ helpers ------------------ */

export function formatAmount(entry: Entry) {
  const symbol = CURRENCIES[entry.currency]
  const { sign } = FLOW_UI[entry.flow]

  return `${sign}${symbol} ${entry.amount.toLocaleString()}`
}

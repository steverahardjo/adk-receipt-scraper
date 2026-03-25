/* schema.ts
   Core data structures used across the app
*/

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

/* ---------- ASSETS ---------- */

const Asset = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

const OwnedAssets = z.object({
  currentSaving: z.number().min(0),
  emergencyFund: z.number().min(0),
  assets: z.array(Asset).optional(),
})

/* ---------- CREDIT CARD ---------- */

const CreditCard = z.object({
  name: z.string().min(1),

  balance: z.number().min(0),

  creditLimit: z.number().min(1),

  statementDate: z.number().min(1).max(31).optional(),

  dueDate: z.number().min(1).max(31).optional(),

  description: z.string().optional(),
})

/* ---------- PROFILE ---------- */

const profileSchema = z.object({
  nickname: z.string().min(1),

  moneySource: z.string().min(1),

  monthBudget: z.number().min(0.01),

  currentMonthSpending: z.number().min(0),

  creditCards: z.array(CreditCard).optional(),

  ownedAssets: OwnedAssets.optional(),
})

/* ---------- EXPENSE ---------- */

const CategoryBudget = z.object({
  category: z.enum(TYPES).or(z.string()),
  limit: z.number().min(0),
})

const expenseSchema = z.object({
  title: z.string().min(1),

  amount: z.number().min(0.01),

  currency: currencySchema,

  date: z.date(),

  /* category optional and extendable */
  categoryBudgets: z.array(CategoryBudget).optional(),

  paymentMethod: z.enum(PAYMENTS),

  description: z.string().optional(),
})

/* ---------- REVENUE ---------- */

const revenueSchema = z.object({
  title: z.string().min(1),

  amount: z.number().min(0.01),

  currency: currencySchema,

  date: z.date(),

  description: z.string().optional(),
})

/* ---------- EXPORTS ---------- */

export {
  expenseSchema,
  revenueSchema,
  profileSchema,
  Asset,
  OwnedAssets,
  CreditCard,
}

/* ---------- TYPES ---------- */

export type Expense = z.infer<typeof expenseSchema>

export type Revenue = z.infer<typeof revenueSchema>

export type Profile = z.infer<typeof profileSchema>

export type AssetType = z.infer<typeof Asset>

export type OwnedAssetsType = z.infer<typeof OwnedAssets>

export type CreditCardType = z.infer<typeof CreditCard>

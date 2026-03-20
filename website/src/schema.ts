/*Absolute file filled with data object/schema being used in this repo */

import { z } from 'zod'

/* ---------- CONSTANTS ---------- */

const TYPES = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'] as const
const PAYMENTS = ['Cash', 'Card', 'Transfer', 'E-Wallet'] as const
const CURRENCIES = {
  MYR: 'RM',
  USD: '$',
  EUR: '€',
  IDR: 'Rp',
} as const

/* ---------- ASSET SCHEMA ---------- */

const Asset = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

const OwnedAssets = z.object({
  currentSaving: z.number().min(0),
  emergencyFund: z.number().min(0),
  assets: z.array(Asset),
})

/* ---------- PROFILE ---------- */

const profileSchema = z.object({
  nickname: z.string().min(1),
  moneySource: z.string().min(1),
  monthBudget: z.number().min(0.01),
  ownedAssets: OwnedAssets.optional(),
})

/* ---------- EXPENSE ---------- */

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().min(0.01),
  currency: z.string(),
  date: z.date(),
  type: z.enum(TYPES),
  paymentMethod: z.enum(PAYMENTS),
  description: z.string().optional(),
})

/* ---------- REVENUE ---------- */

const revenueSchema = z.object({
  title: z.string().min(1),
  amount: z.number().min(0.01),
  currency: z.string(),
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
  TYPES,
  PAYMENTS,
  CURRENCIES,
}

/* TYPES*/

export type Expense = z.infer<typeof expenseSchema>
export type Revenue = z.infer<typeof revenueSchema>
export type Profile = z.infer<typeof profileSchema>
export type AssetType = z.infer<typeof Asset>
export type OwnedAssetsType = z.infer<typeof OwnedAssets>

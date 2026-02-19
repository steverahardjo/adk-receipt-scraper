export type Currency = 'USD' | 'IDR' | 'SGD' | 'MYR' | 'JPY'

export type ExpenseType = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Health' | 'Other'

export type PaymentType = 'Cash' | 'Debit' | 'Credit' | 'E-Wallet' | 'Bank Transfer'

export interface ExpensePayload {
  title: string
  type: ExpenseType
  amount: number
  currency: Currency
  date: string
  payment_type: PaymentType
  description?: string
}

export interface ExpenseResponse {
  id: string
  status: 'success' | 'pending' | 'failed'
  message: string
  created_at: string
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

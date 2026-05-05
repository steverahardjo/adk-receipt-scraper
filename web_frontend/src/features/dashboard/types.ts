export type AccountType = 'liquid' | 'investment' | 'property' | 'liability'

export type Account = {
  id: string
  name: string
  type: AccountType
  balance: number
  currency: string
  color: string
}

export type Holding = {
  ticker: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
}

export type InvestmentAccount = Account & {
  type: 'investment'
  holdings: Holding[]
  costBasis: number
}

export type LiabilityAccount = Account & {
  type: 'liability'
  limit?: number
  interestRate?: number
}

export type NetWorthDataPoint = {
  date: string
  netWorth: number
  assets: number
  liabilities: number
}

export type NetWorthEvent = {
  date: string
  label: string
  type: 'salary' | 'purchase' | 'investment' | 'debt'
}

export type CashFlowMonth = {
  month: string
  income: number
  expense: number
}

export type CashFlowDay = {
  day: string
  income: number
  expense: number
}

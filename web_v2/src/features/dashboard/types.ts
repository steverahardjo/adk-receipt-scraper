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

export type NetWorthTrend = {
  date: string
  value: number
}

export type BudgetSummary = {
  monthlyLimit: number
  spentThisMonth: number
  daysLeftInMonth: number
}

/* ------------------ mock data ------------------ */

export function generateAccounts(): Account[] {
  return [
    { id: 'a1', name: 'BCA', type: 'liquid', balance: 5_200_000, currency: 'IDR', color: '#0066ae' },
    { id: 'a2', name: 'Mandiri', type: 'liquid', balance: 3_100_000, currency: 'IDR', color: '#004e8c' },
    { id: 'a3', name: 'Cash', type: 'liquid', balance: 1_800_000, currency: 'IDR', color: '#5baa8a' },
    { id: 'a4', name: 'GoPay', type: 'liquid', balance: 850_000, currency: 'IDR', color: '#00a85e' },
    { id: 'a5', name: 'DANA', type: 'liquid', balance: 500_000, currency: 'IDR', color: '#1479d0' },
    {
      id: 'a6', name: 'Stocks', type: 'investment', balance: 85_000_000, currency: 'IDR', color: '#c4904a',
      holdings: [
        { ticker: 'BBCA', name: 'Bank BCA', shares: 200, avgPrice: 8_000, currentPrice: 9_500 },
        { ticker: 'BBRI', name: 'Bank BRI', shares: 500, avgPrice: 4_200, currentPrice: 5_100 },
        { ticker: 'TLKM', name: 'Telkom', shares: 300, avgPrice: 3_800, currentPrice: 3_200 },
      ],
      costBasis: 85_000_000,
    } as InvestmentAccount,
    {
      id: 'a7', name: 'Crypto', type: 'investment', balance: 12_000_000, currency: 'IDR', color: '#c97a6b',
      holdings: [
        { ticker: 'BTC', name: 'Bitcoin', shares: 0.02, avgPrice: 600_000_000, currentPrice: 750_000_000 },
        { ticker: 'ETH', name: 'Ethereum', shares: 0.5, avgPrice: 25_000_000, currentPrice: 18_000_000 },
      ],
      costBasis: 12_000_000,
    } as InvestmentAccount,
    {
      id: 'a8', name: 'Pension Fund', type: 'investment', balance: 60_000_000, currency: 'IDR', color: '#5baa8a',
      holdings: [
        { ticker: 'DPLK', name: 'DPLK Mandiri', shares: 1, avgPrice: 60_000_000, currentPrice: 60_000_000 },
      ],
      costBasis: 60_000_000,
    } as InvestmentAccount,
    { id: 'a9', name: 'KPR House', type: 'property', balance: 350_000_000, currency: 'IDR', color: '#8a7a6b' },
    {
      id: 'a10', name: 'CC BCA', type: 'liability', balance: -12_500_000, currency: 'IDR', color: '#d46a5a',
      limit: 20_000_000, interestRate: 2.25,
    } as LiabilityAccount,
    {
      id: 'a11', name: 'KPR Loan', type: 'liability', balance: -45_000_000, currency: 'IDR', color: '#b85e50',
      limit: 500_000_000, interestRate: 9.5,
    } as LiabilityAccount,
  ]
}

export function generateNetWorthTrend(): NetWorthTrend[] {
  const base = 170_000_000
  return [
    { date: 'Oct', value: base },
    { date: 'Nov', value: Math.round(base * 1.02) },
    { date: 'Dec', value: Math.round(base * 1.015) },
    { date: 'Jan', value: Math.round(base * 1.04) },
    { date: 'Feb', value: Math.round(base * 1.07) },
    { date: 'Mar', value: Math.round(base * 1.12) },
  ]
}

export function generateBudget(): BudgetSummary {
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const daysLeft = endOfMonth.getDate() - now.getDate()

  return {
    monthlyLimit: 8_500_000,
    spentThisMonth: 3_300_000,
    daysLeftInMonth: Math.max(1, daysLeft),
  }
}

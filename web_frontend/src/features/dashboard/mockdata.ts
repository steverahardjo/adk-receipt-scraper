import { generateEntries } from '../records/mock_data'
import type {
  Account,
  InvestmentAccount,
  LiabilityAccount,
  NetWorthDataPoint,
  NetWorthEvent,
  CashFlowMonth,
  CashFlowDay,
} from './types'

export { generateEntries }

/* ------------------ accounts ------------------ */

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

/* ------------------ net worth ------------------ */

export function generateNetWorthData(): NetWorthDataPoint[] {
  const points: NetWorthDataPoint[] = []
  const startLiabilities = 62_000_000
  const startAssets = 232_000_000

  for (let i = 0; i < 12; i++) {
    const d = new Date(2025, 3 + i, 1)
    const label = d.toLocaleDateString('en', { month: 'short', year: '2-digit' })
    const assets = Math.round(startAssets + i * 4_200_000 + (i % 3) * 1_800_000)
    const liabilities = Math.round(startLiabilities - i * 370_000 - (i % 4) * 500_000)
    points.push({
      date: label,
      netWorth: assets - liabilities,
      assets,
      liabilities,
    })
  }
  return points
}

export function generateNetWorthEvents(): NetWorthEvent[] {
  return [
    { date: 'May 25', label: 'Salary', type: 'salary' },
    { date: 'Jun 25', label: 'Salary', type: 'salary' },
    { date: 'Jul 25', label: 'Car Service', type: 'purchase' },
    { date: 'Aug 25', label: 'Salary', type: 'salary' },
    { date: 'Sep 25', label: 'Bonus', type: 'salary' },
    { date: 'Oct 25', label: 'Salary', type: 'salary' },
    { date: 'Nov 25', label: 'Laptop', type: 'purchase' },
    { date: 'Dec 25', label: 'Stock Buy', type: 'investment' },
    { date: 'Jan 26', label: 'Salary', type: 'salary' },
    { date: 'Feb 26', label: 'KPR Payment', type: 'debt' },
  ]
}

/* ------------------ cash flow ------------------ */

export function generateCashFlow(): CashFlowMonth[] {
  return [
    { month: 'Nov', income: 8_200_000, expense: 4_100_000 },
    { month: 'Dec', income: 8_000_000, expense: 4_800_000 },
    { month: 'Jan', income: 8_500_000, expense: 3_900_000 },
    { month: 'Feb', income: 8_300_000, expense: 4_200_000 },
    { month: 'Mar', income: 8_500_000, expense: 3_300_000 },
  ]
}

export function generateCashFlowDays(): CashFlowDay[] {
  const now = new Date()
  const days: CashFlowDay[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    days.push({
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      income: Math.round(Math.random() * 2_000_000 + 500_000),
      expense: Math.round(Math.random() * 800_000 + 100_000),
    })
  }
  return days
}

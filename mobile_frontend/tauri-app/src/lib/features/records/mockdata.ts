import type { Transaction } from './types'

const merchants = [
  { merchant: 'Starbucks', category: 'Food & Drinks', icon: 'food', flow: 'expense' as const, amount: () => 45000 + Math.round(Math.random() * 15000) },
  { merchant: 'Pertamina', category: 'Transportation', icon: 'transport', flow: 'expense' as const, amount: () => 200000 + Math.round(Math.random() * 200000) },
  { merchant: 'Indomaret', category: 'Shopping', icon: 'shopping', flow: 'expense' as const, amount: () => 25000 + Math.round(Math.random() * 50000) },
  { merchant: 'GoPay Top-Up', category: 'E-Wallet', icon: 'wallet', flow: 'expense' as const, amount: () => 50000 + Math.round(Math.random() * 200000) },
  { merchant: 'PLN', category: 'Bills', icon: 'bill', flow: 'expense' as const, amount: () => 500000 + Math.round(Math.random() * 1000000) },
  { merchant: 'GoFood', category: 'Food & Drinks', icon: 'food', flow: 'expense' as const, amount: () => 35000 + Math.round(Math.random() * 65000) },
  { merchant: 'GrabCar', category: 'Transportation', icon: 'transport', flow: 'expense' as const, amount: () => 25000 + Math.round(Math.random() * 75000) },
  { merchant: 'Tokopedia', category: 'Shopping', icon: 'shopping', flow: 'expense' as const, amount: () => 100000 + Math.round(Math.random() * 900000) },
  { merchant: 'Salary', category: 'Income', icon: 'income', flow: 'income' as const, amount: () => 8000000 + Math.round(Math.random() * 2000000) },
  { merchant: 'Freelance', category: 'Income', icon: 'income', flow: 'income' as const, amount: () => 1000000 + Math.round(Math.random() * 3000000) },
  { merchant: 'Dividend', category: 'Investment', icon: 'investment', flow: 'income' as const, amount: () => 200000 + Math.round(Math.random() * 500000) },
  { merchant: 'Alfamart', category: 'Shopping', icon: 'shopping', flow: 'expense' as const, amount: () => 15000 + Math.round(Math.random() * 35000) },
  { merchant: 'Netflix', category: 'Entertainment', icon: 'entertainment', flow: 'expense' as const, amount: () => 180000 },
  { merchant: 'Telkomsel', category: 'Bills', icon: 'bill', flow: 'expense' as const, amount: () => 100000 + Math.round(Math.random() * 100000) },
  { merchant: 'BPJS', category: 'Bills', icon: 'bill', flow: 'expense' as const, amount: () => 150000 },
  { merchant: 'McDonalds', category: 'Food & Drinks', icon: 'food', flow: 'expense' as const, amount: () => 35000 + Math.round(Math.random() * 45000) },
  { merchant: 'Shopee', category: 'Shopping', icon: 'shopping', flow: 'expense' as const, amount: () => 50000 + Math.round(Math.random() * 500000) },
]

function randomDate(daysBack: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack))
  d.setHours(Math.floor(Math.random() * 14) + 7, Math.floor(Math.random() * 60))
  return d
}

export function generateTransactions(count = 200): Transaction[] {
  const result: Transaction[] = []
  for (let i = 0; i < count; i++) {
    const m = merchants[Math.floor(Math.random() * merchants.length)]
    result.push({
      id: `tx-${i}`,
      amount: m.amount(),
      merchant: m.merchant,
      category: m.category,
      categoryIcon: m.icon,
      flow: m.flow,
      date: randomDate(60),
    })
  }
  result.sort((a, b) => b.date.getTime() - a.date.getTime())
  return result
}

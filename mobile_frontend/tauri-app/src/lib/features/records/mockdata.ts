import type { Entry } from './types'

const expenseEntries = [
  { title: 'Starbucks', type: 'Food' as const, amount: () => 45000 + Math.round(Math.random() * 15000) },
  { title: 'GoFood', type: 'Food' as const, amount: () => 35000 + Math.round(Math.random() * 65000) },
  { title: 'McDonalds', type: 'Food' as const, amount: () => 35000 + Math.round(Math.random() * 45000) },
  { title: 'Pertamina', type: 'Transport' as const, amount: () => 200000 + Math.round(Math.random() * 200000) },
  { title: 'GrabCar', type: 'Transport' as const, amount: () => 25000 + Math.round(Math.random() * 75000) },
  { title: 'Indomaret', type: 'Shopping' as const, amount: () => 25000 + Math.round(Math.random() * 50000) },
  { title: 'Tokopedia', type: 'Shopping' as const, amount: () => 100000 + Math.round(Math.random() * 900000) },
  { title: 'Alfamart', type: 'Shopping' as const, amount: () => 15000 + Math.round(Math.random() * 35000) },
  { title: 'Shopee', type: 'Shopping' as const, amount: () => 50000 + Math.round(Math.random() * 500000) },
  { title: 'PLN', type: 'Bills' as const, amount: () => 500000 + Math.round(Math.random() * 1000000) },
  { title: 'Telkomsel', type: 'Bills' as const, amount: () => 100000 + Math.round(Math.random() * 100000) },
  { title: 'BPJS', type: 'Bills' as const, amount: () => 150000 },
  { title: 'Netflix', type: 'Other' as const, amount: () => 180000 },
  { title: 'GoPay Top-Up', type: 'Other' as const, amount: () => 50000 + Math.round(Math.random() * 200000) },
]

const payments = ['Cash', 'Card', 'Transfer', 'E-Wallet'] as const
const incomeSources = ['Salary', 'Freelance', 'Gift', 'Other'] as const

function randomDate(daysBack: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack))
  d.setHours(Math.floor(Math.random() * 14) + 7, Math.floor(Math.random() * 60))
  return d
}

const receipts = [
  'https://placehold.co/400x600/png?text=Receipt+1',
  'https://placehold.co/400x600/png?text=Receipt+2',
  'https://placehold.co/400x600/png?text=Receipt+3',
]

export function generateEntries(count = 200): Entry[] {
  const result: Entry[] = []
  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() < 0.15
    if (isIncome) {
      const source = incomeSources[Math.floor(Math.random() * incomeSources.length)]
      result.push({
        id: `tx-${i}`,
        title: source === 'Salary' ? 'Monthly Salary' : source === 'Freelance' ? 'Freelance Project' : source === 'Gift' ? 'Birthday Gift' : 'Other Income',
        amount: source === 'Salary' ? 8000000 + Math.round(Math.random() * 2000000) : source === 'Freelance' ? 1000000 + Math.round(Math.random() * 3000000) : 200000 + Math.round(Math.random() * 500000),
        currency: 'IDR',
        date: randomDate(60),
        flow: 'income',
        source,
        description: '',
      })
    } else {
      const e = expenseEntries[Math.floor(Math.random() * expenseEntries.length)]
      const hasReceipt = Math.random() < 0.2
      result.push({
        id: `tx-${i}`,
        title: e.title,
        amount: e.amount(),
        currency: 'IDR',
        date: randomDate(60),
        flow: 'expense',
        type: e.type,
        paymentMethod: payments[Math.floor(Math.random() * payments.length)],
        description: '',
        documentLink: hasReceipt ? receipts[Math.floor(Math.random() * receipts.length)] : undefined,
      })
    }
  }
  result.sort((a, b) => b.date.getTime() - a.date.getTime())
  return result
}

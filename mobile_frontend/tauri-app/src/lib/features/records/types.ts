export const TYPES = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'] as const

export const PAYMENTS = ['Cash', 'Card', 'Transfer', 'E-Wallet'] as const

export const INCOME_SOURCES = ['Salary', 'Freelance', 'Gift', 'Other'] as const

export const CURRENCIES = {
  MYR: 'RM',
  USD: '$',
  EUR: '€',
  IDR: 'Rp',
} as const

export const FLOW = ['expense', 'income'] as const

export interface Entry {
  id: string
  title: string
  amount: number
  currency: keyof typeof CURRENCIES
  date: Date
  flow: (typeof FLOW)[number]
  type?: (typeof TYPES)[number]
  paymentMethod?: (typeof PAYMENTS)[number]
  source?: (typeof INCOME_SOURCES)[number]
  description?: string
  documentLink?: string
}

export type Period = '1w' | '1m' | '3m' | '1y' | 'all'

export const TYPE_UI: Record<string, string> = {
  Food: 'food',
  Transport: 'transport',
  Shopping: 'shopping',
  Bills: 'bill',
  Other: 'other',
}

export const PAYMENT_UI: Record<string, string> = {
  Cash: 'cash',
  Card: 'card',
  Transfer: 'transfer',
  'E-Wallet': 'ewallet',
}

export const INCOME_UI: Record<string, string> = {
  Salary: 'income',
  Freelance: 'freelance',
  Gift: 'gift',
  Other: 'other',
}

export function formatAmount(entry: Entry) {
  const symbol = CURRENCIES[entry.currency] || 'Rp'
  const sign = entry.flow === 'income' ? '+' : '-'
  return `${sign}${symbol} ${entry.amount.toLocaleString('id-ID')}`
}

export function typeIcon(type?: string, flow?: string): string {
  if (flow === 'income') return 'income'
  return TYPE_UI[type || 'Other'] || 'other'
}

export function groupByDate(entries: Entry[]): { label: string; items: Entry[] }[] {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const startOfWeek = new Date(today)
  startOfWeek.setDate(startOfWeek.getDate() - today.getDay())

  const groups: { label: string; items: Entry[] }[] = []

  function pushGroup(label: string, items: Entry[]) {
    if (items.length > 0) groups.push({ label, items })
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const isCurrentWeek = (d: Date) => d >= startOfWeek && !isSameDay(d, today) && !isSameDay(d, yesterday)

  const isCurrentMonth = (d: Date) =>
    d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() && !isCurrentWeek(d) && !isSameDay(d, today) && !isSameDay(d, yesterday)

  pushGroup('Today', entries.filter((e) => isSameDay(e.date, today)))
  pushGroup('Yesterday', entries.filter((e) => isSameDay(e.date, yesterday)))
  pushGroup('This Week', entries.filter((e) => isCurrentWeek(e.date)))
  pushGroup('This Month', entries.filter((e) => isCurrentMonth(e.date)))

  const earlier = entries.filter((e) => !isSameDay(e.date, today) && !isSameDay(e.date, yesterday) && !isCurrentWeek(e.date) && !isCurrentMonth(e.date))
  if (earlier.length > 0) pushGroup('Earlier', earlier)

  return groups
}

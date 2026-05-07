export interface Transaction {
  id: string
  merchant: string
  amount: number
  category: string
  categoryIcon: string
  date: Date
  flow: 'income' | 'expense'
}

export type Period = '1w' | '1m' | '3m' | '1y' | 'all'

export function groupByDate(entries: Transaction[]): { label: string; items: Transaction[] }[] {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const startOfWeek = new Date(today)
  startOfWeek.setDate(startOfWeek.getDate() - today.getDay())

  const groups: { label: string; items: Transaction[] }[] = []

  function pushGroup(label: string, items: Transaction[]) {
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

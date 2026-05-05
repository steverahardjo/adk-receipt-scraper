import { useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import type { RecurringItem } from './types'

type Props = {
  items: RecurringItem[]
  selectedDay: Date | undefined
  onSelectDay: (day: Date | undefined) => void
}

function getDueDatesThisMonth(items: RecurringItem[], base: Date) {
  const year = base.getFullYear()
  const month = base.getMonth()
  const dates: Date[] = []
  for (const item of items) {
    if (!item.active) continue
    const day = Math.min(item.dueDay, new Date(year, month + 1, 0).getDate())
    dates.push(new Date(year, month, day))
  }
  return dates
}

export default function RecurringCalendar({ items, selectedDay, onSelectDay }: Props) {
  const dueDates = useMemo(() => {
    const now = selectedDay || new Date()
    return getDueDatesThisMonth(items, now)
  }, [items, selectedDay])

  return (
    <div className="rounded-xl border bg-card p-2 sm:p-3 overflow-x-auto">
      <Calendar
        selected={selectedDay}
        onSelect={onSelectDay}
        modifiers={{ due: dueDates }}
        modifiersStyles={{
          due: {
            fontWeight: 600,
            backgroundColor: 'color-mix(in oklab, var(--ochre) 18%, transparent)',
            color: 'var(--ink)',
            borderRadius: 'var(--radius)',
          },
        }}
        className="mx-auto"
      />
    </div>
  )
}

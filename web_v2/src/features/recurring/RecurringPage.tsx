'use client'

import { useMemo, useState } from 'react'
import type { RecurringItem } from './types'
import { generateRecurring } from './types'
import RecurringCard from './RecurringCard'
import RecurringCalendar from './RecurringCalendar'
import { isSameDay, format } from 'date-fns'

function SummaryBar({ items }: { items: RecurringItem[] }) {
  const stats = useMemo(() => {
    const active = items.filter((i) => i.active)
    const monthlyTotal = active
      .filter((i) => i.frequency === 'monthly')
      .reduce((s, i) => s + i.amount, 0)
    const yearlyTotal = active
      .filter((i) => i.frequency === 'yearly')
      .reduce((s, i) => s + i.amount, 0)

    const now = new Date()
    const endOfWeek = new Date(now)
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()))
    const dueThisWeek = active.filter((i) => {
      const due = new Date(now.getFullYear(), now.getMonth(), i.dueDay)
      return due >= now && due <= endOfWeek
    })

    return {
      active: active.length,
      monthlyTotal,
      yearlyTotal,
      grandTotal: monthlyTotal + Math.round(yearlyTotal / 12),
      dueThisWeek: dueThisWeek.length,
    }
  }, [items])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Monthly Total
        </span>
        <p className="text-base sm:text-xl font-bold text-foreground tabular-nums mt-0.5 sm:mt-1 truncate">
          Rp {stats.grandTotal.toLocaleString()}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Active
        </span>
        <p className="text-base sm:text-xl font-bold text-emerald-600 tabular-nums mt-0.5 sm:mt-1">
          {stats.active}
          <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">
            subscriptions
          </span>
        </p>
      </div>

      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Due This Week
        </span>
        <p className="text-base sm:text-xl font-bold text-primary tabular-nums mt-0.5 sm:mt-1">
          {stats.dueThisWeek}
          <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">
            bills
          </span>
        </p>
      </div>

      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Yearly Total
        </span>
        <p className="text-base sm:text-xl font-bold text-muted-foreground tabular-nums mt-0.5 sm:mt-1 truncate">
          Rp {stats.yearlyTotal.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default function RecurringPage() {
  const [items] = useState<RecurringItem[]>(() => generateRecurring())
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)

  const filtered = useMemo(() => {
    let result = items
    if (statusFilter === 'active') result = result.filter((i) => i.active)
    if (statusFilter === 'inactive') result = result.filter((i) => !i.active)

    if (selectedDay) {
      result = result.filter((i) => {
        if (!i.active) return false
        const day = Math.min(i.dueDay, new Date(selectedDay.getFullYear(), selectedDay.getMonth() + 1, 0).getDate())
        const dueDate = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), day)
        return isSameDay(dueDate, selectedDay)
      })
    }
    return result
  }, [items, statusFilter, selectedDay])

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Daily Needs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Recurring bills and subscriptions
        </p>
      </div>

      <SummaryBar items={items} />

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="sm:w-auto shrink-0">
          <RecurringCalendar
            items={items}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex border rounded-lg sm:rounded-xl overflow-hidden">
              {(['all', 'active', 'inactive'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setStatusFilter(f)
                    setSelectedDay(undefined)
                  }}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm capitalize font-medium transition-colors ${
                    statusFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {selectedDay && (
              <button
                onClick={() => setSelectedDay(undefined)}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear date filter
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-32 rounded-xl border border-dashed text-muted-foreground text-sm">
                {selectedDay
                  ? `No bills due on ${format(selectedDay, 'dd MMM yyyy')}`
                  : 'No recurring items found'}
              </div>
            ) : (
              filtered.map((item) => <RecurringCard key={item.id} item={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import type { Entry } from '../records/types'

type Props = {
  entries: Entry[]
}

export default function CashFlowStrip({ entries }: Props) {
  const stats = useMemo(() => {
    let income = 0
    let expense = 0
    for (const e of entries) {
      if (e.flow === 'income') income += e.amount
      else expense += e.amount
    }
    const net = income - expense
    const pct = income > 0 ? Math.round((expense / income) * 100) : 0
    return { income, expense, net, pct }
  }, [entries])

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 px-4 py-2.5 rounded-xl border bg-card text-xs sm:text-sm">
      <span>
        <span className="text-muted-foreground">Income </span>
        <span className="font-medium text-emerald-600 tabular-nums">
          +Rp {stats.income.toLocaleString()}
        </span>
      </span>
      <span className="text-muted-foreground/30">|</span>
      <span>
        <span className="text-muted-foreground">Expenses </span>
        <span className="font-medium text-rose-600 tabular-nums">
          -Rp {stats.expense.toLocaleString()}
        </span>
      </span>
      <span className="text-muted-foreground/30">|</span>
      <span>
        <span className="text-muted-foreground">Net </span>
        <span
          className={`font-semibold tabular-nums ${
            stats.net >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {stats.net >= 0 ? '+' : '-'}Rp {Math.abs(stats.net).toLocaleString()}
        </span>
      </span>
      <span className="text-muted-foreground/30 hidden sm:inline">|</span>
      <span className="hidden sm:inline">
        <span className="text-muted-foreground">Spent </span>
        <span className="font-medium text-foreground tabular-nums">
          {stats.pct}% of income
        </span>
      </span>
    </div>
  )
}

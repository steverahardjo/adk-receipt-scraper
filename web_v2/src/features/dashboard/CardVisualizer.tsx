'use client'

import { useMemo } from 'react'
import type { Entry } from '../records/types'

type Props = {
  entries: Entry[]
}

export default function CardVisualizer({ entries }: Props) {
  const stats = useMemo(() => {
    let income = 0
    let expense = 0
    for (const e of entries) {
      if (e.flow === 'income') income += e.amount
      else expense += e.amount
    }
    return { income, expense, net: income - expense }
  }, [entries])

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border bg-card p-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          Income
        </span>
        <p className="text-sm sm:text-base font-bold text-emerald-600 tabular-nums mt-0.5 truncate">
          +Rp {stats.income.toLocaleString()}
        </p>
      </div>
      <div className="rounded-xl border bg-card p-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          Expense
        </span>
        <p className="text-sm sm:text-base font-bold text-rose-600 tabular-nums mt-0.5 truncate">
          -Rp {stats.expense.toLocaleString()}
        </p>
      </div>
      <div className="rounded-xl border bg-card p-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          Net
        </span>
        <p
          className={`text-sm sm:text-base font-bold tabular-nums mt-0.5 truncate ${
            stats.net >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {stats.net >= 0 ? '+' : '-'}Rp {Math.abs(stats.net).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

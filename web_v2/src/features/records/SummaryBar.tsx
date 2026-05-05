'use client'

import { useMemo } from 'react'
import type { Entry } from './types'

type Props = {
  data: Entry[]
  filtered: Entry[]
}

export default function SummaryBar({ data, filtered }: Props) {
  const stats = useMemo(() => {
    let totalIncome = 0
    let totalExpense = 0
    for (const e of filtered) {
      if (e.flow === 'income') totalIncome += e.amount
      else totalExpense += e.amount
    }
    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      shown: filtered.length,
      total: data.length,
    }
  }, [data, filtered])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Income
        </span>
        <p className="text-base sm:text-xl font-bold text-emerald-600 tabular-nums mt-0.5 sm:mt-1 truncate">
          +Rp {stats.totalIncome.toLocaleString()}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Expenses
        </span>
        <p className="text-base sm:text-xl font-bold text-rose-600 tabular-nums mt-0.5 sm:mt-1 truncate">
          -Rp {stats.totalExpense.toLocaleString()}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Net
        </span>
        <p
          className={`text-base sm:text-xl font-bold tabular-nums mt-0.5 sm:mt-1 truncate ${
            stats.net >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {stats.net >= 0 ? '+' : '-'}Rp {Math.abs(stats.net).toLocaleString()}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Transactions
        </span>
        <p className="text-base sm:text-xl font-bold text-foreground tabular-nums mt-0.5 sm:mt-1 truncate">
          {stats.shown.toLocaleString()}
          <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">
            / {stats.total.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  )
}

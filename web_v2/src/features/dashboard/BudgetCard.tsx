'use client'

import { useState } from 'react'
import type { BudgetSummary } from './types'

type Props = {
  budget: BudgetSummary
}

export default function BudgetCard({ budget }: Props) {
  const [mode, setMode] = useState<'month' | 'day'>('month')
  const progress = Math.min(budget.spentThisMonth / budget.monthlyLimit, 1)
  const remaining = budget.monthlyLimit - budget.spentThisMonth
  const perDay = Math.round(remaining / budget.daysLeftInMonth)

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Monthly Budget
        </span>

        <div className="flex border rounded-md overflow-hidden text-[11px]">
          {(['month', 'day'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2 py-0.5 font-medium transition-colors ${
                mode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground'
              }`}
            >
              {m === 'month' ? 'Month' : 'Day'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
        Rp {budget.monthlyLimit.toLocaleString()}
        <span className="text-xs font-normal text-muted-foreground ml-1">/mo</span>
      </p>

      <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>Rp {budget.spentThisMonth.toLocaleString()} spent</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>

      <p className="mt-3 text-sm font-medium text-foreground">
        {mode === 'month'
          ? `Rp ${remaining.toLocaleString()} left this month`
          : `Rp ${perDay.toLocaleString()} / day (${budget.daysLeftInMonth} days left)`}
      </p>
    </div>
  )
}

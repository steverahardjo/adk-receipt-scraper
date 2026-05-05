'use client'

import { useMemo } from 'react'
import type { Account } from './types'

type Props = {
  accounts: Account[]
}

export default function NetWorthCard({ accounts }: Props) {
  const stats = useMemo(() => {
    const assets = accounts
      .filter((a) => a.type !== 'liability')
      .reduce((s, a) => s + Math.max(0, a.balance), 0)
    const liabilities = accounts
      .filter((a) => a.type === 'liability')
      .reduce((s, a) => s + Math.abs(Math.min(0, a.balance)), 0)
    const netWorth = assets - liabilities
    const latestChange = 12.0
    return { assets, liabilities, netWorth, latestChange }
  }, [accounts])

  return (
    <div className="rounded-xl border bg-card/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm">
      <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
        Net Worth
      </span>
      <div className="flex items-baseline gap-2 mt-0.5">
        <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
          Rp {stats.netWorth.toLocaleString()}
        </p>
        <span
          className={`text-xs font-medium ${
            stats.latestChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {stats.latestChange >= 0 ? '+' : ''}{stats.latestChange.toFixed(1)}%
        </span>
      </div>
      <div className="flex gap-3 mt-1 text-[11px]">
        <span className="text-emerald-600 font-medium tabular-nums">
          Rp {stats.assets.toLocaleString()}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="text-rose-600 font-medium tabular-nums">
          Rp {stats.liabilities.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

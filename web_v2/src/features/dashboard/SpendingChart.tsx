'use client'

import { useMemo } from 'react'
import type { Entry } from '../records/types'

type Props = {
  entries: Entry[]
}

const CAT_COLORS: Record<string, string> = {
  Food: '#c97a6b',
  Transport: '#c4904a',
  Shopping: '#a8783a',
  Bills: '#3d8a7a',
  Other: '#7a706a',
}

export default function SpendingChart({ entries }: Props) {
  const categories = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of entries) {
      if (e.flow !== 'expense') continue
      const t = e.type || 'Other'
      map.set(t, (map.get(t) || 0) + e.amount)
    }
    const total = [...map.values()].reduce((s, v) => s + v, 0)
    return [...map.entries()]
      .map(([label, value]) => ({ label, value, pct: total > 0 ? Math.round((value / total) * 100) : 0 }))
      .sort((a, b) => b.value - a.value)
  }, [entries])

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          This Month Spending
        </span>
        <p className="text-sm text-muted-foreground mt-3">No expense data this month</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        This Month Spending
      </span>

      <div className="mt-4 space-y-3">
        {categories.map((c) => (
          <div key={c.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground font-medium">{c.label}</span>
              <span className="text-muted-foreground tabular-nums">{c.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${c.pct}%`,
                  backgroundColor: CAT_COLORS[c.label] || '#7a706a',
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
              Rp {c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

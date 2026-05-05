'use client'

import { useMemo } from 'react'
import { ResponsivePie } from '@nivo/pie'
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

export default function ExpensePie({ entries }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of entries) {
      if (e.flow !== 'expense') continue
      const t = e.type || 'Other'
      map.set(t, (map.get(t) || 0) + e.amount)
    }
    return [...map.entries()]
      .map(([label, value]) => ({
        id: label,
        label,
        value,
        color: CAT_COLORS[label] || '#7a706a',
      }))
      .sort((a, b) => b.value - a.value)
  }, [entries])

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Spending by Category
        </span>
        <p className="text-sm text-muted-foreground mt-4">No expenses this month</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Spending by Category
      </span>
      <div className="h-48 sm:h-56 mt-2">
        <ResponsivePie
          data={data}
          margin={{ top: 8, right: 80, bottom: 8, left: 8 }}
          innerRadius={0.55}
          padAngle={2}
          cornerRadius={4}
          colors={{ datum: 'data.color' }}
          borderWidth={0}
          enableArcLinkLabels={false}
          arcLabelsSkipAngle={20}
          arcLabelsTextColor="#faf8f5"
          arcLabelsRadiusOffset={0.55}
          enableArcLabels={false}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 8,
              translateY: 0,
              itemsSpacing: 6,
              itemWidth: 80,
              itemHeight: 18,
              itemTextColor: '#7a706a',
              symbolSize: 10,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: { itemTextColor: '#2c2420' },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}

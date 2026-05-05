'use client'

import { useMemo, useState } from 'react'
import { ResponsivePie } from '@nivo/pie'
import type { Account } from './types'

type Props = {
  accounts: Account[]
}

const COLORS: Record<string, string> = {
  BCA: '#0066ae',
  Mandiri: '#004e8c',
  Cash: '#5baa8a',
  GoPay: '#00a85e',
  DANA: '#1479d0',
  'CC BCA': '#d46a5a',
}

export default function AccountCards({ accounts }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const data = useMemo(() => {
    const liquid = accounts.filter((a) => a.type === 'liquid')
    const credit = accounts.filter((a) => a.type === 'liability' && a.balance < 0)
    return [...liquid, ...credit].map((a) => ({
      id: a.name,
      label: a.name,
      value: Math.abs(a.balance),
      color: COLORS[a.name] || '#7a706a',
      isCredit: a.type === 'liability',
    }))
  }, [accounts])

  const total = data.reduce((s, d) => s + d.value, 0)

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          Accounts
        </span>
        <p className="text-sm text-muted-foreground mt-2">No accounts</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          Accounts
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          Total Rp {total.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="h-36 sm:h-40 w-36 sm:w-40 shrink-0">
          <ResponsivePie
            data={data}
            margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            innerRadius={0.65}
            padAngle={2}
            cornerRadius={4}
            colors={{ datum: 'data.color' }}
            borderWidth={0}
            enableArcLinkLabels={false}
            enableArcLabels={false}
            onClick={(d) => setSelected(selected === String(d.id) ? null : String(d.id))}
          />
        </div>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 min-w-0">
          {data.map((d) => {
            const pct = Math.round((d.value / total) * 100)
            const isActive = selected === d.id

            return (
              <button
                key={d.id}
                onClick={() => setSelected(isActive ? null : d.id)}
                className={`flex items-center gap-1.5 text-left py-0.5 rounded transition-opacity ${
                  selected && !isActive ? 'opacity-40' : ''
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-foreground truncate">
                      {d.id}
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <p
                    className={`text-[11px] tabular-nums ${
                      d.isCredit ? 'text-rose-600' : 'text-foreground'
                    }`}
                  >
                    {d.isCredit ? '-' : ''}Rp {d.value.toLocaleString()}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

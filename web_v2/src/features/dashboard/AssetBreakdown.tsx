'use client'

import { useMemo, useState } from 'react'
import type { Account } from './types'
import { Landmark, TrendingUp, Home, Cpu, Wallet, PiggyBank } from 'lucide-react'

type AssetGroup = {
  label: string
  icon: typeof Landmark
  accounts: Account[]
  total: number
  color: string
}

type Props = {
  accounts: Account[]
}

const GROUP_CONFIG: { key: string; label: string; icon: typeof Landmark; color: string; types: string[]; names?: string[] }[] = [
  { key: 'liquid', label: 'Liquid', icon: Wallet, color: '#3d8a7a', types: ['liquid'] },
  { key: 'stocks', label: 'Stocks', icon: TrendingUp, color: '#c4904a', types: ['investment'], names: ['Stocks'] },
  { key: 'crypto', label: 'Crypto', icon: Cpu, color: '#c97a6b', types: ['investment'], names: ['Crypto'] },
  { key: 'pension', label: 'Pension', icon: PiggyBank, color: '#5baa8a', types: ['investment'], names: ['Pension Fund'] },
  { key: 'property', label: 'Property', icon: Home, color: '#8a7a6b', types: ['property'] },
]

export default function AssetBreakdown({ accounts }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const groups = useMemo(() => {
    const result: AssetGroup[] = []
    for (const cfg of GROUP_CONFIG) {
      const filtered = accounts.filter(
        (a) =>
          cfg.types.includes(a.type) &&
          (!cfg.names || cfg.names.includes(a.name)),
      )
      if (filtered.length === 0) continue
      result.push({
        label: cfg.label,
        icon: cfg.icon,
        accounts: filtered,
        total: filtered.reduce((s, a) => s + Math.max(0, a.balance), 0),
        color: cfg.color,
      })
    }
    return result.sort((a, b) => b.total - a.total)
  }, [accounts])

  const grandTotal = groups.reduce((s, g) => s + g.total, 0)

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Assets
        </span>
        <p className="text-sm text-muted-foreground mt-3">No assets</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Assets
      </span>

      <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums mt-1">
        Rp {grandTotal.toLocaleString()}
      </p>

      <div className="mt-4 space-y-2">
        {groups.map((g) => {
          const pct = grandTotal > 0 ? Math.round((g.total / grandTotal) * 100) : 0
          const isOpen = expanded === g.label

          return (
            <div key={g.label}>
              <button
                onClick={() => setExpanded(isOpen ? null : g.label)}
                className="flex items-center gap-3 w-full text-left py-1.5 group"
              >
                <g.icon className="h-4 w-4 shrink-0" style={{ color: g.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{g.label}</span>
                    <span className="tabular-nums text-foreground font-medium">
                      Rp {(g.total / 1_000_000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: g.color }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                {g.accounts.length > 1 && (
                  <span className={`text-[10px] text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                )}
              </button>

              {isOpen && g.accounts.length > 1 && (
                <div className="ml-7 pl-3 border-l-2 space-y-1 mb-1">
                  {g.accounts.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-1 text-xs">
                      <span className="text-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                        {a.name}
                      </span>
                      <span className="tabular-nums font-medium text-foreground">
                        Rp {Math.abs(a.balance).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

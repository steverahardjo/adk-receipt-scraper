'use client'

import { useState } from 'react'
import type { InvestmentAccount } from './types'

type Props = {
  accounts: InvestmentAccount[]
}

export default function InvestmentsCard({ accounts }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const totalValue = accounts.reduce((s, a) => s + a.balance, 0)
  const totalCost = accounts.reduce((s, a) => s + a.costBasis, 0)
  const totalGain = totalValue - totalCost
  const totalReturn = totalCost > 0 ? Math.round((totalGain / totalCost) * 100) : 0

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Investments
      </span>

      <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums mt-1">
        Rp {totalValue.toLocaleString()}
      </p>

      <p
        className={`text-xs font-medium mt-0.5 ${
          totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {totalGain >= 0 ? '+' : '-'}Rp {Math.abs(totalGain).toLocaleString()} ({totalReturn}%)
      </p>

      <div className="mt-3 space-y-2 border-t pt-3">
        {accounts.map((a) => {
          const gain = a.balance - a.costBasis
          const ret = a.costBasis > 0 ? Math.round((gain / a.costBasis) * 100) : 0
          const isOpen = selected === a.id

          return (
            <div key={a.id}>
              <button
                onClick={() => setSelected(isOpen ? null : a.id)}
                className="flex items-center justify-between w-full text-sm text-left"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: a.color }}
                  />
                  <span className="text-foreground font-medium">{a.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums">Rp {a.balance.toLocaleString()}</span>
                  <span
                    className={`text-xs font-medium tabular-nums ${
                      gain >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {ret}%
                  </span>
                  <span className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </div>
              </button>

              {isOpen && a.holdings && (
                <div className="mt-1.5 ml-4 space-y-1.5">
                  {a.holdings.map((h) => {
                    const val = Math.round(h.shares * h.currentPrice)
                    const gainH = Math.round((h.currentPrice - h.avgPrice) * h.shares)
                    const retH = h.avgPrice > 0
                      ? Math.round(((h.currentPrice - h.avgPrice) / h.avgPrice) * 100)
                      : 0

                    return (
                      <div key={h.ticker} className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-medium text-foreground">{h.ticker}</span>
                          <span className="text-muted-foreground ml-1">
                            {h.shares} shrs
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums text-foreground">
                            Rp {val.toLocaleString()}
                          </span>
                          <span
                            className={`tabular-nums ${
                              gainH >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {retH}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { ResponsivePie } from '@nivo/pie'
import type { InvestmentAccount } from './types'

type Props = {
  accounts: InvestmentAccount[]
}

export default function InvestmentPie({ accounts }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  const data = useMemo(
    () =>
      accounts.map((a) => ({
        id: a.name,
        label: a.name,
        value: a.balance,
        color: a.color,
      })),
    [accounts],
  )

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Investments
        </span>
        <p className="text-sm text-muted-foreground mt-4">No investments</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Investments
      </span>

      <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-2">
        <div className="h-40 sm:h-44 shrink-0">
          <ResponsivePie
            data={data}
            margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            innerRadius={0.55}
            padAngle={2}
            cornerRadius={4}
            colors={{ datum: 'data.color' }}
            borderWidth={0}
            enableArcLinkLabels={false}
            enableArcLabels={false}
            onClick={(d) => setOpenId(openId === String(d.id) ? null : String(d.id))}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          {accounts.map((a) => {
            const gain = a.balance - a.costBasis
            const ret = a.costBasis > 0 ? Math.round((gain / a.costBasis) * 100) : 0
            const isOpen = openId === a.name

            return (
              <div key={a.id}>
                <button
                  onClick={() => setOpenId(isOpen ? null : a.name)}
                  className="flex items-center justify-between w-full text-sm px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="font-medium text-foreground truncate">{a.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="tabular-nums text-foreground text-xs sm:text-sm">
                      Rp {(a.balance / 1_000_000).toFixed(1)}M
                    </span>
                    <span
                      className={`text-xs font-medium tabular-nums ${
                        ret >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {ret >= 0 ? '+' : ''}{ret}%
                    </span>
                    <span className={`text-[10px] text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {isOpen && a.holdings && (
                  <div className="ml-4 pl-2 border-l-2 bg-muted/20 rounded-b-lg mb-1">
                    {a.holdings.map((h) => {
                      const val = Math.round(h.shares * h.currentPrice)
                      const retH = h.avgPrice > 0
                        ? Math.round(((h.currentPrice - h.avgPrice) / h.avgPrice) * 100)
                        : 0

                      return (
                        <div
                          key={h.ticker}
                          className="flex items-center justify-between px-2 py-1.5 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-semibold text-foreground">{h.ticker}</span>
                            <span className="text-muted-foreground">
                              {h.shares} {h.shares === 1 ? 'unit' : 'shrs'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="tabular-nums text-foreground">
                              Rp {val.toLocaleString()}
                            </span>
                            <span
                              className={`tabular-nums font-medium ${
                                retH >= 0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {retH >= 0 ? '+' : ''}{retH}%
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
    </div>
  )
}

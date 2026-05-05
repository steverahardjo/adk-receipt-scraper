'use client'

import { useMemo } from 'react'
import type { Account, NetWorthTrend } from './types'

type Props = {
  accounts: Account[]
  trend: NetWorthTrend[]
}

export default function NetWorthCard({ accounts, trend }: Props) {
  const stats = useMemo(() => {
    const assets = accounts
      .filter((a) => a.type !== 'liability')
      .reduce((s, a) => s + Math.max(0, a.balance), 0)
    const liabilities = accounts
      .filter((a) => a.type === 'liability')
      .reduce((s, a) => s + Math.abs(Math.min(0, a.balance)), 0)
    const netWorth = assets - liabilities
    const last = trend[trend.length - 1]?.value ?? netWorth
    const first = trend[0]?.value ?? netWorth
    const change = last - first
    const changePercent = first > 0 ? Math.round((change / first) * 100) : 0
    const latestChange = trend.length >= 2
      ? ((trend[trend.length - 1].value - trend[trend.length - 2].value) / trend[trend.length - 2].value * 100)
      : 0
    return { assets, liabilities, netWorth, change, changePercent, latestChange }
  }, [accounts, trend])

  const maxVal = Math.max(...trend.map((t) => t.value), 1)
  const w = 240
  const h = 48
  const xs = trend.map((_, i) => Math.round((i / (trend.length - 1)) * w))
  const ys = trend.map((t) => Math.round(h - (t.value / maxVal) * h * 0.8 - h * 0.1))
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ')

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Net Worth
      </span>

      <div className="flex items-baseline gap-3 mt-1">
        <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
          Rp {stats.netWorth.toLocaleString()}
        </p>
        <span
          className={`text-xs sm:text-sm font-medium ${
            stats.latestChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {stats.latestChange >= 0 ? '+' : ''}
          {stats.latestChange.toFixed(1)}%
        </span>
      </div>

      <div className="flex gap-4 mt-3 text-xs">
        <div>
          <span className="text-muted-foreground">Assets</span>
          <p className="font-medium text-emerald-600 tabular-nums">
            Rp {stats.assets.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Liabilities</span>
          <p className="font-medium text-rose-600 tabular-nums">
            Rp {stats.liabilities.toLocaleString()}
          </p>
        </div>
      </div>

      {trend.length > 1 && (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 mt-3 overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="var(--ochre)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {xs.map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={ys[i]}
              r="2.5"
              fill="var(--ochre)"
              className="hover:r-3 transition-all"
            />
          ))}
        </svg>
      )}
    </div>
  )
}

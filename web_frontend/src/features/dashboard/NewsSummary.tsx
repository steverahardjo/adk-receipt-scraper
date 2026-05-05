'use client'

import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Sparkles, Megaphone, TrendingUp, ShoppingBag, Zap } from 'lucide-react'
import type { Entry } from '../records/types'
import type { Account } from './types'

type Props = {
  accounts: Account[]
  entries: Entry[]
}

type NewsItem = {
  id: string
  icon: typeof Megaphone
  label: string
  description: string
  color: string
  chatMsg: string
}

const NEWS: NewsItem[] = [
  {
    id: 'n1',
    icon: ShoppingBag,
    label: '12.12 Sale',
    description: 'Up to 80% off on Shopee & Tokopedia this weekend',
    color: '#c97a6b',
    chatMsg: 'Find me the best 12.12 deals on electronics. My budget is Rp 5,000,000.',
  },
  {
    id: 'n2',
    icon: TrendingUp,
    label: 'Market Update',
    description: 'IHSG up 1.2% — your stock portfolio gained Rp 1.8M this week',
    color: '#3d8a7a',
    chatMsg: 'Review my stock portfolio performance. I hold BBCA, BBRI, and TLKM. Should I rebalance?',
  },
  {
    id: 'n3',
    icon: Zap,
    label: 'Telkomsel Promo',
    description: '50% off data plans for 30 days — limited offer',
    color: '#c4904a',
    chatMsg: 'Should I switch my Telkomsel plan to the 50% promo? I currently spend Rp 200,000/mo.',
  },
  {
    id: 'n4',
    icon: Megaphone,
    label: 'Black Friday',
    description: 'Early deals are live! Electronics & fashion up to 60% off',
    color: '#c97a6b',
    chatMsg: 'Help me plan my Black Friday shopping. I want a new laptop under Rp 15,000,000.',
  },
  {
    id: 'n5',
    icon: ShoppingBag,
    label: 'PayDay Deals',
    description: 'Restaurants & cafes near you — 20% cashback with GoPay',
    color: '#5baa8a',
    chatMsg: 'Find me restaurants near me with GoPay cashback. My budget is Rp 500,000 for dining this month.',
  },
]

export default function NewsSummary({ accounts, entries }: Props) {
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const netWorth = useMemo(() => {
    const assets = accounts
      .filter((a) => a.type !== 'liability')
      .reduce((s, a) => s + Math.max(0, a.balance), 0)
    const liabilities = accounts
      .filter((a) => a.type === 'liability')
      .reduce((s, a) => s + Math.abs(Math.min(0, a.balance)), 0)
    return { assets, liabilities, netWorth: assets - liabilities }
  }, [accounts])

  const summary = useMemo(() => {
    let income = 0
    let expense = 0
    for (const e of entries) {
      if (e.flow === 'income') income += e.amount
      else expense += e.amount
    }
    return { income, expense }
  }, [entries])

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const visibleNews = NEWS.filter((n) => !dismissed.has(n.id))
  const shownNews = visibleNews.slice(0, 4)
  const hasOverflow = visibleNews.length > 4

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 flex flex-col">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Hello
      </span>

      <p className="text-base sm:text-lg font-semibold text-foreground mt-2">
        {greeting}, HolyKnight
      </p>

      {/* Net Worth summary */}
      <div className="flex items-center justify-between mt-3 p-3 rounded-lg bg-muted/40">
        <div>
          <p className="text-[11px] text-muted-foreground">Net Worth</p>
          <p className="text-sm sm:text-base font-bold text-foreground tabular-nums">
            Rp {netWorth.netWorth.toLocaleString()}
          </p>
        </div>
        <div className="text-right text-[11px]">
          <p className="text-emerald-600 font-medium">Assets</p>
          <p className="text-rose-600 font-medium">Liabilities</p>
        </div>
        <div className="text-right text-[11px] tabular-nums">
          <p className="text-emerald-600 font-medium">
            Rp {netWorth.assets.toLocaleString()}
          </p>
          <p className="text-rose-600 font-medium">
            Rp {netWorth.liabilities.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        <div>
          <span>Income</span>
          <p className="font-medium text-emerald-600 tabular-nums mt-0.5">
            +Rp {summary.income.toLocaleString()}
          </p>
        </div>
        <div>
          <span>Expenses</span>
          <p className="font-medium text-rose-600 tabular-nums mt-0.5">
            -Rp {summary.expense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* News feed */}
      {shownNews.length > 0 && (
        <div className="mt-4 pt-4 border-t space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
              For You
            </span>
          </div>

          {shownNews.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div
                  className="mt-0.5 p-1 rounded-md shrink-0"
                  style={{ backgroundColor: `${item.color}18` }}
                >
                  <Icon className="h-3 w-3" style={{ color: item.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    {item.description}
                  </p>
                  <button
                    onClick={() =>
                      navigate({ to: '/chat', search: { msg: item.chatMsg } })
                    }
                    className="text-[11px] text-primary hover:text-accent font-medium mt-1 transition-colors"
                  >
                    Continue to Chat →
                  </button>
                </div>
                <button
                  onClick={() => setDismissed((p) => new Set(p).add(item.id))}
                  className="text-[16px] leading-none text-muted-foreground/40 hover:text-muted-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                >
                  ×
                </button>
              </div>
            )
          })}

          {hasOverflow && (
            <p className="text-[11px] text-muted-foreground text-center pt-1">
              +{visibleNews.length - 4} more
            </p>
          )}
        </div>
      )}


    </div>
  )
}

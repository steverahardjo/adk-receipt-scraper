'use client'

import { useMemo } from 'react'
import type { Account } from './types'
import { CreditCard, Wallet, Smartphone, Landmark } from 'lucide-react'
import type { LiabilityAccount } from './types'

type Props = {
  accounts: Account[]
}

const CARD_GRADIENTS: Record<string, string> = {
  BCA: 'from-blue-700 to-blue-500',
  Mandiri: 'from-blue-900 to-blue-600',
  Cash: 'from-emerald-700 to-emerald-500',
  GoPay: 'from-green-600 to-emerald-400',
  DANA: 'from-sky-700 to-blue-400',
  'CC BCA': 'from-rose-700 to-rose-500',
}

const CARD_ICONS: Record<string, typeof CreditCard> = {
  BCA: Landmark,
  Mandiri: Landmark,
  Cash: Wallet,
  GoPay: Smartphone,
  DANA: Smartphone,
  'CC BCA': CreditCard,
}

function maskNumber(index: number) {
  const groups = [
    Math.floor(Math.random() * 9000 + 1000),
    Math.floor(Math.random() * 9000 + 1000),
    Math.floor(Math.random() * 9000 + 1000),
    index * 1111 + 4000,
  ]
  return groups.join(' ')
}

export default function AccountCards({ accounts }: Props) {
  const cards = useMemo(() => {
    const liquid = accounts.filter((a) => a.type === 'liquid')
    const credit = accounts.filter((a) => a.type === 'liability' && a.balance < 0)
    return [...liquid, ...credit]
  }, [accounts])

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Accounts
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Debit
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Credit
          </span>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
        {cards.map((a, i) => {
          const isCredit = a.type === 'liability'
          const gradient = CARD_GRADIENTS[a.name] || (isCredit ? 'from-rose-700 to-rose-500' : 'from-slate-700 to-slate-500')
          const Icon = CARD_ICONS[a.name] || CreditCard
          const number = maskNumber(i)

          return (
            <div
              key={a.id}
              className={`snap-start shrink-0 w-[260px] sm:w-[280px] rounded-2xl bg-gradient-to-br ${gradient} text-white p-4 sm:p-5 shadow-lg flex flex-col justify-between select-none`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] sm:text-xs font-medium text-white/70 uppercase tracking-wider">
                      {isCredit ? 'Credit Card' : a.name === 'Cash' ? 'Cash' : 'Debit Account'}
                    </p>
                    <p className="text-sm sm:text-base font-semibold mt-0.5">{a.name}</p>
                  </div>
                  <Icon className="h-5 w-5 text-white/50" />
                </div>

                <p className="mt-3 text-[13px] sm:text-sm tracking-widest text-white/80 font-mono">
                  {number}
                </p>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Balance</p>
                  <p className={`text-base sm:text-lg font-bold tabular-nums ${isCredit ? 'text-red-200' : ''}`}>
                    {isCredit ? '-' : ''}Rp {Math.abs(a.balance).toLocaleString()}
                  </p>
                </div>

                {isCredit && (a as LiabilityAccount).limit && (
                  <div className="text-right">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">Limit</p>
                    <p className="text-xs font-medium tabular-nums text-white/80">
                      Rp {(a as LiabilityAccount).limit!.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

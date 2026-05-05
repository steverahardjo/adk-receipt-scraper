'use client'

import { useState } from 'react'
import type { Account } from './types'

type Props = {
  accounts: Account[]
}

export default function AccountsBar({ accounts }: Props) {
  const [open, setOpen] = useState(false)
  const liquid = accounts.filter((a) => a.type === 'liquid')
  const total = liquid.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Liquid Assets
      </span>

      <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums mt-1">
        Rp {total.toLocaleString()}
      </p>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
      >
        <span className={`inline-block transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
        {liquid.length} accounts
      </button>

      {open && (
        <div className="mt-3 space-y-1.5 border-t pt-3">
          {liquid.map((a) => (
            <div key={a.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: a.color }}
                />
                <span className="text-foreground">{a.name}</span>
              </div>
              <span className="tabular-nums font-medium">
                Rp {a.balance.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

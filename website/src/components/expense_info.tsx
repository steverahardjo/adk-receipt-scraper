/*A clickable card that can be used to view expense details of static info: Title, amount, date, currency, description.
Enable edit and delete functionality */

'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit3, Calendar } from 'lucide-react'

import type { Expense } from '@/schema'
import { CURRENCIES } from '@/schema'

interface ExpenseCardProps {
  expense: Expense
  onDelete: () => void
  onEdit: () => void
}

export function ExpenseInfoCard({
  expense,
  onDelete,
  onEdit,
}: ExpenseCardProps) {
  return (
    <Card className="group relative w-full max-w-sm overflow-hidden border-none bg-white/90 transition-all duration-300 hover:shadow-xl hover:shadow-red-200/50">
      {/* Red gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-100 via-red-50 to-white" />

      {/* Accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-400 via-red-500 to-red-400" />

      <CardHeader className="flex flex-row items-start justify-between pb-1 pt-4">
        <div className="space-y-0.5">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800 line-clamp-1">
            {expense.title}
          </CardTitle>

          {/* Date moved here */}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            {expense.date.toLocaleDateString(undefined, {
              dateStyle: 'medium',
            })}
          </span>

          <span className="text-[10px] uppercase tracking-wider text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
            {expense.type}
          </span>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-black hover:bg-red-50 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-2 cursor-pointer" onClick={onEdit}>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold text-red-500">
            {CURRENCIES[expense.currency as keyof typeof CURRENCIES]}
          </span>

          <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tight">
            {expense.amount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md border border-red-100 bg-white px-2 py-1 text-xs font-semibold text-red-700 shadow-sm">
            {expense.paymentMethod}
          </span>
        </div>

        {expense.description && (
          <p className="text-sm leading-relaxed text-slate-500 line-clamp-2 italic border-l-2 border-red-200 pl-3">
            "{expense.description}"
          </p>
        )}
      </CardContent>
    </Card>
  )
}

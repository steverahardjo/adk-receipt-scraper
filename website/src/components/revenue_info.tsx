/*Component to show revenue as a card along with the expense info card */
'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit3, Calendar } from 'lucide-react'

import { CURRENCIES } from '@/schema'
import type { Revenue } from '@/schema'

interface RevenueCardProps {
  revenue: Revenue
  onDelete: () => void
  onEdit: () => void
}

export function RevenueInfoCard({
  revenue,
  onDelete,
  onEdit,
}: RevenueCardProps) {
  return (
    <Card className="group relative w-full max-w-sm overflow-hidden border-none bg-white/90 transition-all duration-300 hover:shadow-xl hover:shadow-green-200/50">
      {/* Green background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-100 via-green-50 to-white" />

      {/* Accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-green-500 to-green-400" />

      <CardHeader className="flex flex-row items-start justify-between pb-1 pt-4">
        <div className="space-y-0.5">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800 line-clamp-1">
            {revenue.title}
          </CardTitle>

          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            {revenue.date.toLocaleDateString(undefined, {
              dateStyle: 'medium',
            })}
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
            className="h-8 w-8 rounded-full text-black hover:bg-green-50 hover:text-green-600"
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
          <span className="text-lg font-semibold text-green-600">
            {CURRENCIES[revenue.currency as keyof typeof CURRENCIES]}
          </span>

          <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tight">
            {revenue.amount.toLocaleString()}
          </span>
        </div>

        {revenue.description && (
          <p className="text-sm leading-relaxed text-slate-500 line-clamp-2 italic border-l-2 border-green-200 pl-3">
            "{revenue.description}"
          </p>
        )}
      </CardContent>
    </Card>
  )
}

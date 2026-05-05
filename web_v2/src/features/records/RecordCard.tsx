import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react'

type RecordCardProps = {
  date: Date
  title: string
  flow: 'income' | 'expense'
  type?: string
  amount: number
  documentLink?: string
}

export const RecordCard = ({
  date,
  title,
  flow,
  type,
  amount,
  documentLink,
}: RecordCardProps) => {
  const isIncome = flow === 'income'

  return (
    <Card className="border shadow-sm hover:shadow-md transition active:scale-[0.99]">
      <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* left */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* icon */}
          <div
            className={`shrink-0 p-1.5 sm:p-2 rounded-xl ${
              isIncome
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {isIncome ? (
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </div>

          {/* text */}
          <div className="flex flex-col min-w-0">
            <span className="font-medium leading-tight text-sm sm:text-base truncate">{title}</span>

            <span className="text-[11px] sm:text-xs text-muted-foreground">
              {format(date, 'dd MMM yyyy')}
              {type ? ` • ${type}` : ''}
            </span>
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* amount */}
          <span
            className={`text-sm sm:text-base font-semibold tabular-nums whitespace-nowrap ${
              isIncome
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isIncome ? '+' : '-'}Rp {amount.toLocaleString()}
          </span>

          {/* document */}
          {documentLink && (
            <a
              href={documentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary p-1"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

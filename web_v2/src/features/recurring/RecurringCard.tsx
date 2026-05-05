import type { RecurringItem } from './types'

type Props = {
  item: RecurringItem
}

const FREQ_LABEL: Record<string, string> = {
  monthly: '/mo',
  yearly: '/yr',
}

export default function RecurringCard({ item }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-card transition active:scale-[0.99] ${
        item.active ? '' : 'opacity-50'
      }`}
    >
      <div
        className={`shrink-0 w-1.5 h-1.5 rounded-full ${
          item.active ? 'bg-emerald-500' : 'bg-muted-foreground/30'
        }`}
      />

      <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-0 items-center">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-tight truncate">
            {item.title}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {item.merchant}
          </p>
        </div>

        <div className="text-right sm:text-left">
          <p className="text-sm font-semibold tabular-nums">
            Rp {item.amount.toLocaleString()}
            <span className="text-[11px] font-normal text-muted-foreground">
              {FREQ_LABEL[item.frequency] || ''}
            </span>
          </p>
        </div>

        <div className="hidden sm:block text-right text-[11px]">
          <p className="font-medium text-foreground">{item.paymentMethod}</p>
          <p className="text-muted-foreground truncate max-w-[120px]">
            {item.paymentAccount}
          </p>
        </div>

        <div className="hidden sm:block text-right text-[11px]">
          <p className="text-muted-foreground">Due</p>
          <p className="font-medium tabular-nums">
            {item.dueDay === 1
              ? '1st'
              : item.dueDay === 2
                ? '2nd'
                : item.dueDay === 3
                  ? '3rd'
                  : `${item.dueDay}th`}
          </p>
        </div>
      </div>
    </div>
  )
}

import type { Profile } from '@/schema'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PiggyBank, Wallet } from 'lucide-react'

function getBudgetStatus(budget: number, current: number) {
  const ratio = current / budget
  if (ratio > 1)
    return {
      color: '[&>div]:bg-red-500',
      text: 'Over Budget',
      theme: 'text-red-600',
    }
  if (ratio > 0.8)
    return {
      color: '[&>div]:bg-amber-500',
      text: 'Near Limit',
      theme: 'text-amber-600',
    }
  return {
    color: '[&>div]:bg-zinc-900 dark:[&>div]:bg-zinc-100',
    text: 'On Track',
    theme: 'text-zinc-500',
  }
}

export function BasicProfile({
  nickname,
  moneySource,
  currentMonthSpending,
  monthBudget,
  ownedAssets,
}: Profile) {
  const usage = (currentMonthSpending / monthBudget) * 100
  const status = getBudgetStatus(monthBudget, currentMonthSpending)

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1">
            {moneySource} / Dashboard
          </p>
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome, <span className="font-medium">{nickname}</span>
          </h1>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider">
            Monthly Utilization
          </p>
          <p className="text-2xl font-mono tracking-tighter tabular-nums">
            ${currentMonthSpending.toLocaleString()}
            <span className="text-zinc-300 mx-2">/</span>
            <span className="text-zinc-400">
              ${monthBudget.toLocaleString()}
            </span>
          </p>
        </div>
      </header>

      {/* Main Budget Card */}
      <section className="space-y-3">
        <div className="flex justify-between items-end">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${status.theme}`}
          >
            {status.text}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
            {usage.toFixed(1)}% Consumed
          </span>
        </div>
        <Progress
          value={Math.min(usage, 100)}
          className={`h-1.5 transition-all bg-zinc-100 dark:bg-zinc-800 ${status.color}`}
        />
      </section>

      {/* Asset Grid */}
      {ownedAssets && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-none border-zinc-200 dark:border-zinc-800 bg-transparent overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                  Emergency Fund
                </p>
                <p className="text-xl font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                  ${ownedAssets.emergencyFund.toLocaleString()}
                </p>
              </div>
              <PiggyBank className="w-5 h-5 text-zinc-300" strokeWidth={1.5} />
            </div>
          </Card>

          <Card className="shadow-none border-zinc-200 dark:border-zinc-800 bg-transparent overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                  Current Savings
                </p>
                <p className="text-xl font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                  ${ownedAssets.currentSaving.toLocaleString()}
                </p>
              </div>
              <Wallet className="w-5 h-5 text-zinc-300" strokeWidth={1.5} />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

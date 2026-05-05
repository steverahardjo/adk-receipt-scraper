import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import BaseLayer from '#/components/BaseLayer'
import NetWorthCard from '../features/dashboard/NetWorthCard'
import AccountsBar from '../features/dashboard/AccountsBar'
import InvestmentsCard from '../features/dashboard/InvestmentsCard'
import BudgetCard from '../features/dashboard/BudgetCard'
import SpendingChart from '../features/dashboard/SpendingChart'
import {
  generateAccounts,
  generateNetWorthTrend,
  generateBudget,
} from '../features/dashboard/types'
import { generateEntries } from '../features/records/mock_data'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const accounts = useMemo(() => generateAccounts(), [])
  const trend = useMemo(() => generateNetWorthTrend(), [])
  const budget = useMemo(() => generateBudget(), [])

  const thisMonthEntries = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return generateEntries(2000).filter((e) => e.date >= start)
  }, [])

  const investmentAccounts = useMemo(
    () => accounts.filter((a) => a.type === 'investment') as any[],
    [accounts],
  )

  return (
    <BaseLayer>
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <NetWorthCard accounts={accounts} trend={trend} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <AccountsBar accounts={accounts} />
          <InvestmentsCard accounts={investmentAccounts} />
        </div>

        <BudgetCard budget={budget} />

        <SpendingChart entries={thisMonthEntries} />
      </div>
    </BaseLayer>
  )
}

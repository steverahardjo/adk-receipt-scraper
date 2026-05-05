import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import BaseLayer from '#/components/BaseLayer'
import NetWorthCard from '../features/dashboard/NetWorthCard'
import NetWorthLineChart from '../features/dashboard/NetWorthLineChart'
import CardVisualizer from '../features/dashboard/CardVisualizer'
import AccountCards from '../features/dashboard/AccountCards'
import AssetBreakdown from '../features/dashboard/AssetBreakdown'
import InvestmentPie from '../features/dashboard/InvestmentPie'
import NewsSummary from '../features/dashboard/NewsSummary'
import CashFlowChart from '../features/dashboard/CashFlowChart'
import ExpensePie from '../features/dashboard/ExpensePie'
import {
  generateAccounts,
  generateNetWorthData,
  generateNetWorthEvents,
} from '../features/dashboard/types'
import { generateEntries } from '../features/records/mock_data'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const accounts = useMemo(() => generateAccounts(), [])
  const trend = useMemo(() => generateNetWorthData(), [])
  const events = useMemo(() => generateNetWorthEvents(), [])

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

        {/* Top: Line chart with overlays */}
        <div className="relative">
          <NetWorthLineChart data={trend} events={events} />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <NetWorthCard accounts={accounts} />
          </div>
          <div className="mt-3">
            <CardVisualizer entries={thisMonthEntries} />
          </div>
        </div>

        {/* Account Cards */}
        <AccountCards accounts={accounts} />

        {/* Middle: Asset Breakdown | News & Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <AssetBreakdown accounts={accounts} />
          <NewsSummary accounts={accounts} entries={thisMonthEntries} />
        </div>

        {/* Bottom: Cash Flow Bar | Investment Pie | Expense Pie */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <CashFlowChart />
          <InvestmentPie accounts={investmentAccounts} />
          <ExpensePie entries={thisMonthEntries} />
        </div>
      </div>
    </BaseLayer>
  )
}

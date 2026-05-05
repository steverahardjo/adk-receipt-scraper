import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import BaseLayer from '#/components/BaseLayer'
import NetWorthLineChart from '../features/dashboard/NetWorthLineChart'
import CashFlowStrip from '../features/dashboard/CashFlowStrip'
import AccountCards from '../features/dashboard/AccountCards'
import AssetBreakdown from '../features/dashboard/AssetBreakdown'
import NewsSummary from '../features/dashboard/NewsSummary'
import CashFlowChart from '../features/dashboard/CashFlowChart'
import InvestmentPie from '../features/dashboard/InvestmentPie'
import ExpensePie from '../features/dashboard/ExpensePie'
import {
  generateAccounts,
  generateNetWorthData,
  generateNetWorthEvents,
  generateEntries,
} from '../features/dashboard/mockdata'

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
        {/* Header */}
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

        {/* Hero: Message (left) + Net Worth Chart (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 sm:gap-5 items-start">
          <NewsSummary accounts={accounts} entries={thisMonthEntries} />
          <NetWorthLineChart data={trend} events={events} />
        </div>

        {/* Cash Flow Strip */}
        <CashFlowStrip entries={thisMonthEntries} />

        {/* Money Map: Account donut + Asset breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <AccountCards accounts={accounts} />
          <AssetBreakdown accounts={accounts} />
        </div>

        {/* Cash Flow: Income/Expense bars + Expense categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <CashFlowChart />
          <ExpensePie entries={thisMonthEntries} />
        </div>

        {/* Portfolio: Investment donut + holdings (full-width) */}
        <InvestmentPie accounts={investmentAccounts} />
      </div>
    </BaseLayer>
  )
}

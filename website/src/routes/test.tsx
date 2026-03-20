import { createFileRoute } from '@tanstack/react-router'
import { ExpenseInfoCard } from '@/components/expense_info'
import { RevenueInfoCard } from '@/components/revenue_info'

import type { Expense } from '@/schema'

export const Route = createFileRoute('/test')({
  component: TestPage,
})

function TestPage() {
  const expense1: Expense = {
    title: 'Lunch',
    amount: 12.5,
    currency: 'MYR',
    date: new Date(),
    type: 'Food',
    paymentMethod: 'Cash',
    description: 'Quick lunch',
  }

  const revenue = {
    title: 'Freelance Payment',
    amount: 150,
    currency: 'MYR',
    date: new Date(),
    description: 'Website fix',
  }

  const expense2: Expense = {
    title: 'Coffee',
    amount: 5,
    currency: 'MYR',
    date: new Date(),
    type: 'Food',
    paymentMethod: 'Card',
    description: 'Afternoon coffee',
  }

  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-md h-[80vh] overflow-y-auto space-y-6 pr-2">
        <ExpenseInfoCard
          expense={expense1}
          onDelete={() => {}}
          onEdit={() => {}}
        />

        <RevenueInfoCard
          revenue={revenue}
          onDelete={() => {}}
          onEdit={() => {}}
        />

        <ExpenseInfoCard
          expense={expense2}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>
    </div>
  )
}

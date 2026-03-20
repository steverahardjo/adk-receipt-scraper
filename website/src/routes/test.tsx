import { createFileRoute } from '@tanstack/react-router'
import { ExpenseInfoCard } from '@/components/expense_info'
import type { Expense } from '@/schema'

export const Route = createFileRoute('/test')({
  component: TestPage,
})

function TestPage() {
  const expense: Expense = {
    title: 'Lunch',
    amount: 12.5,
    currency: 'MYR',
    date: new Date(),
    type: 'Food',
    paymentMethod: 'Cash',
    description: 'Quick lunch',
  }

  return (
    <div className="p-10">
      <ExpenseInfoCard expense={expense} onDelete={() => {}} />
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import ExpenseForm from '@/features/form/expense_form'

export const Route = createFileRoute('/expense_form')({
  component: ExpenseFormPage,
})

function ExpenseFormPage() {
  return <ExpenseForm />
}

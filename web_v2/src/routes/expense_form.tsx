import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import ExpenseFormPage from '@/features/form/expense_form'
import MobileDrawer from '@/components/drawer'
import ThemeSwitch from '@/components/light_switch'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/expense_form')({
  component: ExpenseFormRoute,
})

export function ExpenseFormRoute() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* TOP BAR */}
      <div className="flex justify-end p-4">
        <ThemeSwitch />
      </div>

      {/* PAGE CONTENT */}
      <main className="p-4 pb-24">
        <ExpenseFormPage />
      </main>

      {/* FAB */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-12 px-5 rounded-full shadow-lg flex items-center gap-2"
      >
        Open Drawer
        <Plus className="h-5 w-5" />
      </Button>

      {/* DRAWER */}
      <MobileDrawer open={open} onOpenChange={setOpen} />
    </div>
  )
}

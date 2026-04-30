import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import ExpenseFormPage from '#/features/form/components/ExpenseFormPage'
import { BaseLayer } from '@/components/BaseLayer'
import ThemeSwitch from '@/components/light_switch'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Drawer as MobileDrawer } from '@/components/drawer'

export const Route = createFileRoute('/expense_form')({
  component: ExpenseFormRoute,
})

export function ExpenseFormRoute() {
  const [open, setOpen] = useState(false)

  return (
    <BaseLayer>
      {/* TOP RIGHT ACTION (optional slot inside page) */}
      <div className="flex justify-end p-4">
        <ThemeSwitch />
      </div>

      {/* PAGE CONTENT */}
      <main className="p-4 pb-24">
        <ExpenseFormPage />
      </main>

      {/* FAB (still page-specific, NOT layout responsibility) */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-12 px-5 rounded-full shadow-lg flex items-center gap-2"
      >
        Open Drawer
        <Plus className="h-5 w-5" />
      </Button>

      {/* YOUR EXISTING DRAWER */}
      <MobileDrawer open={open} onOpenChange={setOpen} />
    </BaseLayer>
  )
}

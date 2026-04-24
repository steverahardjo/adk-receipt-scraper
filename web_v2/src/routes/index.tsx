import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import MobileDrawer from '../components/drawer'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeSwitch from '../components/light_switch'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* ================= MOBILE ================= */}
      <div className="md:hidden">
        {/* TOP BAR */}
        <div className="flex justify-end p-4">
          <ThemeSwitch />
        </div>

        {/* CONTENT */}
        <main className="p-4 pb-24">{/* content */}</main>

        {/* FAB */}
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-12 px-5 rounded-full shadow-lg
          bg-primary hover:bg-primary/90 text-primary-foreground
          flex items-center gap-2"
        >
          Add Record
          <Plus className="h-5 w-5" />
        </Button>

        {/* DRAWER */}
        <MobileDrawer open={open} onOpenChange={setOpen} />
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex">
        {/* SIDEBAR */}
        {/* <Sidebar /> */}

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col">
          {/* CONTENT */}
          <main className="p-6">{/* content */}</main>
        </div>
      </div>
    </div>
  )
}

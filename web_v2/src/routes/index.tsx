import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/navbar'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen md:flex">
      <Navbar />

      <main className="flex-1 p-6 md:ml-64 pb-24">{/* your content */}</main>

      {/* Floating Add Button */}
      <Button
        className="fixed bottom-6 right-6 h-12 px-5 rounded-full shadow-lg
        bg-primary hover:bg-primary/90 text-primary-foreground
        flex items-center gap-2 transition"
      >
        Add Record
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  )
}

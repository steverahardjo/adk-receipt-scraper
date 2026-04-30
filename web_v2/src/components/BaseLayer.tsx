'use client'

import * as React from 'react'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import Drawer from '@/components/drawer'
import ThemeSwitch from '@/components/light_switch'

/* ---------------- DESKTOP NAV ---------------- */

function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      <a href="/" className="hover:underline">
        Dashboard
      </a>
      <a href="/expenses" className="hover:underline">
        Expenses
      </a>
      <a href="/settings" className="hover:underline">
        Settings
      </a>
    </nav>
  )
}

/* ---------------- HEADER ---------------- */

function Header({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  return (
    <header className="h-14 border-b bg-background flex items-center px-4 justify-between">
      {/* LEFT */}
      <div className="font-semibold">My App</div>

      {/* CENTER (desktop nav) */}
      <DesktopNav />

      {/* RIGHT (desktop utilities) */}
      <div className="hidden md:flex items-center gap-2">
        <ThemeSwitch />
      </div>

      {/* MOBILE BUTTON ONLY */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenDrawer}
      >
        <Menu className="w-5 h-5" />
      </Button>
    </header>
  )
}

/* ---------------- BASE LAYOUT ---------------- */

export function BaseLayer({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <Header onOpenDrawer={() => setDrawerOpen(true)} />

      {/* DRAWER (mobile only interaction) */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* CONTENT */}
      <main className={cn('flex-1 p-4')}>{children}</main>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

import {
  Home,
  Receipt,
  TrendingUp,
  Sparkles,
  Settings,
  User,
  Menu,
} from 'lucide-react'

/* ---------------- NAV ITEM ---------------- */

function NavItem({
  to,
  icon,
  label,
}: {
  to: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={to} className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function Navbar() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setDark(isDark)
  }, [])

  return (
    <>
      {/* TOP BAR */}
      <div
        className="flex items-center justify-between px-4 py-3
        bg-[var(--surface)] backdrop-blur border-b border-[var(--line)]"
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>

          <span className="font-semibold text-[var(--deneb-blue)]">Deneb</span>
        </div>

        <Switch
          checked={dark}
          onCheckedChange={(value) => {
            document.documentElement.classList.toggle('dark', value)
            setDark(value)
          }}
        />
      </div>

      {/* SIDEBAR */}
      <Sidebar
        variant="floating" // clean, edgeless look
        collapsible="icon" // collapses to icons
        className="bg-[var(--surface)] backdrop-blur-xl"
      >
        {/* HEADER */}
        <SidebarHeader>
          <div className="px-2 py-1 font-semibold text-[var(--deneb-blue)]">
            Deneb
          </div>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent>
          <SidebarMenu>
            <NavItem to="/" icon={<Home />} label="Dashboard" />
            <NavItem to="/expenses" icon={<Receipt />} label="Expenses" />
            <NavItem
              to="/investments"
              icon={<TrendingUp />}
              label="Investments"
            />
            <NavItem to="/ai" icon={<Sparkles />} label="AI Assistant" />
          </SidebarMenu>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter>
          <SidebarMenu>
            <NavItem to="/profile" icon={<User />} label="Profile" />
            <NavItem to="/settings" icon={<Settings />} label="Settings" />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar'

import { Button } from '@/components/ui/button'
import { Link, useRouterState } from '@tanstack/react-router'
import { Branding } from '#/config/Branding'

import {
  Home,
  Receipt,
  TrendingUp,
  Sparkles,
  Settings,
  User,
  Wallet,
  Tags,
  PanelLeft,
} from 'lucide-react'

/* ---------- Collapse Button (correct way) ---------- */
function CollapseButton() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8"
      onClick={toggleSidebar}
    >
      <PanelLeft className="w-4 h-4" />
    </Button>
  )
}

export default function AppSidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  })

  const navItems = [
    { label: 'Dashboard', to: '/', icon: Home },
    { label: 'Records', to: '/records', icon: Receipt },
    { label: 'Budgets', to: '/budgets', icon: Wallet },
    { label: 'Categories', to: '/categories', icon: Tags },
    { label: 'Analytics', to: '/analytics', icon: TrendingUp },
    { label: 'AI Chat', to: '/ai', icon: Sparkles },
  ]

  const bottomItems = [
    { label: 'Settings', to: '/settings', icon: Settings },
    { label: 'Profile', to: '/profile', icon: User },
  ]

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="py-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 min-w-0">
            <Branding.app.Logo className="h-6 w-6 shrink-0" />

            <span className="font-semibold truncate group-data-[collapsible=icon]:hidden">
              {Branding.app.name}
            </span>
          </div>

          <CollapseButton />
        </div>
      </SidebarHeader>

      {/* MAIN */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="group-data-[collapsible=icon]:hidden">
              Main Navigation
            </span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.to

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link to={item.to}>
                        <Icon className="shrink-0" />

                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.to

            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton isActive={isActive} tooltip={item.label}>
                  <Link to={item.to}>
                    <Icon className="shrink-0" />

                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

'use client'

import * as React from 'react'

import { navItems, bottomItems } from '@/config/Navigation'
import LightSwitch from '@/components/LightSwitch'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { Branding } from '@/config/Branding'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

type Props = React.ComponentProps<typeof Sidebar> & {
  avatarUrl?: string
  userName?: string
}

const user = {
  name: 'HolyKnight',
  email: 'user@example.com',
  avatar: '',
}
function SidebarHeaderContent({
  avatarUrl,
  userName,
}: {
  avatarUrl?: string
  userName: string
}) {
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'

  return (
    <SidebarHeader className="space-y-4">
      {/* LightSwitch */}
      <div className={collapsed ? 'flex justify-center' : 'flex justify-end'}>
        <LightSwitch />
      </div>

      {/* Branding */}
      <div
        className={`
          flex items-center gap-2
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        <Branding.app.Logo className="h-6 w-6 shrink-0" />

        {!collapsed && (
          <span className="font-semibold text-sm">{Branding.app.name}</span>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-3 px-1">
        <Avatar className={collapsed ? 'h-8 w-8 mx-auto' : 'h-8 w-8'}>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        {!collapsed && (
          <div className="text-sm leading-tight">
            <div className="font-medium">{userName}</div>
            <div className="text-muted-foreground text-xs">
              user@example.com
            </div>
          </div>
        )}
      </div>
    </SidebarHeader>
  )
}

export default function AppSidebar({
  avatarUrl,
  userName = 'User',
  ...props
}: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeaderContent avatarUrl={avatarUrl} userName={userName} />

      <SidebarContent>
        <NavMain items={navItems} />
        <NavProjects projects={bottomItems} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

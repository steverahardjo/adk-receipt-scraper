'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  BarChart3,
  Settings2,
  Wallet,
  History,
  CreditCard,
  PieChart as PieChartIcon,
} from 'lucide-react'

// 1. Import your LightSwitch component
import LightSwitch from '@/components/LightSwitch'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'HolyKnight',
    email: 'user@example.com',
    avatar: '',
  },
  accounts: [
    {
      name: 'Personal Wallet',
      logo: Wallet,
      plan: 'Main Account',
    },
    {
      name: 'Business Card',
      logo: CreditCard,
      plan: 'Visa **** 1234',
    },
  ],
  navMain: [
    {
      title: 'Overview',
      url: '/',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Expenses',
      url: '/expenses',
      icon: ReceiptText,
      items: [
        { title: 'All Expenses', url: '/expenses' },
        { title: 'Add New', url: '/expense_form', icon: PlusCircle },
        { title: 'Recent History', url: '/history', icon: History },
      ],
    },
    {
      title: 'Analysis',
      url: '#',
      icon: BarChart3,
      items: [
        { title: 'Monthly Report', url: '/reports/monthly' },
        { title: 'Category Breakdown', url: '/reports/categories' },
      ],
    },
  ],
  quickStats: [
    { name: 'Budget Plan', url: '/budget', icon: PieChartIcon },
    { name: 'Settings', url: '/settings', icon: Settings2 },
  ],
}

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.accounts} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.quickStats} />
      </SidebarContent>

      <SidebarFooter>
        {/* 2. Added the LightSwitch here with some padding/styling */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center py-2"></SidebarMenuItem>
        </SidebarMenu>

        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

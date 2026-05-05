import {
  HomeIcon,
  ChartBarIcon,
  SparklesIcon,
  Cog6ToothIcon,
  UserIcon,
  WalletIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline'

import type { ElementType } from 'react'

export interface NavItem {
  title: string
  url: string
  // Using ElementType is the safest way to type a React Component
  // that can be rendered as <Icon />
  icon: ElementType
  items?: { title: string; url: string }[]
}
export const navItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'Transactions',
    url: '/records',
    icon: ReceiptPercentIcon,
    items: [
      { title: 'All Transactions', url: '/records' },
      { title: 'Add Transaction', url: '/expense_form' },
    ],
  },

  // Planning layer
  {
    title: 'Budgets',
    url: '/budgets',
    icon: WalletIcon,
    items: [
      { title: 'Overview', url: '/budgets' },
      { title: 'Create Budget', url: '/budgets/new' },
    ],
  },

  // Insights
  {
    title: 'Reports',
    url: '/analytics',
    icon: ChartBarIcon,
    items: [
      { title: 'Spending Trends', url: '/analytics/trends' },
      { title: 'Category Breakdown', url: '/analytics/categories' },
      { title: 'Monthly Summary', url: '/analytics/monthly' },
    ],
  },

  // AI Assistant
  {
    title: 'AI Assistant',
    url: '/chatbot',
    icon: SparklesIcon,
    items: [
      { title: 'Operation', url: '/chatbot/operation' },
      { title: 'Reporting', url: '/chatbot/reporting' },
      { title: 'Planning', url: '/chatbot/planning' },
    ],
  },
]

export const bottomItems = [
  { name: 'Settings', url: '/settings', icon: Cog6ToothIcon },
  { name: 'Profile', url: '/profile', icon: UserIcon },
]

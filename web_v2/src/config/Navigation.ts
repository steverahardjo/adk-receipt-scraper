import {
  Home,
  Receipt,
  TrendingUp,
  Sparkles,
  Settings,
  User,
  Wallet,
} from 'lucide-react'

export const navItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },

  // Core action: tracking money
  {
    title: 'Transactions',
    url: '/records',
    icon: Receipt,
    items: [
      { title: 'All Transactions', url: '/records' },
      { title: 'Add Transaction', url: '/records/new' },
    ],
  },

  // Planning layer
  {
    title: 'Budgets',
    url: '/budgets',
    icon: Wallet,
    items: [
      { title: 'Overview', url: '/budgets' },
      { title: 'Create Budget', url: '/budgets/new' },
    ],
  },
  // Insights (rename from generic "Analytics")
  {
    title: 'Reports',
    url: '/analytics',
    icon: TrendingUp,
    items: [
      { title: 'Spending Trends', url: '/analytics/trends' },
      { title: 'Category Breakdown', url: '/analytics/categories' },
      { title: 'Monthly Summary', url: '/analytics/monthly' },
    ],
  },

  // Keep this separate mentally (tool, not core nav)
  {
    title: 'AI Assistant',
    url: '/ai',
    icon: Sparkles,
    items: [
      { title: 'Operation', url: '/ai/operation' },
      { title: 'Reporting', url: '/ai/reporting' },
      { title: 'Planning', url: '/ai/planning' },
    ],
  },
]

export const bottomItems = [
  { name: 'Settings', url: '/settings', icon: Settings },
  { name: 'Profile', url: '/profile', icon: User },
]

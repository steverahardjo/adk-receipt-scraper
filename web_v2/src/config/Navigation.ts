import {
  Home,
  Receipt,
  TrendingUp,
  Sparkles,
  Settings,
  User,
  Wallet,
  Tags,
} from 'lucide-react'

export const navItems = [
  { label: 'Dashboard', to: '/', icon: Home },
  { label: 'Records', to: '/records', icon: Receipt },
  { label: 'Budgets', to: '/budgets', icon: Wallet },
  { label: 'Categories', to: '/categories', icon: Tags },
  { label: 'Analytics', to: '/analytics', icon: TrendingUp },
  { label: 'AI Chat', to: '/ai', icon: Sparkles },
]

export const bottomItems = [
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Profile', to: '/profile', icon: User },
]

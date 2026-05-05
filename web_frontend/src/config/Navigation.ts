import {
  HomeIcon,
  ReceiptPercentIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

import type { ElementType } from 'react'

export interface NavItem {
  title: string
  url: string
  icon: ElementType
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'Transactions',
    url: '/records',
    icon: ReceiptPercentIcon,
  },
  {
    title: 'Daily Needs',
    url: '/recurring',
    icon: ArrowPathIcon,
  },
  {
    title: 'AI Assistant',
    url: '/chat',
    icon: SparklesIcon,
  },
]

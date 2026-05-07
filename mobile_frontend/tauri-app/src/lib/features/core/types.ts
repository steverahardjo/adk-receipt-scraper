export interface NavItem {
  href?: string
  label: string
  icon: string
  children?: { href: string; label: string }[]
}

export const drawerNavItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: 'home' },
  { href: '/notifications', label: 'Notifications', icon: 'bell' },
  {
    label: 'Records',
    icon: 'list',
    children: [
      { href: '/records', label: 'View Records' },
      { href: '/expense_form', label: 'Add Record' },
    ],
  },
  { href: '/chatbot', label: 'Chat', icon: 'chat' },
]

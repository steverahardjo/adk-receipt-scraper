export interface NotificationItem {
  id: string
  type: 'security' | 'payment' | 'investment' | 'alert'
  title: string
  description: string
  time: string
  read: boolean
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'security',
    title: 'New login detected',
    description: 'Your account was accessed from Chrome on Windows. Recognize this?',
    time: '2m ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'payment',
    title: 'GoPay top-up received',
    description: 'Rp 500.000 was added to your GoPay wallet.',
    time: '15m ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'investment',
    title: 'BBCA hits all-time high',
    description: 'Your BBCA shares gained +3.2% today. Portfolio up Rp 2.1M.',
    time: '1h ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'payment',
    title: 'Electric bill paid',
    description: 'PLN postpaid bill Rp 1.200.000 was paid automatically.',
    time: '3h ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'alert',
    title: 'Budget limit approaching',
    description: 'You have used 85% of your monthly food budget.',
    time: '5h ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'investment',
    title: 'Dividend credited',
    description: 'Rp 375.000 dividend from BBRI shares was credited.',
    time: '1d ago',
    read: true,
  },
]

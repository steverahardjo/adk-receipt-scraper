export type NotificationLevel = 'alert' | 'bill'

export type Notification = {
  id: string
  title: string
  description: string
  level: NotificationLevel
  date: Date
  read: boolean
}

export type NotificationGroup = {
  label: string
  items: Notification[]
}

export function generateNotifications(): Notification[] {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  return [
    {
      id: 'n1',
      title: 'Netflix due tomorrow',
      description: 'Rp 152,000 will be charged to BCA •••• 9012',
      level: 'alert',
      date: new Date(y, m, now.getDate() + 1),
      read: false,
    },
    {
      id: 'n2',
      title: 'Food budget at 85%',
      description: 'Rp 2,125,000 of Rp 2,500,000 used this month',
      level: 'alert',
      date: new Date(y, m, now.getDate()),
      read: false,
    },
    {
      id: 'n3',
      title: 'Spotify due in 5 days',
      description: 'Rp 55,000 will be charged to BCA •••• 9012',
      level: 'bill',
      date: new Date(y, m, now.getDate() + 5),
      read: false,
    },
    {
      id: 'n4',
      title: 'iCloud+ due in 12 days',
      description: 'Rp 49,000 will be charged to BCA •••• 9012',
      level: 'bill',
      date: new Date(y, m, now.getDate() + 12),
      read: false,
    },
    {
      id: 'n5',
      title: 'Gym membership due in 2 days',
      description: 'Rp 300,000 will be charged to GoPay Wallet',
      level: 'alert',
      date: new Date(y, m, now.getDate() + 2),
      read: false,
    },
    {
      id: 'n6',
      title: 'Shopping budget at 72%',
      description: 'Rp 1,080,000 of Rp 1,500,000 used this month',
      level: 'bill',
      date: new Date(y, m, now.getDate()),
      read: true,
    },
    {
      id: 'n7',
      title: 'Unusual spending detected',
      description: '3x more transactions than usual at Transport this week',
      level: 'alert',
      date: new Date(y, m, now.getDate() - 1),
      read: false,
    },
  ]
}

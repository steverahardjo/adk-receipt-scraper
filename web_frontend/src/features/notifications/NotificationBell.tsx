'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { generateNotifications, type Notification, type NotificationGroup } from './types'

function groupNotifications(items: Notification[]): NotificationGroup[] {
  const groups: NotificationGroup[] = []

  const alerts = items.filter((n) => n.level === 'alert' && !n.read)
  const billUnread = items.filter((n) => n.level === 'bill' && !n.read)
  const read = items.filter((n) => n.read)

  if (alerts.length) groups.push({ label: 'Alerts', items: alerts })
  if (billUnread.length) groups.push({ label: 'Bills', items: billUnread })
  if (read.length) groups.push({ label: 'Read', items: read })

  return groups
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>(() => generateNotifications())

  const unread = useMemo(() => notifications.filter((n) => !n.read), [notifications])
  const groups = useMemo(() => groupNotifications(notifications), [notifications])

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const LEVEL_STYLES = {
    alert: 'border-l-rose-500 bg-rose-50/50',
    bill: 'border-l-amber-500 bg-amber-50/50',
  } as const

  const LEVEL_DOT = {
    alert: 'bg-rose-500',
    bill: 'bg-amber-500',
  } as const

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unread.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-rose-500 text-[10px] font-bold text-white leading-none px-1">
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border bg-card shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-semibold text-foreground">
              Notifications
            </span>
            {unread.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {groups.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                All caught up
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.label}>
                  <div className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                    {group.label}
                  </div>
                  {group.items.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                        )
                      }}
                      className={`w-full text-left px-4 py-3 border-l-2 hover:bg-muted/50 transition-colors ${
                        LEVEL_STYLES[n.level]
                      } ${n.read ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${LEVEL_DOT[n.level]}`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight">
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {n.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

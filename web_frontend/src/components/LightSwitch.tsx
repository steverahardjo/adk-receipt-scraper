'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

export default function ThemeSwitch() {
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    const initial = saved === 'dark' || (!saved && prefersDark)

    setIsDark(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [])

  function toggleTheme(checked: boolean) {
    setIsDark(checked)
    document.documentElement.classList.toggle('dark', checked)
    localStorage.setItem('theme', checked ? 'dark' : 'light')
  }

  if (isDark === null) return null

  return (
    <div className="flex justify-end">
      <div className="relative">
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="h-6 w-11"
        />

        {/* ICON INSIDE */}
        <span
          className={`
            pointer-events-none absolute top-1/2 -translate-y-1/2
            transition-all duration-200'
          `}
        ></span>
      </div>
    </div>
  )
}

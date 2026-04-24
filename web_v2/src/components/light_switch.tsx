'use client'

import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun } from 'lucide-react'

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
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 w-fit">
        {/* ICON */}
        {isDark ? (
          <Moon className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-muted-foreground" />
        )}

        {/* LABEL */}
        <Label htmlFor="theme-mode" className="text-sm">
          {isDark ? 'Dark' : 'Light'}
        </Label>

        {/* SWITCH */}
        <Switch
          id="theme-mode"
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="h-6 w-11"
        />
      </div>
    </div>
  )
}

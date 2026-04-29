import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import ThemeSwitch from '@/components/light_switch'
import { cn } from '@/lib/utils'
import type { ChatMode } from './types'

interface Props {
  mode: ChatMode
  setMode: (mode: ChatMode) => void
  profilePicture?: string
}

export default function ChatHeader({ mode, setMode, profilePicture }: Props) {
  const labelMap: Record<ChatMode, string> = {
    planning: 'Planning',
    operations: 'Operations',
    reporting: 'Reporting',
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={profilePicture || ''} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">AI Chatbot</span>
          <span className="text-xs text-muted-foreground">Assistant</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* MODE */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 text-sm">
              {labelMap[mode]}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            {(['planning', 'operations', 'reporting'] as ChatMode[]).map(
              (m) => (
                <DropdownMenuItem
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'cursor-pointer',
                    mode === m && 'bg-muted font-medium',
                  )}
                >
                  {labelMap[m]}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* THEME */}
        <ThemeSwitch />
      </div>
    </div>
  )
}

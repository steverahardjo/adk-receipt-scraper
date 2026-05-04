import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import ThemeSwitch from '#/components/LightSwitch'
import { cn } from '@/lib/utils'
import type { ChatMode } from './types'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  mode: ChatMode
  setMode: (mode: ChatMode) => void
  profilePicture?: string
}

export default function ChatHeader({ mode, setMode, profilePicture }: Props) {
  const modeConfig: Record<ChatMode, [string, string]> = {
    planning: ['Planning', 'High-level thinking, ideas, and strategy'],
    operations: ['Operations', 'Execution, tasks, and step-by-step actions'],
    reporting: ['Reporting', 'Summaries, insights, and structured output'],
  }

  return (
    <TooltipProvider>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-sm"
                  >
                    {modeConfig[mode][0]}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>{modeConfig[mode][1]}</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="w-44">
              {(['planning', 'operations', 'reporting'] as ChatMode[]).map(
                (m) => (
                  <Tooltip key={m}>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        onClick={() => setMode(m)}
                        className={cn(
                          'cursor-pointer',
                          mode === m && 'bg-muted font-medium',
                        )}
                      >
                        {modeConfig[m][0]}
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {modeConfig[m][1]}
                    </TooltipContent>
                  </Tooltip>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* THEME */}
          <ThemeSwitch />
        </div>
      </div>
    </TooltipProvider>
  )
}

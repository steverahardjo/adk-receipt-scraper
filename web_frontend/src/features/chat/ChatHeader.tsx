import { Bot } from 'lucide-react'
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
}

export default function ChatHeader({ mode, setMode }: Props) {
  const modeConfig: Record<ChatMode, [string, string]> = {
    planning: ['Planning', 'High-level thinking, ideas, and strategy'],
    operations: ['Operations', 'Execution, tasks, and step-by-step actions'],
    reporting: ['Reporting', 'Summaries, insights, and structured output'],
  }

  return (
    <TooltipProvider>
      <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">Deneb Assistant</span>
            <span className="text-xs text-muted-foreground">AI Financial Coach</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

          <ThemeSwitch />
        </div>
      </div>
    </TooltipProvider>
  )
}

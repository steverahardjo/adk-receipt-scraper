import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import ThemeSwitch from '@/components/light_switch'

type Mode = 'planning' | 'operations' | 'reporting'

interface Props {
  mode: Mode
  setMode: (mode: Mode) => void
  profilePicture?: string
}

export default function ChatHeader({ mode, setMode, profilePicture }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={profilePicture || ''} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">AI Chatbot</span>
          <span className="text-xs text-muted-foreground">Assistant</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* MODE SELECTOR */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setMode('planning')}>
              Planning
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setMode('operations')}>
              Daily Operations
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setMode('reporting')}>
              Reporting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* LIGHT SWITCH */}
        <ThemeSwitch />
      </div>
    </div>
  )
}

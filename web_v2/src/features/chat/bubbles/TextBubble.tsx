import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { appToast } from '@/lib/toast'

interface ChatBubbleProps {
  output: string
  complement?: string
  date: Date
  sender: 'user' | 'assistant'
}

export default function TextBubble({
  output,
  sender,
  date,
  complement,
}: ChatBubbleProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      appToast.success('Message copied')
    } catch {
      appToast.error('Failed to copy')
    }
  }

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  return (
    <div
      className={cn(
        'flex w-full gap-3 mb-4',
        sender === 'user' ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* BUBBLE */}
      <div
        className={cn(
          'flex flex-col max-w-[75%] gap-1',
          sender === 'user' ? 'items-end' : 'items-start',
        )}
      >
        {/* HEADER */}
        <div className="text-[11px] text-muted-foreground uppercase px-1">
          {sender}
          {complement && ` • ${complement}`}
        </div>

        {/* MESSAGE */}
        <Card
          className={cn(
            'px-3 py-2.5',
            sender === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted',
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {output}
          </p>
        </Card>

        {/* TIME */}
        <span className="px-1 text-[10px] text-muted-foreground">
          {formattedTime}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col justify-center">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}

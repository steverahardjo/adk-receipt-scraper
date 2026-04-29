import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { appToast } from '@/lib/toast'
import type { ChatMessage } from '../types'

interface Props {
  message: ChatMessage
}

export default function TextBubble({ message }: Props) {
  if (message.type !== 'text') return null

  const { role, createdAt, status } = message
  const { text } = message.content

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      appToast.success('Message copied')
    } catch {
      appToast.error('Failed to copy')
    }
  }

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt))

  return (
    <div
      className={cn(
        'flex w-full gap-3 mb-4',
        role === 'user' ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* BUBBLE */}
      <div
        className={cn(
          'flex flex-col max-w-[75%] gap-1',
          role === 'user' ? 'items-end' : 'items-start',
        )}
      >
        {/* HEADER */}
        <div className="text-[11px] text-muted-foreground uppercase px-1 flex items-center gap-2">
          <span>{role}</span>

          {role === 'user' && (
            <span className="text-[10px] normal-case">
              {status === 'processing' && 'Sending...'}
              {status === 'sent' && 'Sent'}
              {status === 'completed' && 'Delivered'}
            </span>
          )}
        </div>

        {/* MESSAGE */}
        <Card
          className={cn(
            'px-3 py-2.5',
            role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {text}
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

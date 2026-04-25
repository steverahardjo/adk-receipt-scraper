import { Copy, Download, MessageSquare, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type OutputType = 'chat' | 'files'

interface ChatBubbleProps {
  output: string
  type: OutputType
  complement?: string
  date: Date
  sender: 'user' | 'assistant'
}

export default function ChatBubble({
  output,
  type,
  sender,
  date,
  complement,
}: ChatBubbleProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast.success('Message copied')
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleDownload = () => {
    toast.success('Download started')
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

        <Card
          className={cn(
            'p-3',
            sender === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted',
          )}
        >
          <div className="flex items-start gap-3">
            {/* ICON */}
            <div className="mt-1 opacity-80">
              {type === 'chat' ? (
                <MessageSquare className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-hidden">
              {type === 'chat' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {output}
                </p>
              ) : (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">
                    {output.split('/').pop() || 'attachment.file'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* TIME */}
        <span className="px-1 text-[10px] text-muted-foreground">
          {formattedTime}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-1 justify-center">
        {type === 'chat' && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}

        {type === 'files' && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleDownload}
            asChild
          >
            <a href={output} download target="_blank" rel="noreferrer">
              <Download className="h-4 w-4 text-muted-foreground" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

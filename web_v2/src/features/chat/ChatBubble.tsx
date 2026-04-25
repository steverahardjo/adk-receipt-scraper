import { Copy, Download, MessageSquare, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type OutputType = 'chat' | 'files'

interface ChatBubbleProps {
  output: string
  type: OutputType
  sender: 'user' | 'assistant'
}

export default function ChatBubble({ output, type, sender }: ChatBubbleProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast.success('Copied to clipboard')
  }

  const handleDownload = () => {
    toast.success('Download started')
  }

  return (
    <div
      className={cn(
        'flex w-full gap-2',
        sender === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      {/* BUBBLE */}
      <Card
        className={cn(
          'p-3 max-w-[75%]',
          sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        <div className="flex items-start gap-3">
          {/* ICON */}
          <div className="mt-1">
            {type === 'chat' ? (
              <MessageSquare className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-hidden">
            {type === 'chat' ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {output}
              </p>
            ) : (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">
                  {output.split('/').pop()}
                </span>
                <span className="text-xs opacity-70">Attachment</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ACTIONS OUTSIDE BUBBLE */}
      <div className="flex flex-col gap-2 mt-1">
        {type === 'chat' && (
          <Button size="icon" variant="ghost" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        )}

        {type === 'files' && (
          <Button size="icon" variant="ghost" asChild onClick={handleDownload}>
            <a href={output} download target="_blank">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

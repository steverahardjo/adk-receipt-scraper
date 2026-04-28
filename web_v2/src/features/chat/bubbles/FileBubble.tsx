import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileBubbleProps {
  output: string
  sender: 'user' | 'assistant'
  date: Date
  downloadUrl?: string
}

export default function FileBubble({
  output,
  sender,
  date,
  downloadUrl,
}: FileBubbleProps) {
  const handleDownload = () => {
    toast.success('Download started')
  }

  const fileName = output.split('/').pop() || 'attachment.file'

  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  const url = downloadUrl || output

  return (
    <div
      className={cn(
        'flex w-full gap-3 mb-4',
        sender === 'user' ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* WRAPPER */}
      <div
        className={cn(
          'flex flex-col max-w-[75%] gap-1',
          sender === 'user' ? 'items-end' : 'items-start',
        )}
      >
        {/* HEADER */}
        <div className="text-[11px] text-muted-foreground uppercase px-1">
          {sender}
        </div>

        {/* BUBBLE (NO ACTIONS INSIDE) */}
        <Card
          className={cn(
            'p-3 flex items-center justify-between gap-4',
            sender === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted',
          )}
        >
          {/* LEFT */}
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 opacity-70" />

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{fileName}</span>
              <span className="text-[10px] uppercase opacity-70">
                File Attachment
              </span>
            </div>
          </div>
        </Card>

        {/* TIME */}
        <span className="text-[10px] text-muted-foreground px-1">{time}</span>
      </div>

      {/* OUTSIDE ACTION */}
      <div className="flex items-center justify-center">
        <Button size="icon" variant="ghost" onClick={handleDownload} asChild>
          <a href={url} download target="_blank" rel="noreferrer">
            <Download className="h-4 w-4 text-muted-foreground" />
          </a>
        </Button>
      </div>
    </div>
  )
}

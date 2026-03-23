import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, X } from 'lucide-react'

interface VoiceNotePreviewProps {
  onSend: () => void
  onCancel: () => void
  disabled?: boolean
}

export function VoiceNotePreview({ onSend, onCancel, disabled }: VoiceNotePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-2 rounded-lg border bg-muted p-2"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Mic className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">Voice note</p>
        <p className="text-xs text-muted-foreground">Ready to send</p>
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onCancel}>
        <X className="h-4 w-4" />
        <span className="sr-only">Cancel</span>
      </Button>
      <Button type="button" size="sm" onClick={onSend} disabled={disabled}>
        Send
      </Button>
    </motion.div>
  )
}

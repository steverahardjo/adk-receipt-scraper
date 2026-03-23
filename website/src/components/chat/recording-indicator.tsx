import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, StopCircle } from 'lucide-react'

interface RecordingIndicatorProps {
  recordingTime: number
  onStop: () => void
  onCancel: () => void
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function RecordingIndicator({ recordingTime, onStop, onCancel }: RecordingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 rounded-lg border bg-red-50 p-2 dark:bg-red-950/20"
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <motion.div
          className="h-3 w-3 rounded-full bg-red-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      <div className="flex-1 font-mono text-sm text-red-600 dark:text-red-400">
        {formatTime(recordingTime)}
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onCancel}>
        <X className="h-4 w-4" />
        <span className="sr-only">Cancel</span>
      </Button>
      <Button type="button" size="icon" variant="destructive" className="h-8 w-8 shrink-0" onClick={onStop}>
        <StopCircle className="h-4 w-4" />
        <span className="sr-only">Stop recording</span>
      </Button>
    </motion.div>
  )
}

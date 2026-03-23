import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Image, Mic } from 'lucide-react'

interface FilePreviewProps {
  file: File
  previewUrl: string | null
  onRemove: () => void
}

export function FilePreview({ file, previewUrl, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/')
  const isAudio = file.type.startsWith('audio/')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-2 rounded-lg border bg-muted p-2"
    >
      {previewUrl && isImage ? (
        <img src={previewUrl} alt="Preview" className="h-16 w-16 rounded-md object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10">
          {isAudio ? <Mic className="h-6 w-6 text-primary" /> : <Image className="h-6 w-6 text-primary" />}
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onRemove}>
        <X className="h-4 w-4" />
        <span className="sr-only">Remove file</span>
      </Button>
    </motion.div>
  )
}

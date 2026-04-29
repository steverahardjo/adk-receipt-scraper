'use client'

import { useRef, useState, useEffect } from 'react'
import {
  Send,
  Aperture,
  Paperclip,
  Mic,
  X,
  Music,
  FileIcon,
} from 'lucide-react'
import CameraInput from './bubbles/CamInput'
import RecordInput from './bubbles/RecordInput' // Import your new component

// Shadcn UI Components
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface PendingFile {
  id: string
  file: File | Blob
  previewUrl: string
  type: 'image' | 'audio' | 'other'
}

export default function ChatBar({
  onSendText,
  onSendFile,
}: {
  onSendText: (t: string) => void
  onSendFile: (f: File) => void
}) {
  const [text, setText] = useState('')
  const [camera, setCamera] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])

  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand textarea logic
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [text])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPending: PendingFile[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      previewUrl: URL.createObjectURL(f),
      type: f.type.startsWith('image/')
        ? 'image'
        : f.type.startsWith('audio/')
          ? 'audio'
          : 'other',
    }))

    setPendingFiles((prev) => [...prev, ...newPending])
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleVoiceRecord = (blob: Blob) => {
    const file = new File([blob], `voice-message-${Date.now()}.webm`, {
      type: 'audio/webm',
    })
    const newPending: PendingFile = {
      id: crypto.randomUUID(),
      file: file,
      previewUrl: URL.createObjectURL(blob),
      type: 'audio',
    }
    setPendingFiles((prev) => [...prev, newPending])
    setIsRecording(false)
  }

  const removeFile = (id: string) => {
    setPendingFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== id)
      const removed = prev.find((f) => f.id === id)
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return filtered
    })
  }

  const handleSend = () => {
    if (!text.trim() && pendingFiles.length === 0) return
    if (text.trim()) onSendText(text)
    pendingFiles.forEach((p) => onSendFile(p.file as File))

    setText('')
    setPendingFiles([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  return (
    <TooltipProvider>
      {/* CAMERA OVERLAY */}
      {camera && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border shadow-lg rounded-2xl w-full max-w-md relative overflow-hidden p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full"
              onClick={() => setCamera(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <CameraInput
              onSend={(file) => {
                onSendFile(file)
                setCamera(false)
              }}
              onCancel={() => setCamera(false)}
            />
          </div>
        </div>
      )}

      {/* VOICE RECORDING OVERLAY */}
      {isRecording && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <RecordInput
              onSend={handleVoiceRecord}
              onCancel={() => setIsRecording(false)}
            />
          </div>
        </div>
      )}

      <div className="border-t bg-background p-4 space-y-2">
        <div className="max-w-4xl mx-auto flex flex-col bg-muted/50 rounded-2xl border overflow-hidden transition-all">
          {/* CANDIDACY PREVIEW AREA */}
          {pendingFiles.length > 0 && (
            <div className="p-3 border-b bg-background/50">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-3 pb-2">
                  {pendingFiles.map((pf) => (
                    <div key={pf.id} className="relative group shrink-0">
                      <button
                        onClick={() => removeFile(pf.id)}
                        className="absolute -top-2 -right-2 z-10 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      <div className="w-20 h-20 rounded-xl border bg-card flex items-center justify-center overflow-hidden shadow-sm">
                        {pf.type === 'image' ? (
                          <img
                            src={pf.previewUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : pf.type === 'audio' ? (
                          <div className="flex flex-col items-center gap-1">
                            <Music className="text-blue-500 h-6 w-6" />
                            <span className="text-[9px] px-1 truncate w-16 text-center font-medium">
                              Voice
                            </span>
                          </div>
                        ) : (
                          <FileIcon className="text-muted-foreground h-6 w-6" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}

          {/* INPUT BAR */}
          <div className="flex items-end gap-2 p-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0"
                onClick={() => fileRef.current?.click()}
              >
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full shrink-0"
                onClick={() => setCamera(true)}
              >
                <Aperture className="h-5 w-5 text-muted-foreground" />
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={() => setIsRecording(true)}
                  >
                    <Mic className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Record audio</TooltipContent>
              </Tooltip>
            </div>

            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={handleFileSelect}
            />

            <div className="flex-1 overflow-hidden">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="min-h-[40px] w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none py-2 px-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
            </div>

            <Button
              size="icon"
              className="rounded-xl shrink-0 transition-all active:scale-95"
              disabled={!text.trim() && pendingFiles.length === 0}
              onClick={handleSend}
            >
              <Send
                className={`h-5 w-5 ${text.trim() || pendingFiles.length > 0 ? 'fill-current' : ''}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

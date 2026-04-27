import { useEffect, useRef, useState } from 'react'
import { Send, Aperture, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import CameraInput from './CamInput'

type Props = {
  onSend: (message: string) => void
  onSendImage?: (file: File) => void
}

export default function ChatInput({ onSend, onSendImage }: Props) {
  const [message, setMessage] = useState('')
  const [openCamera, setOpenCamera] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  useEffect(() => {
    autoResize()
  }, [message])

  function handleSend() {
    const text = message.trim()
    if (!text) return
    onSend(text)
    setMessage('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleImageSend(file: File) {
    onSendImage?.(file)
    setOpenCamera(false) // close after capture
  }

  return (
    <>
      {/* CAMERA OVERLAY */}
      {openCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-background p-4 rounded-xl w-full max-w-md">
            <CameraInput
              onSend={handleImageSend}
              onCancel={() => setOpenCamera(false)}
            />
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="p-2 border-t space-y-2">
        <Field>
          <FieldLabel className="sr-only">Message</FieldLabel>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full resize-none overflow-hidden min-h-[44px] max-h-[160px]"
              />
            </div>

            {/* CAMERA BUTTON */}
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 p-0"
              onClick={() => setOpenCamera(true)}
            >
              <Aperture className="h-4 w-4" />
            </Button>

            <Button type="button" variant="outline" className="h-10 w-10 p-0">
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              onClick={handleSend}
              disabled={!message.trim()}
              className="h-10 w-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Field>

        <FieldDescription className="text-xs text-muted-foreground">
          Enter to send • Shift + Enter for new line
        </FieldDescription>
      </div>
    </>
  )
}

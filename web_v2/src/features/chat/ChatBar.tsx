'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Aperture, Mic, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import RecordInput from './bubbles/RecordInput'

type PanelState =
  | { type: 'none' }
  | { type: 'audio' }
  | { type: 'file'; file: File }

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const [panel, setPanel] = useState<PanelState>({ type: 'none' })
  const [openCamera, setOpenCamera] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  // auto resize
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [message])

  const showPanel = panel.type !== 'none'

  // --- SEND HANDLERS (centralized)
  const handleSendText = () => {
    if (!message.trim()) return

    console.log('send text:', message)
    setMessage('')
  }

  const handleSendFile = (file: File) => {
    console.log('send file:', file)
    setPanel({ type: 'none' })
  }

  const handleSendAudio = (blob: Blob) => {
    const file = new File([blob], 'audio.webm')
    console.log('send audio:', file)
    setPanel({ type: 'none' })
  }

  return (
    <>
      {/* CAMERA */}
      {openCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-background p-4 rounded-xl w-full max-w-md">
            <p className="text-sm">Camera</p>
            <Button onClick={() => setOpenCamera(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* PANEL */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${showPanel ? 'max-h-60' : 'max-h-0'}
        `}
      >
        <div className="px-2 pt-2">
          {/* AUDIO */}
          {panel.type === 'audio' && (
            <RecordInput
              onSend={handleSendAudio}
              onCancel={() => setPanel({ type: 'none' })}
            />
          )}

          {/* FILE */}
          {panel.type === 'file' && (
            <div className="p-3 border rounded-xl text-sm flex items-center justify-between gap-2">
              <span className="truncate">{panel.file.name}</span>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSendFile(panel.file)}>
                  Send
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPanel({ type: 'none' })}
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <div className="p-2 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 resize-none overflow-hidden min-h-[44px] max-h-[160px]"
          />

          {/* CAMERA */}
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => setOpenCamera(true)}
          >
            <Aperture className="h-4 w-4" />
          </Button>

          {/* FILE */}
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (!f) return
              setPanel({ type: 'file', file: f })
            }}
          />

          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => fileRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* MIC */}
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() =>
              setPanel((prev) =>
                prev.type === 'audio' ? { type: 'none' } : { type: 'audio' },
              )
            }
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* SEND */}
          <Button className="h-10 w-10 p-0" onClick={handleSendText}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}

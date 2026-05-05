import { useState, useEffect, useRef } from 'react'

import ChatHeader from './ChatHeader'
import ChatBar from './ChatBar'
import FileBubble from './FileBubble'
import TextBubble from './bubbles/TextBubble'

import type { ChatMessage, ChatMode, TextMessage, FileMessage } from './types'

import { useSendChatFile, useSendChatText } from '@/hooks/use_chat'

type Props = {
  initialMode: ChatMode
  initialMsg?: string
}

export default function ChatPage({ initialMode, initialMsg }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [mode, setMode] = useState<ChatMode>(initialMode)
  const submittedRef = useRef(false)

  const { mutate: sendText } = useSendChatText()
  const { mutate: sendFile } = useSendChatFile()

  const handleSendText = (text: string) => {
    const userMsg: TextMessage = {
      id: crypto.randomUUID(),
      type: 'text',
      role: 'user',
      mode,
      createdAt: new Date().toISOString(),
      status: 'sent',
      content: { text },
    }

    setMessages((prev) => [...prev, userMsg])

    sendText(
      { message: text, mode },
      {
        onSuccess: (res: ChatMessage) => {
          setMessages((prev) => [...prev, res])
        },
      },
    )
  }

  const handleSendFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file)

    const userMsg: FileMessage = {
      id: crypto.randomUUID(),
      type: 'file',
      role: 'user',
      mode,
      createdAt: new Date().toISOString(),
      status: 'sent',
      content: {
        fileId: crypto.randomUUID(),
        url: previewUrl,
        filename: file.name,
        mimeType: file.type,
      },
    }

    setMessages((prev) => [...prev, userMsg])

    sendFile(
      { file, mode },
      {
        onSuccess: (res: ChatMessage) => {
          setMessages((prev) => [...prev, res])
        },
      },
    )
  }

  useEffect(() => {
    if (initialMsg && !submittedRef.current) {
      submittedRef.current = true
      handleSendText(initialMsg)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('msg')
        window.history.replaceState({}, '', url.pathname)
      }
    }
  }, [initialMsg])

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader mode={mode} setMode={setMode} />

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          if (msg.type === 'text') {
            return <TextBubble key={msg.id} message={msg} />
          }

          if (msg.type === 'file') {
            return (
              <FileBubble
                key={msg.id}
                output={msg.content.url}
                sender="user"
                date={new Date(msg.createdAt)}
                filename={msg.content.filename}
              />
            )
          }

          return null
        })}
      </div>

      <ChatBar onSendText={handleSendText} onSendFile={handleSendFile} />
    </div>
  )
}

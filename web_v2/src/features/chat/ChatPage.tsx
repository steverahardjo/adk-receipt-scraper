import ChatHeader from './ChatHeader'
import type { ChatMessage, ChatMode, TextMessage, FileMessage } from './types'
import { useState } from 'react'

import { useSendChatFile, useSendChatText } from '@/hooks/use_chat'
import FileBubble from './FileBubble'
import TextBubble from './bubbles/TextBubble'
import ChatBar from './ChatBar'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [mode, setMode] = useState<ChatMode>('operations')

  const { mutate: sendText } = useSendChatText()
  const { mutate: sendFile } = useSendChatFile()

  // --- TEXT
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
      {
        message: text,
        mode,
      },
      {
        onSuccess: (res: ChatMessage) => {
          setMessages((prev) => [...prev, res])
        },
      },
    )
  }

  // --- FILE
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

  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <ChatHeader mode={mode} setMode={setMode} />

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          switch (msg.type) {
            case 'text':
              return <TextBubble key={msg.id} message={msg} />

            case 'file':
              return (
                <FileBubble
                  key={msg.id}
                  output={msg.content.url}
                  sender="user"
                  date={new Date(msg.createdAt)}
                  filename={msg.content.filename}
                />
              )

            default:
              return null
          }
        })}
      </div>

      {/* INPUT */}
      <ChatBar onSendText={handleSendText} onSendFile={handleSendFile} />
    </div>
  )
}

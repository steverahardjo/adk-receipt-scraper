import ChatHeader from './ChatHeader'
import type { ChatMessage } from './types'
import { useState } from 'react'

import { useSendChatFile, useSendChatText } from '@/hooks/use_chat'
import FileBubble from './bubbles/FileBubble'
import TextBubble from './bubbles/TextBubble'
import ChatBar from './ChatBar'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const { mutate: sendText } = useSendChatText()
  const { mutate: sendFile } = useSendChatFile()

  // --- SEND TEXT
  const handleSendText = (text: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'text',
      sender: 'user',
      content: text,
      date: new Date(),
    }

    // optimistic update
    setMessages((prev) => [...prev, userMsg])

    sendText(
      {
        userId: '123',
        message: text,
        mode: 'planning',
      },
      {
        onSuccess: (res) => {
          setMessages((prev) => [...prev, res])
        },
      },
    )
  }

  // --- SEND FILE / AUDIO
  const handleSendFile = (file: File) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'file',
      sender: 'user',
      file,
      date: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])

    sendFile(
      {
        userId: '123',
        file,
        mode: 'planning',
      },
      {
        onSuccess: (res) => {
          setMessages((prev) => [...prev, res])
        },
      },
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader />

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          if (msg.type === 'text') {
            return <TextBubble key={msg.id} message={msg} />
          }

          if (msg.type === 'file') {
            return <FileBubble key={msg.id} message={msg} />
          }

          return null
        })}
      </div>

      {/* INPUT */}
      <ChatBar onSendText={handleSendText} onSendFile={handleSendFile} />
    </div>
  )
}

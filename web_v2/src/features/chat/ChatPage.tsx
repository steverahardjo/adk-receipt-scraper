import { useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import FileBubble from './FileBubble'
import { Branding } from '@/config/branding'
import { useChat } from './use_chat'
import type { Mode } from './use_chat'

export default function ChatPage() {
  const [mode, setMode] = useState<Mode>('planning')
  const { messages, sendMessage } = useChat()

  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <ChatHeader
        mode={mode}
        setMode={setMode}
        profilePicture={Branding.filler.logo}
      />

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto px-10 py-6 space-y-4">
        {messages.map((msg) => {
          if (msg.type === 'text') {
            return (
              <ChatBubble
                key={msg.id}
                output={msg.content}
                sender={msg.role}
                date={msg.date}
              />
            )
          }

          return (
            <FileBubble
              key={msg.id}
              output={msg.content}
              sender={msg.role}
              date={msg.date}
              downloadUrl={msg.content}
            />
          )
        })}
      </div>

      {/* INPUT */}
      <ChatInput onSend={sendMessage} />
    </div>
  )
}

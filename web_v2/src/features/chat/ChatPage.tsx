import { useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import FileBubble from './FileBubble'

type Mode = 'planning' | 'operations' | 'reporting'

export default function ChatPage() {
  const [mode, setMode] = useState<Mode>('planning')

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader
        mode={mode}
        setMode={setMode}
        profilePicture="https://i.pravatar.cc/150?img=12"
      />

      <div className="flex-1 overflow-y-auto">
        <ChatBubble output="Hi How are you ?" sender="user" date={new Date()} />
        <ChatBubble
          output="I'm doing well, thank you!"
          sender="assistant"
          date={new Date()}
        />
        <FileBubble
          output="File.pdf"
          sender="user"
          date={new Date()}
          downloadUrl=""
        />
      </div>

      <ChatInput />
    </div>
  )
}

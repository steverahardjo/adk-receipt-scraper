import { createFileRoute } from '@tanstack/react-router'
import ChatPage from '@/features/chat/ChatPage'
import BaseLayer from '#/components/BaseLayer'
import type { ChatMode } from '@/features/chat/types'

export const Route = createFileRoute('/chatbot/operation')({
  component: Chat,
})

function Chat() {
  return (
    <BaseLayer>
      <ChatPage initialMode={'operation' as ChatMode} />
    </BaseLayer>
  )
}

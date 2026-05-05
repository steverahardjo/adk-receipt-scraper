import { createFileRoute } from '@tanstack/react-router'
import ChatPage from '@/features/chat/ChatPage'
import BaseLayer from '#/components/BaseLayer'

export const Route = createFileRoute('/chatbot/planning')({
  component: Chat,
})

function Chat() {
  return (
    <BaseLayer>
      <ChatPage initialMode="planning" />
    </BaseLayer>
  )
}

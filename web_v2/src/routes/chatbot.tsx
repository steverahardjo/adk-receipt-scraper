import { createFileRoute } from '@tanstack/react-router'
import ChatPage from '@/features/chat/ChatPage'

export const Route = createFileRoute('/chatbot')({
  component: Chat,
})

function Chat() {
  return <ChatPage />
}

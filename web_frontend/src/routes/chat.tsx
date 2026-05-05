import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import ChatPage from '@/features/chat/ChatPage'
import BaseLayer from '#/components/BaseLayer'

const chatSearchSchema = z.object({
  msg: z.string().optional(),
})

export const Route = createFileRoute('/chat')({
  validateSearch: chatSearchSchema,
  component: Chat,
})

function Chat() {
  const { msg } = Route.useSearch()

  return (
    <BaseLayer>
      <ChatPage initialMode="operations" initialMsg={msg} />
    </BaseLayer>
  )
}

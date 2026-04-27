import { useQuery, useQueryClient } from '@tanstack/react-query'

export type Mode = 'planning' | 'operations' | 'reporting'

export type ChatItem = {
  id: string
  role: 'user' | 'assistant'
  type: 'text' | 'file' | 'image' | 'audio'
  content: string
  date: Date
}

export function useChat() {
  const queryClient = useQueryClient()

  const query = useQuery<ChatItem[]>({
    queryKey: ['chat'],
    queryFn: async () => {
      // replace with API later
      return []
    },
    initialData: [],
  })

  const sendMessage = (content: string) => {
    const newMessage: ChatItem = {
      id: crypto.randomUUID(),
      role: 'user',
      type: 'text',
      content,
      date: new Date(),
    }

    queryClient.setQueryData<ChatItem[]>(['chat'], (old = []) => [
      ...old,
      newMessage,
    ])

    // simulate assistant reply (optional)
    setTimeout(() => {
      const reply: ChatItem = {
        id: crypto.randomUUID(),
        role: 'assistant',
        type: 'text',
        content: 'Got it.',
        date: new Date(),
      }

      queryClient.setQueryData<ChatItem[]>(['chat'], (old = []) => [
        ...old,
        reply,
      ])
    }, 500)
  }

  return {
    messages: query.data ?? [],
    sendMessage,
  }
}

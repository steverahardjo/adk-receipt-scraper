import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { chatAPI } from '../services/api'

export function useChat() {
  const { data: session } = authClient.getSession()
  const [lastResponse, setLastResponse] = useState<string | null>(null)

  const {
    mutate: pushMessage,
    isPending: isProcessing,
    error,
  } = useMutation({
    // The Interceptor handles the X-User-Id automatically
    mutationFn: chatAPI.sendMessage,

    onSuccess: (data) => {
      setLastResponse(data.reply)
    },
  })

  const handleSend = (text: string) => {
    //guard to prevent sending messages without a user id
    if (!session?.user?.id) return
    pushMessage(text)
  }

  return {
    send: handleSend,
    response: lastResponse,
    isProcessing,
    error,
    isAuthenticated: !!session?.user?.id,
  }
}

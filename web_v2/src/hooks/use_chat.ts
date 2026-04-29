import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendChatTextAPI, sendChatFileAPI } from '../features/chat/chatbot_api'
import type { ChatMessage } from '../features/chat/types'
import { getUserId } from '../lib/auth-client'

// TEXT
export function useSendChatText() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { message: string; mode: string }) => {
      const userId = await getUserId()

      return sendChatTextAPI({
        userId,
        message: data.message,
        mode: data.mode,
      })
    },

    onSuccess: (data: ChatMessage) => {
      queryClient.setQueryData(['chat'], (old: ChatMessage[] = []) => [
        ...old,
        data,
      ])
    },
  })
}

// FILE
export function useSendChatFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { file: File; mode: string }) => {
      const userId = await getUserId()

      return sendChatFileAPI({
        userId,
        file: data.file,
        mode: data.mode,
      })
    },

    onSuccess: (data: ChatMessage) => {
      queryClient.setQueryData(['chat'], (old: ChatMessage[] = []) => [
        ...old,
        data,
      ])
    },
  })
}

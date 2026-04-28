import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendChatTextAPI, sendChatFileAPI } from '../api/chatbot_api'
import type { ChatMessage } from '../features/chat/types'

// TEXT MUTATION
export function useSendChatText() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendChatTextAPI,

    onSuccess: (data: ChatMessage) => {
      // append to chat cache
      queryClient.setQueryData(['chat'], (old: ChatMessage[] = []) => [
        ...old,
        data,
      ])
    },
  })
}

// FILE MUTATION
export function useSendChatFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendChatFileAPI,

    onSuccess: (data: ChatMessage) => {
      queryClient.setQueryData(['chat'], (old: ChatMessage[] = []) => [
        ...old,
        data,
      ])
    },
  })
}

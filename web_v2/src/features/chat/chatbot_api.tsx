import type { ChatMessage } from './types'

const apiUrl = 'https://api.example.com'

export async function sendChatTextAPI(params: {
  userId: string
  message: string
  mode: string
}) {
  const res = await fetch(`${apiUrl}/deneb/chat/text/userid=${params.userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: new Date().toISOString(),
      mode: params.mode,
      message: params.message,
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to send text message')
  }

  return res.json() as Promise<ChatMessage>
}

// FILE
export async function sendChatFileAPI(params: {
  userId: string
  file: File
  mode: string
  caption?: string
}) {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('mode', params.mode)
  formData.append('date', new Date().toISOString())
  if (params.caption) {
    formData.append('caption', params.caption)
  }

  const res = await fetch(`${apiUrl}/deneb/chat/file/userid=${params.userId}`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Failed to send file')
  }

  return res.json() as Promise<ChatMessage>
}

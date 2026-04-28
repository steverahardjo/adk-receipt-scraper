export type MessageType = 'text' | 'file' | 'image' | 'audio'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  type: MessageType
  content: string
  createdAt: number
  status?: 'sending' | 'sent' | 'error'
}

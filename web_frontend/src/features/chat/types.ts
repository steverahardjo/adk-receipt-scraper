export type MessageType = 'text' | 'file' | 'image' | 'audio'
export type ChatMode = 'planning' | 'operations' | 'reporting'
export type ChatRole = 'user' | 'assistant'
export type ChatStatus = 'sent' | 'processing' | 'completed'

type BaseMessage = {
  id: string
  createdAt: string
  mode: ChatMode
  role: ChatRole
  status: ChatStatus
}

export type TextMessage = BaseMessage & {
  type: 'text'
  content: { text: string }
}

export type FileMessage = BaseMessage & {
  type: 'file'
  content: {
    fileId: string
    url: string
    filename: string
    mimeType: string
    caption?: string
  }
}

export type ChatMessage = TextMessage | FileMessage

import { createFileRoute } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot } from 'lucide-react'

import { ChatMessageBubble, TypingIndicator, ChatInput } from '@/components/chat'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  const { messages, sendMessage, status } = useChat()

  // Input state
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  // Refs
  const bottomRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // File preview cleanup
  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setFilePreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      setRecordingTime(0)
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [isRecording])

  // Recording functions
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to access microphone:', err)
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  function cancelRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      const stream = mediaRecorderRef.current.stream
      stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      setAudioBlob(null)
    }
  }

  function sendAudioNote() {
    if (audioBlob && !isRecording) {
      const file = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' })
      sendMessage({
        text: 'Voice note',
        experimental_attachments: [file],
      })
      setAudioBlob(null)
    }
  }

  // Form submission
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if ((!input.trim() && !selectedFile) || status === 'streaming') return

    sendMessage({
      text: input,
      experimental_attachments: selectedFile ? [selectedFile] : undefined,
    })

    setInput('')
    setSelectedFile(null)
  }

  // File handling
  function handleFileSelect(file: File) {
    const isImage = file.type.startsWith('image/')
    const isAudio = file.type.startsWith('audio/')

    if (!isImage && !isAudio) return

    setSelectedFile(file)
  }

  function removeSelectedFile() {
    setSelectedFile(null)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">AI Assistant</span>
            <span className="text-xs text-muted-foreground">
              {status === 'streaming' ? 'Typing...' : 'Ready to chat'}
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="flex min-h-full flex-col gap-4 p-4">
          {messages.map((message, index) => (
            <ChatMessageBubble key={index} message={message} index={index} />
          ))}

          {status === 'streaming' && messages.length > 0 && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={onSubmit}
        selectedFile={selectedFile}
        filePreview={filePreview}
        onFileRemove={removeSelectedFile}
        onFileSelect={handleFileSelect}
        isRecording={isRecording}
        recordingTime={recordingTime}
        audioBlob={audioBlob}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onCancelRecording={cancelRecording}
        onSendAudioNote={sendAudioNote}
        status={status}
      />
    </div>
  )
}

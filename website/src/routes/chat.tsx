import { createFileRoute } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  const { messages, sendMessage, status } = useChat()

  const [input, setInput] = useState('')

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!input.trim()) return

    sendMessage({
      text: input,
    })

    setInput('')
  }

  return (
    <div className="flex h-screen flex-col">
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <AnimatePresence>
            {messages.map((m, i) => {
              const isUser = m.role === 'user'

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isUser && (
                    <Avatar>
                      <AvatarImage src="/llama.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}

                  <Card
                    className={`px-4 py-3 max-w-[70%] ${
                      isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {m.parts?.[0]?.text}
                  </Card>

                  {isUser && (
                    <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
          />

          <Button type="submit" disabled={status === 'streaming'}>
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

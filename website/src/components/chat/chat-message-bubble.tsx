import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { Bot, User } from 'lucide-react'

const chatFontStyle = {
  fontFamily: '"Inter", sans-serif',
}

interface ChatMessageBubbleProps {
  message: {
    role: string
    parts?: Array<{ text?: string }>
  }
  index: number
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-xs text-zinc-100">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded px-1.5 py-0.5 text-xs font-mono bg-muted-foreground/20">
      {children}
    </code>
  ),
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => <h1 className="mb-2 mt-3 text-base font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 mt-3 text-sm font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1.5 mt-2 text-xs font-semibold">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-primary pl-3 text-xs italic opacity-80">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic opacity-80">{children}</em>,
  hr: () => <hr className="my-2 border-t opacity-30" />,
  a: ({ children, href }) => (
    <a href={href} className="underline underline-offset-4 hover:opacity-80">
      {children}
    </a>
  ),
}

export function ChatMessageBubble({ message, index }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={isUser ? undefined : '/llama.png'} />
        <AvatarFallback className={isUser ? 'bg-primary' : ''}>
          {isUser ? <User className="h-4 w-4 text-primary-foreground" /> : 'AI'}
        </AvatarFallback>
      </Avatar>

      <Card className={`max-w-[80%] sm:max-w-[70%] ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <div
          style={chatFontStyle}
          className={`px-3 py-2.5 text-sm ${isUser ? '[&_a]:text-primary-foreground [&_strong]:text-primary-foreground' : ''}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message.parts?.[0]?.text || ''}
          </ReactMarkdown>
        </div>
      </Card>
    </motion.div>
  )
}

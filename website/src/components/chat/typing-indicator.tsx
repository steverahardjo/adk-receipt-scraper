import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary">AI</AvatarFallback>
      </Avatar>
      <Card className="bg-muted px-3 py-2.5">
        <div className="flex gap-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </Card>
    </motion.div>
  )
}

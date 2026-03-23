/*A dialog to ask whether they want telegram-profiling or form profiling */
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function ProfileDialog({ open, onOpenChange, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Profile</DialogTitle>
          <DialogDescription>
            How would you like to kickstart your profile?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={() => onSelect('telegram')}>
            Use Telegram Bot (guided)
          </Button>

          <Button variant="outline" onClick={() => onSelect('form')}>
            Fill Form Manually
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'
import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format, parse, isValid } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

/* ---------- FORMAT HELPERS ---------- */
function formatDate(date?: Date) {
  if (!date || !isValid(date)) return ''
  return format(date, 'dd/MM/yyyy')
}

function parseDate(value: string) {
  const parsed = parse(value, 'dd/MM/yyyy', new Date())
  return isValid(parsed) ? parsed : undefined
}

// Auto-insert slashes as user types: "01" → "01/", "0112" → "01/12/"
function applyDateMask(raw: string, prev: string): string {
  // Strip all non-digits first
  const digits = raw.replace(/\D/g, '')
  // Rebuild with slashes
  let masked = digits
  if (digits.length > 2) masked = digits.slice(0, 2) + '/' + digits.slice(2)
  if (digits.length > 4) masked = masked.slice(0, 5) + '/' + masked.slice(5, 9)
  // Cap at 10 chars (dd/MM/yyyy)
  return masked.slice(0, 10)
}

/* ---------- COMPONENT ---------- */
interface DatePickerInputProps {
  value?: Date
  onChange: (date?: Date) => void
  label?: string
}

export function DatePickerInput({
  value,
  onChange,
  label = 'Date',
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  // Local text state — only syncs to `value` when calendar picks a date
  const [text, setText] = React.useState(formatDate(value))
  const inputRef = React.useRef<HTMLInputElement>(null)

  // When the external value changes (e.g. calendar selection), update text
  React.useEffect(() => {
    setText(formatDate(value))
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyDateMask(e.target.value, text)
    setText(masked)
    // Only fire onChange when we have a fully valid date (10 chars)
    if (masked.length === 10) {
      const parsed = parseDate(masked)
      onChange(parsed) // passes undefined if invalid, letting parent handle it
    }
  }

  function handleBlur() {
    // On blur: if text is incomplete/invalid, either clear or revert to last valid value
    const parsed = parseDate(text)
    if (parsed) {
      // Valid — normalize formatting (e.g. fix any edge cases)
      setText(formatDate(parsed))
      onChange(parsed)
    } else if (text === '') {
      onChange(undefined)
    } else {
      // Invalid partial input — revert to last known good value
      setText(formatDate(value))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
    // Allow: digits, backspace, delete, tab, arrows, home/end
    const allowed = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ]
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <Field className="w-full">
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        {/* TEXT INPUT */}
        <InputGroupInput
          ref={inputRef}
          value={text}
          placeholder="dd/MM/yyyy"
          inputMode="numeric"
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        {/* CALENDAR BUTTON */}
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-background border shadow-lg rounded-md"
              align="end"
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={value}
                onSelect={(d) => {
                  onChange(d)
                  setText(formatDate(d))
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

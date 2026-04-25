import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface OTPFieldProps {
  email: string
  onSend: (email: string) => Promise<void>
  onChange: (code: string) => void
  duration?: number
  disabled?: boolean
}

export default function OTPField({
  email,
  onSend,
  onChange,
  duration = 60,
  disabled = false,
}: OTPFieldProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const timerRef = useRef<number | null>(null)

  const isCounting = timeLeft > 0

  async function handleSend() {
    if (!email) {
      toast.error('Enter your email first')
      return
    }

    const id = toast.loading('Sending code...')

    setLoading(true)
    try {
      await onSend(email)

      toast.success('Code sent', { id })
      setTimeLeft(duration)
    } catch {
      toast.error('Failed to send code', { id })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isCounting) return

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isCounting])

  function handleChange(value: string) {
    setOtp(value)
    onChange(value)
  }

  return (
    <div className="space-y-4">
      {/* SEND BUTTON */}
      <Button
        type="button"
        variant={isCounting ? 'secondary' : 'outline'}
        disabled={disabled || loading || isCounting || !email}
        onClick={handleSend}
        className="w-full h-11"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </span>
        ) : isCounting ? (
          `Resend in ${timeLeft}s`
        ) : (
          'Send verification code'
        )}
      </Button>

      {/* OTP INPUT */}
      {timeLeft > 0 && (
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleChange}
            disabled={disabled}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}
    </div>
  )
}

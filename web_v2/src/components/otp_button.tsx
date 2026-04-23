import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface OTPProps {
  onSend: () => void
  duration?: number
}

export default function OTPButton({ onSend, duration = 60 }: OTPProps) {
  const [timeLeft, setTimeLeft] = useState(0)

  const handleClick = () => {
    onSend()
    setTimeLeft(duration)
  }

  useEffect(() => {
    if (timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const isCounting = timeLeft > 0

  return (
    <Button
      type="button"
      variant={isCounting ? 'secondary' : 'outline'}
      disabled={isCounting}
      onClick={handleClick}
      className="w-full h-11"
    >
      {isCounting ? `Resend in ${timeLeft}s` : 'Send OTP'}
    </Button>
  )
}

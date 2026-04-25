import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { isPasswordValid } from '#/features/auth/PasswordField'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function useSignup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  const [verifyLoading, setVerifyLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailValid = isValidEmail(email)
  const passwordValid = isPasswordValid(password)

  const canSubmit =
    emailValid &&
    passwordValid &&
    otp.length === 6 &&
    !verifyLoading &&
    !aiLoading

  async function sendOtp(email: string) {
    await authClient.signIn.emailOtp({ email })
  }

  async function signup() {
    setVerifyLoading(true)
    setError(null)

    try {
      await authClient.signUp.email({
        email,
        password,
        otp,
      })

      localStorage.setItem('onboarding_mode', 'ai')
      setAiLoading(true)

      navigate({ to: '/chatbot' })
    } catch (e: any) {
      setError(e.message || 'Signup failed')
    } finally {
      setVerifyLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    otp,
    setOtp,
    emailValid,
    passwordValid,
    verifyLoading,
    aiLoading,
    error,
    canSubmit,
    sendOtp,
    signup,
  }
}

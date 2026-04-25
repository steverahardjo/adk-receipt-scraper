import { useState } from 'react'
import { authClient } from '#/lib/auth-client'

export function useLogin() {
  const [mode, setMode] = useState<'password' | 'otp'>('password')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  async function sendOtp(email: string) {
    await authClient.signIn.emailOtp({ email })
    setOtpSent(true)
  }

  async function loginWithPassword() {
    await authClient.signIn.email({
      email,
      password,
    })
  }

  async function loginWithOtp() {
    await authClient.signIn.emailOtpVerify({
      email,
      otp,
    })
  }

  return {
    mode,
    setMode,

    email,
    setEmail,

    password,
    setPassword,

    otp,
    setOtp,

    otpSent,

    sendOtp,
    loginWithPassword,
    loginWithOtp,
  }
}

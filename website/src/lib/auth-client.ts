// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'
import { emailOTPClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [emailOTPClient()],
})

export async function sendOTPEmail(email: string) {
  await authClient.emailOtp.sendVerificationOtp({
    email: email,
    type: 'sign-in',
  })
}

export async function confirmOTP(email: string, otp: string) {
  await authClient.signIn.emailOtp({
    email: email,
    otp: otp,
  })
}

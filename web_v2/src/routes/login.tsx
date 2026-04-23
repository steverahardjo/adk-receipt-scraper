import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, Mail, Lock } from 'lucide-react'
import { Branding } from '@/config/branding'
import OTPButton from '@/components/otp_button'
import Filler from '@/components/filler'

export const Route = createFileRoute('/login')({ component: Login })

function Login() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT — Visual */}
      <Filler />
      {/* RIGHT — Form */}
      <div className="flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-[420px]">
          <LoginPage />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  return (
    <Card className="w-full rounded-2xl shadow-lg border border-border">
      <CardContent className="p-8 flex flex-col gap-6">
        {/* Mobile Branding */}
        <div className="md:hidden">
          <h2 className="text-2xl font-bold text-[var(--deneb-blue)]">Deneb</h2>
        </div>

        {/* Toggle */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setMode('password')}
            className={`flex-1 py-2 text-sm rounded-md transition ${
              mode === 'password' ? 'bg-background shadow font-semibold' : ''
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setMode('otp')}
            className={`flex-1 py-2 text-sm rounded-md transition ${
              mode === 'otp' ? 'bg-background shadow font-semibold' : ''
            }`}
          >
            Email OTP
          </button>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Enter your details to continue
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input
                type="email"
                className="pl-10"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          {mode === 'password' && (
            <>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                  <Input
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full h-11">Login</Button>
            </>
          )}

          {/* OTP */}
          {mode === 'otp' && (
            <>
              <OTPButton
                onSend={() => {
                  if (!email) return
                  console.log('Send OTP to', email)
                }}
              />

              <Input
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button className="w-full h-11">Verify & Login</Button>
            </>
          )}

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t" />
            <span className="mx-3 text-xs text-muted-foreground uppercase">
              or
            </span>
            <div className="flex-grow border-t" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-2"
          >
            {Branding.google.logo}
            Continue with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <span className="text-primary font-semibold cursor-pointer">
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

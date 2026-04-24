import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

// ✅ Password validation
function validatePassword(password: string) {
  return {
    hasMinLength: password.length >= 10,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  }
}

function SignupPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const rules = validatePassword(password)
  const isPasswordValid =
    rules.hasMinLength &&
    rules.hasUppercase &&
    rules.hasNumber &&
    rules.hasSymbol

  // ✅ Send OTP
  async function handleSendOtp() {
    setOtpLoading(true)
    setError(null)

    try {
      await authClient.signIn.emailOtp({ email })
      setOtpSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  // ✅ Verify + Signup
  async function handleSignup() {
    setVerifyLoading(true)
    setError(null)

    try {
      // verify email first
      await authClient.verify.emailOtp({
        email,
        code: otp,
      })

      // then create account
      await authClient.signUp.email({
        email,
        password,
      })

      localStorage.setItem('onboarding_mode', 'ai')

      setAiLoading(true)
      navigate({ to: '/chatbot' })
    } catch (err: any) {
      setError(err.message || 'Invalid OTP or signup failed')
    } finally {
      setVerifyLoading(false)
    }
  }

  function handleTalkToAI() {
    setAiLoading(true)
    localStorage.setItem('onboarding_mode', 'ai')

    setTimeout(() => {
      navigate({ to: '/chatbot' })
    }, 400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Secure your account and continue with AI onboarding
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* EMAIL */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldDescription>
              We’ll send a verification code to this email.
            </FieldDescription>
          </Field>

          {/* SEND OTP */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSendOtp}
            disabled={!email || otpLoading}
          >
            {otpLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending code...
              </span>
            ) : otpSent ? (
              'Resend code'
            ) : (
              'Send verification code'
            )}
          </Button>

          {/* OTP */}
          {otpSent && (
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <Input
                id="otp"
                placeholder="Enter code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <FieldDescription>
                Check your email for the code.
              </FieldDescription>
            </Field>
          )}

          {/* PASSWORD */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* RULES */}
            <div className="text-xs space-y-1 mt-2">
              <p
                className={
                  rules.hasMinLength
                    ? 'text-green-500'
                    : 'text-muted-foreground'
                }
              >
                • At least 10 characters
              </p>
              <p
                className={
                  rules.hasUppercase
                    ? 'text-green-500'
                    : 'text-muted-foreground'
                }
              >
                • One uppercase letter
              </p>
              <p
                className={
                  rules.hasNumber ? 'text-green-500' : 'text-muted-foreground'
                }
              >
                • One number
              </p>
              <p
                className={
                  rules.hasSymbol ? 'text-green-500' : 'text-muted-foreground'
                }
              >
                • One special character
              </p>
            </div>

            <FieldDescription>
              Use a strong password to protect your account.
            </FieldDescription>
          </Field>

          {/* SIGN UP */}
          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={
              verifyLoading || !email || !otp || !isPasswordValid || aiLoading
            }
          >
            {verifyLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify & Continue'
            )}
          </Button>

          <Separator />

          {/* AI FIRST */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleTalkToAI}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening AI...
              </span>
            ) : (
              'Talk to AI first'
            )}
          </Button>

          {/* ERROR */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Loader2 } from 'lucide-react'

import OTPField from '#/features/auth/otp_button'
import { PasswordField } from '#/features/auth/PasswordField'
import { useSignup } from './use_signup'

export default function SignupCard() {
  const s = useSignup()

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Secure your account and continue with AI onboarding
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* EMAIL */}
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            value={s.email}
            onChange={(e) => s.setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <FieldDescription>
            We’ll send a verification code to this email.
          </FieldDescription>
        </Field>

        {/* PASSWORD */}
        <PasswordField value={s.password} onChange={s.setPassword} />

        {/* OTP */}
        <OTPField
          email={s.email}
          disabled={!s.emailValid || !s.passwordValid}
          onSend={s.sendOtp}
          onChange={s.setOtp}
        />

        {/* SUBMIT */}
        <Button className="w-full" onClick={s.signup} disabled={!s.canSubmit}>
          {s.verifyLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            'Create account'
          )}
        </Button>

        {/* ERROR */}
        {s.error && <p className="text-sm text-red-500">{s.error}</p>}
      </CardContent>
    </Card>
  )
}

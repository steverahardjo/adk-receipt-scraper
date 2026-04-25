import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'

export function validatePassword(password: string) {
  return {
    hasMinLength: password.length >= 10,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  }
}

export function isPasswordValid(password: string) {
  const r = validatePassword(password)
  return r.hasMinLength && r.hasUppercase && r.hasNumber && r.hasSymbol
}

export function PasswordField({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  const rules = useMemo(() => validatePassword(value), [value])

  return (
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>

      <Input
        id="password"
        type="password"
        placeholder="Enter a strong password"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="text-xs space-y-1 mt-2">
        <p
          className={
            rules.hasMinLength ? 'text-green-500' : 'text-muted-foreground'
          }
        >
          • At least 10 characters
        </p>
        <p
          className={
            rules.hasUppercase ? 'text-green-500' : 'text-muted-foreground'
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
  )
}

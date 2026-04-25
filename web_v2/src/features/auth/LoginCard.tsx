import { useLogin } from './use_login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Lock } from 'lucide-react'
import { Branding } from '@/config/branding'
import OTPField from '#/features/auth/otp_button'

export default function LoginCard() {
  const l = useLogin()

  return (
    <Card className="w-full rounded-2xl shadow-lg border border-border">
      <CardContent className="p-8 flex flex-col gap-6">
        {/* MOBILE BRAND */}
        <div className="md:hidden">
          <h2 className="text-2xl font-bold text-primary">Deneb</h2>
        </div>

        {/* MODE TOGGLE */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => l.setMode('password')}
            className={`flex-1 py-2 text-sm rounded-md ${
              l.mode === 'password' ? 'bg-background shadow font-semibold' : ''
            }`}
          >
            Password
          </button>

          <button
            type="button"
            onClick={() => l.setMode('otp')}
            className={`flex-1 py-2 text-sm rounded-md ${
              l.mode === 'otp' ? 'bg-background shadow font-semibold' : ''
            }`}
          >
            Email OTP
          </button>
        </div>

        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Enter your details to continue
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input
                className="pl-10"
                type="email"
                value={l.email}
                onChange={(e) => l.setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD MODE */}
          {l.mode === 'password' && (
            <>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                  <Input
                    className="pl-10"
                    type="password"
                    value={l.password}
                    onChange={(e) => l.setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full h-11" onClick={l.loginWithPassword}>
                Login
              </Button>
            </>
          )}

          {/* OTP MODE */}
          {l.mode === 'otp' && (
            <>
              <OTPField
                email={l.email}
                onSend={l.sendOtp}
                onChange={l.setOtp}
              />

              {l.otpSent && (
                <Button className="w-full h-11" onClick={l.loginWithOtp}>
                  Verify & Login
                </Button>
              )}
            </>
          )}

          {/* DIVIDER */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t" />
            <span className="mx-3 text-xs text-muted-foreground uppercase">
              or
            </span>
            <div className="flex-grow border-t" />
          </div>

          {/* GOOGLE */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-2"
          >
            {Branding.google.logo}
            Continue with Google
          </Button>
        </form>

        {/* FOOTER */}
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

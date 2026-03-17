import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { toast } from 'sonner'
import { Mail, Lock, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/signin')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          toast.success('Signed in successfully')
          navigate({ to: '/' })
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Invalid credentials')
          setIsLoading(false)
        },
      },
    )
  }

  async function handleMagicLinkSignIn() {
    if (!email) return toast.error('Please enter your email first')
    setIsLoading(true)
    await authClient.signIn.magicLink(
      {
        email,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setMagicLinkSent(true)
          toast.success('Magic link sent!')
          setIsLoading(false)
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Failed to send link')
          setIsLoading(false)
        },
      },
    )
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Choose your preferred way to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || magicLinkSent}
            />
          </div>

          {magicLinkSent ? (
            /* Magic Link Success State */
            <div className="rounded-lg border bg-blue-50 p-4 text-center dark:bg-blue-900/20">
              <Mail className="mx-auto mb-2 h-8 w-8 text-blue-500" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Check your inbox! We sent a link to {email}.
              </p>
              <Button
                variant="link"
                onClick={() => setMagicLinkSent(false)}
                className="mt-2 h-auto p-0"
              >
                Use password instead
              </Button>
            </div>
          ) : (
            /* Sign In Options */
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleMagicLinkSignIn}
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Magic Link
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or password
                  </span>
                </div>
              </div>

              <form onSubmit={handlePasswordSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !password}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  Sign In with Password
                </Button>
              </form>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/auth/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}

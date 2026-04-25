import { createFileRoute } from '@tanstack/react-router'
import SignupCard from '@/features/auth/SignUpCard'
import Filler from '#/components/filler'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <Filler />
      <div className="flex items-center justify-center px-4">
        <SignupCard />
      </div>
    </div>
  )
}

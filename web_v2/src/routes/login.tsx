import { createFileRoute } from '@tanstack/react-router'
import LoginCard from '@/features/auth/LoginCard'
import Filler from '@/components/filler'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <Filler />

      <div className="flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-[420px]">
          <LoginCard />
        </div>
      </div>
    </div>
  )
}

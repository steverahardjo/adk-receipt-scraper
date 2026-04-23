import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, Mail, Lock } from 'lucide-react'

export const Route = createFileRoute('/signup')({ component: Signup })

function Signup() {
  return <SignupPage />
}

export default function SignupPage() {}

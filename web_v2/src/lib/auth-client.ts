import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()

export async function getUserId(): Promise<string> {
  const session = await authClient.getSession()

  const userId = session?.user?.id
  if (!userId) {
    throw new Error('User is not authenticated')
  }

  return userId
}

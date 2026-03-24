/*src/lib/auth-client.ts */

export const authClient = {
  getSession: async () => {
    const response = await fetch('/api/session')
    return response.json()
  },
}

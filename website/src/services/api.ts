import axios from 'axios'
import { authClient } from '@/lib/auth-client'
import type { Expense, Profile } from '@/schema'

const BASE_URL = 'https://expense-tracker.com'

// 1. Create the base instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. The Interceptor: This runs BEFORE every request
api.interceptors.request.use(
  async (config) => {
    // Pull the session from Better Auth
    const { data: session } = await authClient.getSession()

    // Use User ID if logged in, otherwise fallback to a persistent Guest ID
    const identifier =
      session?.user?.id ||
      sessionStorage.getItem('guest_id') ||
      'anonymous_user'

    // Attach it to the custom header for your Agentic Backend
    config.headers['X-User-Id'] = identifier

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const dashboardAPI = {
  fetchDashboard: () => api.get('/dashboard').then((res) => res.data),
}

export const profileAPI = {
  fetchProfile: () => api.get('/profile').then((res) => res.data),
  updateProfile: (profile: Partial<Profile>) =>
    api.post('/profile', profile).then((res) => res.data),
}

// 3. Clean Feature APIs (No more passing 'id' manually!)
export const chatAPI = {
  fetchMessages: () => api.get<any[]>('/chat').then((res) => res.data),

  sendMessage: (text: string) =>
    api.post('/messages', { text }).then((res) => res.data),

  fetchProfileInput: () => api.get('/chat/profile').then((res) => res.data),
}

export const expenseAPI = {
  fetchExpenses: () => api.get<Expense[]>('/expenses').then((res) => res.data),

  sendExpense: (newExpense: Omit<Expense, 'id'>) =>
    api.post<Expense>('/expenses', newExpense).then((res) => res.data),
}

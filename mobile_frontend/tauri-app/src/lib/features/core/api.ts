const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3000/api'

export class ApiError extends Error {
  status: number | undefined
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.message || `Request failed (${res.status})`, res.status)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export function sendOtp(email: string): Promise<void> {
  return request('/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function signup(email: string, password: string, otp: string): Promise<void> {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, otp }),
  })
}

export function login(email: string, password: string): Promise<void> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

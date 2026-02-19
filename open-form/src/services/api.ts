import type { ExpensePayload, ExpenseResponse, ApiError as ApiErrorType } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

class ApiError extends Error {
  code?: string
  details?: unknown

  constructor(message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorType | null = null
    try {
      errorData = await response.json()
    } catch {
      // Response might not be JSON
    }

    throw new ApiError(
      errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
      errorData?.code,
      errorData?.details
    )
  }

  return response.json()
}

export async function submitExpense(payload: ExpensePayload): Promise<ExpenseResponse> {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<ExpenseResponse>(response)
}

export async function getExpenses(params?: {
  limit?: number
  offset?: number
  type?: string
  start_date?: string
  end_date?: string
}): Promise<{ expenses: unknown[]; total: number }> {
  const searchParams = new URLSearchParams()
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.offset) searchParams.set('offset', params.offset.toString())
  if (params?.type) searchParams.set('type', params.type)
  if (params?.start_date) searchParams.set('start_date', params.start_date)
  if (params?.end_date) searchParams.set('end_date', params.end_date)

  const response = await fetch(`${API_BASE_URL}/expenses?${searchParams}`)
  return handleResponse<{ expenses: unknown[]; total: number }>(response)
}

export interface PasswordRules {
  hasLength: boolean
  hasUpper: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

const SPECIAL_CHARS = /[@$!%*?&#^()_\-+=]/

export function validatePassword(password: string): PasswordRules {
  return {
    hasLength: password.length >= 14,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: SPECIAL_CHARS.test(password),
  }
}

export function isPasswordValid(password: string): boolean {
  const r = validatePassword(password)
  return r.hasLength && r.hasUpper && r.hasNumber && r.hasSpecial
}

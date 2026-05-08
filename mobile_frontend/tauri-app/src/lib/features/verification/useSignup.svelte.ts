import { showToast, dismissToast } from '$lib/features/core/toast.svelte'
import { isPasswordValid } from '$lib/features/core/passwordRules'
import * as api from '$lib/features/core/api'

export function createSignupState(onSuccess?: (email: string) => void) {
  let name = $state('')
  let email = $state('')
  let password = $state('')
  let otp = $state('')
  let otpSent = $state(false)
  let sendingOtp = $state(false)
  let submitting = $state(false)
  let error = $state<string | null>(null)
  let validated = $state(false)

  let nameError = $derived.by(() => {
    if (!validated) return ''
    return name.trim() ? '' : 'Required'
  })
  let emailError = $derived.by(() => {
    if (!validated) return ''
    if (!email) return 'Required'
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Invalid email'
  })
  let passwordError = $derived.by(() => {
    if (!validated) return ''
    if (!password) return 'Required'
    return isPasswordValid(password) ? '' : 'Does not meet requirements'
  })

  let emailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  let passwordValid = $derived(isPasswordValid(password))

  let canSubmit = $derived(
    name.trim() !== '' && emailValid && passwordValid && otp.length === 6 && !submitting && !sendingOtp
  )

  function validate(): boolean {
    validated = true
    return name.trim() !== '' && emailValid && passwordValid
  }

  async function sendOtp() {
    if (!emailValid || sendingOtp) return
    sendingOtp = true
    error = null
    showToast({ type: 'loading', title: 'Sending code...' })
    try {
      await api.sendOtp(email)
      dismissToast()
      showToast({ type: 'success', title: 'Code sent!', message: 'Check your email', duration: 3000 })
      otpSent = true
    } catch (e) {
      dismissToast()
      const msg = e instanceof Error ? e.message : 'Failed to send code'
      error = msg
      showToast({ type: 'error', title: 'Failed to send code', duration: 3000 })
    } finally {
      sendingOtp = false
    }
  }

  async function signup() {
    if (!validate() || !canSubmit) return
    submitting = true
    error = null
    showToast({ type: 'loading', title: 'Creating account...' })
    try {
      await api.signup(email, password, otp)
      dismissToast()
      showToast({ type: 'success', title: 'Account created!', duration: 2500 })
      onSuccess?.(email)
    } catch (e) {
      dismissToast()
      const msg = e instanceof Error ? e.message : 'Sign up failed'
      error = msg
      showToast({ type: 'error', title: 'Sign up failed', message: msg, duration: 3000 })
    } finally {
      submitting = false
    }
  }

  return {
    get name() { return name },
    set name(v: string) { name = v },
    get email() { return email },
    set email(v: string) { email = v },
    get password() { return password },
    set password(v: string) { password = v },
    get otp() { return otp },
    set otp(v: string) { otp = v },
    get otpSent() { return otpSent },
    get sendingOtp() { return sendingOtp },
    get submitting() { return submitting },
    get error() { return error },
    get nameError() { return nameError },
    get emailError() { return emailError },
    get passwordError() { return passwordError },
    get emailValid() { return emailValid },
    get passwordValid() { return passwordValid },
    get canSubmit() { return canSubmit },
    get validated() { return validated },
    sendOtp,
    signup,
  }
}

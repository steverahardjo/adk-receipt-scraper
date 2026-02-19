import { ref } from 'vue'

interface ToastState {
  visible: boolean
  message: string
  type: 'success' | 'error' | 'info'
}

const toastState = ref<ToastState>({
  visible: false,
  message: '',
  type: 'info',
})

export function useToast() {
  const show = (message: string, type: ToastState['type'] = 'info', duration = 4000) => {
    toastState.value = {
      visible: true,
      message,
      type,
    }

    if (duration > 0) {
      setTimeout(() => {
        toastState.value.visible = false
      }, duration)
    }
  }

  const success = (message: string, duration?: number) => show(message, 'success', duration)
  const error = (message: string, duration?: number) => show(message, 'error', duration)
  const info = (message: string, duration?: number) => show(message, 'info', duration)

  const hide = () => {
    toastState.value.visible = false
  }

  return {
    toast: toastState,
    show,
    success,
    error,
    info,
    hide,
  }
}

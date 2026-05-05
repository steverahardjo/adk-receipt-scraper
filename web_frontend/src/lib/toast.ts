import { toast } from 'sonner'

type ToastOptions = {
  description?: string
  duration?: number
}

export const appToast = {
  success: (message: string, opts?: ToastOptions) =>
    toast.success(message, {
      description: opts?.description,
      duration: opts?.duration,
      richColors: true,
    }),

  error: (message: string, opts?: ToastOptions) =>
    toast.error(message, {
      description: opts?.description,
      duration: opts?.duration,
      richColors: true,
    }),

  info: (message: string, opts?: ToastOptions) =>
    toast(message, {
      description: opts?.description,
      duration: opts?.duration,
      richColors: true,
    }),

  loading: (message: string, opts?: ToastOptions) =>
    toast.loading(message, {
      description: opts?.description,
      duration: opts?.duration,
    }),

  warning: (message: string, opts?: ToastOptions) =>
    toast.warning(message, {
      description: opts?.description,
      duration: opts?.duration,
    }),

  promise: async <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    },
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    })
  },
}

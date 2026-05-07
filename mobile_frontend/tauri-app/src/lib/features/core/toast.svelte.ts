export type ToastType = 'success' | 'error' | 'loading';

interface ToastState {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
}

let state = $state<ToastState>({
  visible: false,
  type: 'success',
  title: '',
  message: '',
});

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function showToast(opts: {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}) {
  if (timeoutId) clearTimeout(timeoutId);

  state = { visible: true, type: opts.type, title: opts.title, message: opts.message };

  if (opts.type !== 'loading' && (opts.duration ?? 3000) > 0) {
    timeoutId = setTimeout(() => {
      state.visible = false;
    }, opts.duration ?? 3000);
  }
}

export function dismissToast() {
  state.visible = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

export function getToastState() {
  return state;
}

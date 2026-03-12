/**
 * Debounce utility function
 * Delays invoking a function until after wait milliseconds have elapsed
 */

export type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void

export interface DebouncedRef<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): DebouncedRef<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      if (lastArgs) {
        fn(...lastArgs)
      }
    }, wait)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastArgs = null
  }

  debounced.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId)
      timeoutId = null
      fn(...lastArgs)
      lastArgs = null
    }
  }

  return debounced
}

/**
 * Throttle utility function
 * Ensures a function is called at most once every wait milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = wait - (now - lastCall)

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastCall = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        fn(...args)
      }, remaining)
    }
  }
}

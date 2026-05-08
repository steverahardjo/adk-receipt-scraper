export function longpress(node: HTMLElement, options: { duration?: number; onLongPress: () => void }) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let { duration = 500, onLongPress } = options

  function start() {
    timer = setTimeout(() => {
      timer = null
      onLongPress()
    }, duration)
  }

  function cancel() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  node.addEventListener('pointerdown', start)
  node.addEventListener('pointerup', cancel)
  node.addEventListener('pointerleave', cancel)
  node.addEventListener('pointermove', cancel)

  return {
    destroy() {
      node.removeEventListener('pointerdown', start)
      node.removeEventListener('pointerup', cancel)
      node.removeEventListener('pointerleave', cancel)
      node.removeEventListener('pointermove', cancel)
      cancel()
    },
  }
}

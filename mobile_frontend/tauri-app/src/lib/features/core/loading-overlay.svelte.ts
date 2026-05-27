let visible = $state(false)
let message = $state('')

export function showLoading(msg = '') {
  visible = true
  message = msg
}

export function hideLoading() {
  visible = false
  message = ''
}

export function getLoadingState() {
  return {
    get visible() {
      return visible
    },
    get message() {
      return message
    },
  }
}

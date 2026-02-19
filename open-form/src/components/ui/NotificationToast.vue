<script setup lang="ts">
import { ref, watch } from 'vue'

interface ToastProps {
  message?: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  visible: boolean
}

const props = withDefaults(defineProps<ToastProps>(), {
  message: '',
  type: 'info',
  duration: 4000,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const isVisible = ref(props.visible)

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal && props.duration > 0) {
    setTimeout(() => {
      isVisible.value = false
      emit('update:visible', false)
      emit('close')
    }, props.duration)
  }
})

const handleClose = () => {
  isVisible.value = false
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="isVisible" class="notification-toast" :class="[`notification-toast--${type}`]">
        <div class="toast__icon">
          <svg v-if="type === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg v-else-if="type === 'error'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="toast__message">{{ message }}</span>
        <button class="toast__close" @click="handleClose" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.notification-toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
  z-index: 9999;
  min-width: 300px;
  max-width: 450px;
  backdrop-filter: blur(8px);
  animation: slideIn 0.3s ease-out;
}

.notification-toast--success {
  background: rgba(22, 163, 74, 0.95);
  color: white;
}

.notification-toast--error {
  background: rgba(220, 38, 38, 0.95);
  color: white;
}

.notification-toast--info {
  background: rgba(59, 130, 246, 0.95);
  color: white;
}

.toast__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.toast__message {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
}

.toast__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.toast__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slideIn {
  from {
    transform: translateX(calc(100% + 2rem));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(calc(100% + 2rem));
  opacity: 0;
}

@media (max-width: 480px) {
  .toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>

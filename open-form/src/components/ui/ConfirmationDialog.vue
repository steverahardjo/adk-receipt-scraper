<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  type?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  type: 'danger',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLDivElement | null>(null)
const confirmButtonRef = ref<HTMLButtonElement | null>(null)
const isVisible = ref(props.visible)

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    setTimeout(() => confirmButtonRef.value?.focus(), 100)
  }
})

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isVisible.value) return
  if (event.key === 'Escape') {
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="isVisible" class="dialog-overlay" @click.self="handleCancel">
        <div
          ref="dialogRef"
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-message"
        >
          <div class="dialog__icon" :class="[`dialog__icon--${type}`]">
            <svg v-if="type === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <svg v-else-if="type === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>

          <h2 id="dialog-title" class="dialog__title">{{ title }}</h2>
          <p id="dialog-message" class="dialog__message">{{ message }}</p>

          <div class="dialog__actions">
            <button
              class="btn btn--cancel"
              @click="handleCancel"
              ref="cancelButtonRef"
            >
              {{ cancelLabel }}
            </button>
            <button
              ref="confirmButtonRef"
              class="btn"
              :class="[`btn--${type}`]"
              @click="handleConfirm"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.dialog {
  background: var(--dialog-bg, #ffffff);
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.dialog__icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.dialog__icon--danger {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.dialog__icon--warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.dialog__icon--info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.dialog__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dialog-text, #1f1f1f);
  margin: 0 0 0.5rem;
}

.dialog__message {
  font-size: 0.9375rem;
  color: var(--dialog-text-secondary, #5f6368);
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.dialog__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.btn--cancel {
  background: var(--btn-cancel-bg, #f0f0f0);
  color: var(--btn-cancel-text, #5f6368);
}

.btn--cancel:hover {
  background: var(--btn-cancel-hover, #e0e0e0);
}

.btn--danger {
  background: #dc2626;
  color: white;
}

.btn--danger:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn--warning {
  background: #f59e0b;
  color: white;
}

.btn--warning:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.btn--info {
  background: #3b82f6;
  color: white;
}

.btn--info:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn:focus-visible {
  outline: 2px solid var(--primary-500, #4285f4);
  outline-offset: 2px;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog,
.dialog-fade-leave-to .dialog {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>

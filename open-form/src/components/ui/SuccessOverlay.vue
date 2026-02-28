<script setup lang="ts">
interface Props {
  visible: boolean
}

defineProps<Props>()
</script>

<template>
  <transition name="fade">
    <div v-show="visible" class="success-overlay">
      <div class="success-content">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2>Expense Saved!</h2>
        <p>Your transaction has been recorded successfully.</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.success-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10;
}

.success-overlay--visible {
  opacity: 1;
  visibility: visible;
}

.dark-mode .success-overlay {
  background: rgba(30, 30, 46, 0.95);
}

.success-content {
  text-align: center;
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  border-radius: 50%;
  color: white;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.3);
}

.success-content h2 {
  font-family: 'Google Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 0.5rem 0;
}

.dark-mode .success-content h2 {
  color: #f0f0f0;
}

.success-content p {
  font-size: 0.9375rem;
  color: #5f6368;
  margin: 0;
}

.dark-mode .success-content p {
  color: #a0a0a0;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

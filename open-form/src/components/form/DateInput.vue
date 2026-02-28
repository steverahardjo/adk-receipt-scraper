<script setup lang="ts">
interface Props {
  modelValue: Date | string
  error?: string
  isLoading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const maxDate = new Date().toISOString().split('T')[0]
</script>

<template>
  <div class="form__group">
    <label class="label" for="date">
      <span class="label__text">Date</span>
      <span class="label__required">*</span>
    </label>
    <div class="input-wrapper" :class="{ 'input-wrapper--error': error }">
      <svg class="input__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <input
        id="date"
        :value="modelValue"
        type="date"
        class="input"
        :class="{ 'input--error': error }"
        :disabled="isLoading"
        :max="maxDate"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <transition name="fade">
      <p v-if="error" class="error-message">{{ error }}</p>
    </transition>
  </div>
</template>

<style scoped>
.form__group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #444746;
}

.dark-mode .label {
  color: #e0e0e0;
}

.label__required {
  color: #d93025;
}

.dark-mode .label__required {
  color: #ff6b6b;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper--error {
  --input-border-color: #d93025;
}

.input__icon {
  position: absolute;
  left: 1rem;
  color: #9aa0a6;
  pointer-events: none;
  z-index: 1;
  transition: color 0.2s;
}

.dark-mode .input__icon {
  color: #707080;
}

.input-wrapper:focus-within .input__icon {
  color: #0b57d0;
}

.dark-mode .input-wrapper:focus-within .input__icon {
  color: #4285f4;
}

.input-wrapper--error .input__icon {
  color: #d93025;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: 0.9375rem;
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  background: #fff;
  transition: all 0.2s;
  font-family: inherit;
  color: #1f1f1f;
}

.dark-mode .input {
  background: #2a2a3e;
  border-color: #404055;
  color: #f0f0f0;
}

.input:hover {
  border-color: #5f6368;
}

.dark-mode .input:hover {
  border-color: #606080;
}

.input:focus {
  outline: none;
  border-color: #0b57d0;
  box-shadow: 0 0 0 3px rgba(11, 87, 208, 0.1);
}

.dark-mode .input:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

.input--error {
  border-color: #d93025;
  box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
}

.input::placeholder {
  color: #9aa0a6;
}

.dark-mode .input::placeholder {
  color: #707080;
}

.error-message {
  margin: 0;
  font-size: 0.75rem;
  color: #d93025;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message::before {
  content: '⚠';
  font-size: 0.625rem;
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

<script setup lang="ts">
interface Props {
  modelValue: string
  error?: string
  isLoading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="form__group">
    <label class="label" for="title">
      <span class="label__text">Title</span>
      <span class="label__required">*</span>
    </label>
    <div class="input-wrapper" :class="{ 'input-wrapper--error': error }">
      <svg class="input__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
      <input
        id="title"
        :value="modelValue"
        type="text"
        class="input"
        :class="{ 'input--error': error }"
        placeholder="e.g. Morning coffee at Starbucks"
        :disabled="isLoading"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        autocomplete="off"
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
}
</style>

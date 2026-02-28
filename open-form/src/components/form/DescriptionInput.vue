<script setup lang="ts">
interface Props {
  modelValue: string
  isLoading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="form__group">
    <label class="label" for="description">
      <span class="label__text">Description</span>
      <span class="label__optional">(optional)</span>
    </label>
    <div class="input-wrapper">
      <svg class="input__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
      <textarea
        id="description"
        :value="modelValue"
        class="textarea"
        rows="3"
        placeholder="Add any notes or details about this expense..."
        :disabled="isLoading"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
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

.label__optional {
  color: #9aa0a6;
  font-weight: 400;
  font-size: 0.8125rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
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

.textarea {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: 0.9375rem;
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  background: #fff;
  transition: all 0.2s;
  font-family: inherit;
  color: #1f1f1f;
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.dark-mode .textarea {
  background: #2a2a3e;
  border-color: #404055;
  color: #f0f0f0;
}

.textarea:hover {
  border-color: #5f6368;
}

.dark-mode .textarea:hover {
  border-color: #606080;
}

.textarea:focus {
  outline: none;
  border-color: #0b57d0;
  box-shadow: 0 0 0 3px rgba(11, 87, 208, 0.1);
}

.dark-mode .textarea:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

.textarea::placeholder {
  color: #9aa0a6;
}

.dark-mode .textarea::placeholder {
  color: #707080;
}
</style>

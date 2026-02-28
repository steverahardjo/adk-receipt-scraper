<script setup lang="ts">
interface ExpenseType {
  value: string
  label: string
  icon: string
}

interface Props {
  modelValue: string
  error?: string
  isLoading: boolean
  types: ExpenseType[]
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
    <label class="label" for="type">
      <span class="label__text">Expense Type</span>
      <span class="label__required">*</span>
    </label>
    <div class="select-grid">
      <button
        v-for="type in types"
        :key="type.value"
        type="button"
        class="type-card"
        :class="{
          'type-card--selected': modelValue === type.value,
          'type-card--error': error
        }"
        @click="emit('update:modelValue', type.value)"
        :disabled="isLoading"
      >
        <span class="type-card__icon">{{ type.icon }}</span>
        <span class="type-card__label">{{ type.label }}</span>
      </button>
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

.select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.dark-mode .type-card {
  background: #2a2a3e;
  border-color: #404055;
}

.type-card:hover:not(:disabled) {
  border-color: #0b57d0;
  background: #f0f7ff;
}

.dark-mode .type-card:hover:not(:disabled) {
  border-color: #4285f4;
  background: #32324a;
}

.type-card--selected {
  border-color: #0b57d0;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f7ff 100%);
  box-shadow: 0 2px 8px rgba(11, 87, 208, 0.15);
}

.dark-mode .type-card--selected {
  border-color: #4285f4;
  background: linear-gradient(135deg, #2a3a5a 0%, #324060 100%);
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
}

.type-card--error {
  border-color: #d93025;
}

.type-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.type-card__icon {
  font-size: 1.5rem;
}

.type-card__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #444746;
  text-align: center;
}

.dark-mode .type-card__label {
  color: #e0e0e0;
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

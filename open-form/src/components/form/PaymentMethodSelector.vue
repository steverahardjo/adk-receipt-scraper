<script setup lang="ts">
interface PaymentMethod {
  value: string
  label: string
  icon: string
}

interface Props {
  modelValue: string
  error?: string
  isLoading: boolean
  methods: PaymentMethod[]
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
    <label class="label" for="payment_type">
      <span class="label__text">Payment Method</span>
      <span class="label__required">*</span>
    </label>
    <div class="payment-grid">
      <button
        v-for="method in methods"
        :key="method.value"
        type="button"
        class="payment-card"
        :class="{
          'payment-card--selected': modelValue === method.value,
          'payment-card--error': error
        }"
        @click="emit('update:modelValue', method.value)"
        :disabled="isLoading"
      >
        <span class="payment-card__icon">{{ method.icon }}</span>
        <span class="payment-card__label">{{ method.label }}</span>
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

.label__required {
  color: #d93025;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.payment-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 0.75rem;
  border: 1.5px solid #dadce0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-card:hover:not(:disabled) {
  border-color: #0b57d0;
  background: #f0f7ff;
}

.payment-card--selected {
  border-color: #0b57d0;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f7ff 100%);
  box-shadow: 0 2px 8px rgba(11, 87, 208, 0.15);
}

.payment-card--error {
  border-color: #d93025;
}

.payment-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-card__icon {
  font-size: 1.375rem;
}

.payment-card__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #444746;
  text-align: center;
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

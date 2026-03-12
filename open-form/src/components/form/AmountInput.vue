<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import InputNumber from 'primevue/inputnumber'

interface Currency {
  code: string
  label: string
}

interface Props {
  modelValue: number | null
  currency: string
  error?: string
  isLoading: boolean
  currencies: Record<string, Currency>
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'update:currency': [value: string]
}>()

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectCurrency = (key: string) => {
  emit('update:currency', key)
  localStorage.setItem('currency', key)
  showDropdown.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  const el = dropdownRef.value
  if (showDropdown.value && el && !el.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="form__group form__group--flex">
    <label class="label" for="amount">
      <span class="label__text">Amount</span>
      <span class="label__required">*</span>
    </label>
    <div class="money-field" :class="{ 'money-field--error': error }">
      <div class="currency-dropdown" ref="dropdownRef">
        <button
          type="button"
          class="currency-btn"
          @click="toggleDropdown"
          :disabled="isLoading"
        >
          <span :class="['fi', `fi-${currencies[currency]?.code}`]"></span>
          <span class="currency-code">{{ currency }}</span>
          <svg
            class="dropdown-arrow"
            :class="{ 'rotated': showDropdown }"
            width="12" height="12" viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>

        <transition name="fade">
          <ul v-show="showDropdown" class="currency-list">
            <li
              v-for="(val, key) in currencies"
              :key="key"
              @click="selectCurrency(key)"
            >
              <span :class="['fi', `fi-${val.code}`]"></span>
              <span class="currency-code-item">{{ key }} - {{ val.label }}</span>
            </li>
          </ul>
        </transition>
      </div>
      <InputNumber
        :model-value="modelValue"
        class="amount-input"
        :disabled="isLoading"
        placeholder="0.00"
        :min="0"
        :max-fraction-digits="2"
        :use-grouping="true"
        locale="en-US"
        @update:model-value="emit('update:modelValue', $event)"
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

.form__group--flex {
  display: flex;
  flex-direction: column;
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

.money-field {
  display: flex;
  align-items: center;
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  background: #fff;
  overflow: visible;
  transition: all 0.2s;
}

.money-field:hover {
  border-color: #5f6368;
}

.money-field:focus-within {
  border-color: #0b57d0;
  box-shadow: 0 0 0 3px rgba(11, 87, 208, 0.1);
}

.money-field--error {
  border-color: #d93025;
  box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
}

.currency-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  border-right: 1px solid #dadce0;
}

.currency-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  padding: 0 0.875rem;
  height: 46px;
  color: #444746;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.currency-btn:hover:not(:disabled) {
  background: #e8eaed;
}

.currency-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.currency-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 10px;
  padding: 0.5rem 0;
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 50;
  margin: 0;
  list-style: none;
}

.currency-list li {
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1f1f1f;
  transition: background-color 0.15s;
}

.currency-list li:hover {
  background: #f0f7ff;
}

.fi {
  width: 1.375em;
  border-radius: 3px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}

.amount-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  min-width: 0;
  outline: none;
}

.amount-input :deep(.p-inputnumber-input) {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.9375rem;
  width: 100%;
  text-align: left;
}

.amount-input :deep(input) {
  border: none;
  background: transparent;
  padding: 0;
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

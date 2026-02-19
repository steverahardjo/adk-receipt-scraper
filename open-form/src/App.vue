<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useExpenseForm } from '@/composables/useExpenseForm'
import { useToast } from '@/composables/useToast'
import { useAutocomplete } from '@/composables/useAutocomplete'
import NotificationToast from '@/components/ui/NotificationToast.vue'

import 'flag-icons/css/flag-icons.min.css'
import '@material/web/button/elevated-button.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/text-button.js'
import '@material/web/icon/icon.js'
import '@material/web/progress/circular-progress.js'

import InputNumber from 'primevue/inputnumber'

type Currency = 'USD' | 'IDR' | 'SGD' | 'MYR' | 'JPY'

const { form, errors, isLoading, isSuccess, error, submit, resetForm } = useExpenseForm()
const { toast, success, error: showError } = useToast()

// Autocomplete for title field
const titleInputRef = ref<HTMLInputElement | null>(null)
const titleDropdownRef = ref<HTMLElement | null>(null)
const titleRef = ref(form.title)

// Sync titleRef with form.title
watch(
  () => form.title,
  (newVal) => { titleRef.value = newVal }
)
watch(
  () => titleRef.value,
  (newVal) => { form.title = newVal }
)

const {
  suggestions,
  isLoading: isAutocompleteLoading,
  isOpen,
  selectedIndex,
  selectSuggestion,
  handleKeydown,
  close: closeAutocomplete,
  open,
} = useAutocomplete(titleRef, {
  minLength: 2,
  debounceMs: 150,
  maxSuggestions: 5,
  useWheeler: true,
})

const handleClickOutsideAutocomplete = (e: MouseEvent) => {
  const el = titleDropdownRef.value
  if (isOpen.value && el && !el.contains(e.target as Node)) {
    closeAutocomplete()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideAutocomplete)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideAutocomplete)
})

const currencyMap: Record<Currency, { code: string; label: string }> = {
  USD: { code: 'us', label: 'US Dollar' },
  IDR: { code: 'id', label: 'Indonesian Rupiah' },
  SGD: { code: 'sg', label: 'Singapore Dollar' },
  MYR: { code: 'my', label: 'Malaysian Ringgit' },
  JPY: { code: 'jp', label: 'Japanese Yen' }
}

const initialCurrency = (localStorage.getItem('currency') as Currency) || 'USD'
form.currency = initialCurrency

const showCurrencyDropdown = ref(false)
const currencyDropdownRef = ref<HTMLElement | null>(null)

const toggleCurrencyDropdown = () => {
  showCurrencyDropdown.value = !showCurrencyDropdown.value
}

const closeCurrencyDropdown = () => {
  showCurrencyDropdown.value = false
}

const handleClickOutsideCurrency = (e: MouseEvent) => {
  const el = currencyDropdownRef.value
  if (showCurrencyDropdown.value && el && !el.contains(e.target as Node)) {
    closeCurrencyDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideCurrency)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideCurrency)
})

const selectCurrency = (key: string) => {
  form.currency = key as Currency
  localStorage.setItem('currency', key)
  closeCurrencyDropdown()
}

const handleSubmit = async () => {
  const submitted = await submit()
  if (submitted) {
    success('Expense saved successfully!')
    resetForm()
  } else if (error.value) {
    showError(error.value)
  }
}

const expenseTypes = [
  { value: 'Food', label: 'Food & Dining', icon: '🍔' },
  { value: 'Transport', label: 'Transport', icon: '🚗' },
  { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'Bills', label: 'Bills & Utilities', icon: '📄' },
  { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'Health', label: 'Health', icon: '💊' },
  { value: 'Other', label: 'Other', icon: '📦' },
]

const paymentMethods = [
  { value: 'Cash', label: 'Cash', icon: '💵' },
  { value: 'Debit', label: 'Debit Card', icon: '💳' },
  { value: 'Credit', label: 'Credit Card', icon: '💳' },
  { value: 'E-Wallet', label: 'E-Wallet', icon: '📱' },
  { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦' },
]

// Dark mode toggle
const getInitialDarkMode = () => {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    return saved === 'true'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDarkMode = ref(getInitialDarkMode())

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', String(isDarkMode.value))
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
}

onMounted(() => {
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
})
</script>

<template>
  <main class="container">
    <NotificationToast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @update:visible="toast.visible = $event"
    />

    <div class="header">
      <div class="header__top">
        <div class="header__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <md-text-button
          class="theme-toggle"
          @click="toggleDarkMode"
          aria-label="Toggle dark mode"
        >
          <svg v-if="isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
        </md-text-button>
      </div>
      <h1 class="header__title">Add Expense</h1>
      <p class="header__subtitle">Track your spending, one transaction at a time</p>
    </div>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="form__group">
        <label class="label" for="title">
          <span class="label__text">Title</span>
          <span class="label__required">*</span>
        </label>
        <div class="input-wrapper" :class="{ 'input-wrapper--error': errors.title }">
          <svg class="input__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <input
            ref="titleInputRef"
            id="title"
            v-model="form.title"
            type="text"
            class="input"
            :class="{ 'input--error': errors.title }"
            placeholder="e.g. Morning coffee at Starbucks"
            :disabled="isLoading"
            @keydown="handleKeydown"
            @focus="open"
            autocomplete="off"
          />
          <!-- Loading indicator -->
          <md-circular-progress
            v-if="isAutocompleteLoading"
            class="autocomplete-loading"
            indeterminate
            density="-4"
          ></md-circular-progress>
        </div>

        <!-- Autocomplete suggestions dropdown -->
        <transition name="fade">
          <ul
            v-show="isOpen"
            ref="titleDropdownRef"
            class="autocomplete-dropdown"
          >
            <li
              v-for="(suggestion, index) in suggestions"
              :key="suggestion.term"
              class="autocomplete-item"
              :class="{ 'autocomplete-item--selected': index === selectedIndex }"
              @click="selectSuggestion(index)"
              @mouseenter="selectedIndex = index"
            >
              <div class="autocomplete-item__content">
                <span class="autocomplete-item__term">{{ suggestion.term }}</span>
                <span class="autocomplete-item__badge" :class="{
                  'autocomplete-item__badge--prefix': suggestion.isPrefixMatch,
                  'autocomplete-item__badge--wheeler': suggestion.isWheelerMatch
                }">
                  {{ suggestion.isPrefixMatch ? 'Prefix' : 'Match' }}
                </span>
              </div>
            </li>
          </ul>
        </transition>

        <transition name="fade">
          <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
        </transition>
      </div>

      <div class="form__group">
        <label class="label" for="type">
          <span class="label__text">Expense Type</span>
          <span class="label__required">*</span>
        </label>
        <div class="select-grid">
          <button
            v-for="type in expenseTypes"
            :key="type.value"
            type="button"
            class="type-card"
            :class="{ 'type-card--selected': form.type === type.value, 'type-card--error': errors.type }"
            @click="form.type = type.value"
            :disabled="isLoading"
          >
            <span class="type-card__icon">{{ type.icon }}</span>
            <span class="type-card__label">{{ type.label }}</span>
          </button>
        </div>
        <transition name="fade">
          <p v-if="errors.type" class="error-message">{{ errors.type }}</p>
        </transition>
      </div>

      <div class="form__row">
        <div class="form__group form__group--flex">
          <label class="label" for="amount">
            <span class="label__text">Amount</span>
            <span class="label__required">*</span>
          </label>
          <div class="money-field" :class="{ 'money-field--error': errors.amount }">
            <div class="currency-dropdown" ref="currencyDropdownRef">
              <button
                type="button"
                class="currency-btn"
                @click="toggleCurrencyDropdown"
                :disabled="isLoading"
              >
                <span :class="['fi', `fi-${currencyMap[form.currency as Currency].code}`]"></span>
                <span class="currency-code">{{ form.currency }}</span>
                <svg
                  class="dropdown-arrow"
                  :class="{ 'rotated': showCurrencyDropdown }"
                  width="12" height="12" viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </button>

              <transition name="fade">
                <ul v-show="showCurrencyDropdown" class="currency-list">
                  <li
                    v-for="(val, key) in currencyMap"
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
              v-model="form.amount"
              class="amount-input"
              :disabled="isLoading"
              placeholder="0.00"
              :min="0"
              :max-fraction-digits="2"
            />
          </div>
          <transition name="fade">
            <p v-if="errors.amount" class="error-message">{{ errors.amount }}</p>
          </transition>
        </div>

        <div class="form__group">
          <label class="label" for="date">
            <span class="label__text">Date</span>
            <span class="label__required">*</span>
          </label>
          <div class="input-wrapper" :class="{ 'input-wrapper--error': errors.date }">
            <svg class="input__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <input
              id="date"
              v-model="form.date"
              type="date"
              class="input"
              :class="{ 'input--error': errors.date }"
              :disabled="isLoading"
              :max="new Date().toISOString().split('T')[0]"
            />
          </div>
          <transition name="fade">
            <p v-if="errors.date" class="error-message">{{ errors.date }}</p>
          </transition>
        </div>
      </div>

      <div class="form__group">
        <label class="label" for="payment_type">
          <span class="label__text">Payment Method</span>
          <span class="label__required">*</span>
        </label>
        <div class="payment-grid">
          <button
            v-for="method in paymentMethods"
            :key="method.value"
            type="button"
            class="payment-card"
            :class="{ 'payment-card--selected': form.payment_type === method.value, 'payment-card--error': errors.payment_type }"
            @click="form.payment_type = method.value"
            :disabled="isLoading"
          >
            <span class="payment-card__icon">{{ method.icon }}</span>
            <span class="payment-card__label">{{ method.label }}</span>
          </button>
        </div>
        <transition name="fade">
          <p v-if="errors.payment_type" class="error-message">{{ errors.payment_type }}</p>
        </transition>
      </div>

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
            v-model="form.description"
            class="textarea"
            rows="3"
            placeholder="Add any notes or details about this expense..."
            :disabled="isLoading"
          />
        </div>
      </div>

      <div class="form__actions">
        <md-filled-button
          class="submit-btn"
          :disabled="isLoading"
          @click="handleSubmit"
        >
          <md-circular-progress v-if="isLoading" indeterminate density="-3"></md-circular-progress>
          <span v-else>Save Expense</span>
        </md-filled-button>
      </div>
    </form>

    <div class="success-overlay" :class="{ 'success-overlay--visible': isSuccess }">
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
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Roboto:wght@400;500&display=swap');

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  font-family: 'Roboto', system-ui, sans-serif;
  background: linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%);
  border-radius: 24px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

:global(.dark-mode) .container {
  background: linear-gradient(135deg, #1e1e2e 0%, #252542 100%);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0b57d0 0%, #1a73e8 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(11, 87, 208, 0.3);
}

:global(.dark-mode) .header__icon {
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #5f6368;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1f1f1f;
}

:global(.dark-mode) .theme-toggle {
  color: #e0e0e0;
}

:global(.dark-mode) .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.header__title {
  font-family: 'Google Sans', sans-serif;
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 0.5rem 0;
}

.header__subtitle {
  font-size: 0.9375rem;
  color: #5f6368;
  margin: 0;
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form__group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form__group--flex {
  display: flex;
  flex-direction: column;
}

/* Labels */
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

.label__optional {
  color: #9aa0a6;
  font-weight: 400;
  font-size: 0.8125rem;
}

/* Input Wrapper */
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

.input-wrapper:focus-within .input__icon {
  color: #0b57d0;
}

.input-wrapper--error .input__icon {
  color: #d93025;
}

/* Inputs */
.input,
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
}

.input:hover,
.textarea:hover {
  border-color: #5f6368;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #0b57d0;
  box-shadow: 0 0 0 3px rgba(11, 87, 208, 0.1);
}

.input--error {
  border-color: #d93025;
  box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
}

.input::placeholder,
.textarea::placeholder {
  color: #9aa0a6;
}

.textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

/* Type Cards */
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

.type-card:hover:not(:disabled) {
  border-color: #0b57d0;
  background: #f0f7ff;
}

.type-card--selected {
  border-color: #0b57d0;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f7ff 100%);
  box-shadow: 0 2px 8px rgba(11, 87, 208, 0.15);
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

/* Payment Cards */
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

/* Money Field */
.money-field {
  display: flex;
  align-items: center;
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
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

.amount-input :deep(input) {
  border: none;
  background: transparent;
  padding: 0;
}

/* Error Messages */
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

/* Autocomplete Dropdown */
.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 12px;
  padding: 0.5rem 0;
  max-height: 280px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  margin: 0;
  list-style: none;
}

:global(.dark-mode) .autocomplete-dropdown {
  background: #2a2a3e;
  border-color: #404055;
}

.autocomplete-item {
  padding: 0.625rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.autocomplete-item:hover,
.autocomplete-item--selected {
  background: #f0f7ff;
}

:global(.dark-mode) .autocomplete-item:hover,
:global(.dark-mode) .autocomplete-item--selected {
  background: #324060;
}

.autocomplete-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.autocomplete-item__term {
  font-size: 0.875rem;
  color: #1f1f1f;
  font-weight: 400;
  flex: 1;
}

:global(.dark-mode) .autocomplete-item__term {
  color: #f0f0f0;
}

.autocomplete-item__badge {
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.autocomplete-item__badge--prefix {
  background: #e8f0fe;
  color: #0b57d0;
}

:global(.dark-mode) .autocomplete-item__badge--prefix {
  background: #2a3a5a;
  color: #8ab4f8;
}

.autocomplete-item__badge--wheeler {
  background: #fce8e6;
  color: #c5221f;
}

:global(.dark-mode) .autocomplete-item__badge--wheeler {
  background: #5a2a2a;
  color: #f28b82;
}

.autocomplete-loading {
  position: absolute;
  right: 0.75rem;
  --md-circular-progress-size: 16px;
  --md-circular-progress-width: 2px;
  color: #0b57d0;
}

/* Submit Button */
.form__actions {
  margin-top: 0.5rem;
}

.submit-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #0b57d0 0%, #1a73e8 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(11, 87, 208, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0947a8 0%, #0b57d0 100%);
  box-shadow: 0 4px 12px rgba(11, 87, 208, 0.4);
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(11, 87, 208, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn :deep(md-circular-progress) {
  --md-circular-progress-size: 20px;
  --md-circular-progress-width: 2px;
  color: white;
}

/* Success Overlay */
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

.success-content p {
  font-size: 0.9375rem;
  color: #5f6368;
  margin: 0;
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

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Responsive */
/* Dark Mode Styles */
:global(.dark-mode) .header__title {
  color: #f0f0f0;
}

:global(.dark-mode) .header__subtitle {
  color: #a0a0a0;
}

:global(.dark-mode) .label {
  color: #e0e0e0;
}

:global(.dark-mode) .input,
:global(.dark-mode) .textarea {
  background: #2a2a3e;
  border-color: #404055;
  color: #f0f0f0;
}

:global(.dark-mode) .input:hover,
:global(.dark-mode) .textarea:hover {
  border-color: #606080;
}

:global(.dark-mode) .input:focus,
:global(.dark-mode) .textarea:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

:global(.dark-mode) .input::placeholder,
:global(.dark-mode) .textarea::placeholder {
  color: #707080;
}

:global(.dark-mode) .input-wrapper:focus-within .input__icon {
  color: #4285f4;
}

:global(.dark-mode) .input__icon {
  color: #707080;
}

:global(.dark-mode) .type-card,
:global(.dark-mode) .payment-card {
  background: #2a2a3e;
  border-color: #404055;
}

:global(.dark-mode) .type-card:hover:not(:disabled),
:global(.dark-mode) .payment-card:hover:not(:disabled) {
  border-color: #4285f4;
  background: #32324a;
}

:global(.dark-mode) .type-card--selected,
:global(.dark-mode) .payment-card--selected {
  border-color: #4285f4;
  background: linear-gradient(135deg, #2a3a5a 0%, #324060 100%);
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
}

:global(.dark-mode) .type-card__label,
:global(.dark-mode) .payment-card__label {
  color: #e0e0e0;
}

:global(.dark-mode) .money-field {
  background: #2a2a3e;
  border-color: #404055;
}

:global(.dark-mode) .money-field:hover {
  border-color: #606080;
}

:global(.dark-mode) .money-field:focus-within {
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

:global(.dark-mode) .currency-btn {
  background: #32324a;
  color: #e0e0e0;
}

:global(.dark-mode) .currency-btn:hover:not(:disabled) {
  background: #3a3a55;
}

:global(.dark-mode) .currency-dropdown {
  border-right-color: #404055;
}

:global(.dark-mode) .currency-list {
  background: #2a2a3e;
  border-color: #404055;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

:global(.dark-mode) .currency-list li {
  color: #e0e0e0;
}

:global(.dark-mode) .currency-list li:hover {
  background: #32324a;
}

:global(.dark-mode) .amount-input :deep(input) {
  color: #f0f0f0;
}

:global(.dark-mode) .textarea {
  background: #2a2a3e;
}

:global(.dark-mode) .submit-btn {
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4);
}

:global(.dark-mode) .submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4285f4 0%, #5c9aff 100%);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.5);
}

:global(.dark-mode) .success-overlay {
  background: rgba(30, 30, 46, 0.95);
}

:global(.dark-mode) .success-content h2 {
  color: #f0f0f0;
}

:global(.dark-mode) .success-content p {
  color: #a0a0a0;
}

:global(.dark-mode) .error-message {
  color: #ff6b6b;
}

:global(.dark-mode) .label__required {
  color: #ff6b6b;
}

/* Mobile UX Improvements */
@media (max-width: 640px) {
  .container {
    margin: 0;
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    padding: 1.5rem 1rem;
    box-shadow: none;
  }

  .header__top {
    margin-bottom: 0.75rem;
  }

  .header__icon {
    width: 56px;
    height: 56px;
  }

  .header__title {
    font-size: 1.5rem;
  }

  .header__subtitle {
    font-size: 0.875rem;
  }

  .form {
    gap: 1.25rem;
  }

  .form__row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .select-grid,
  .payment-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.625rem;
  }

  .type-card,
  .payment-card {
    padding: 0.875rem 0.5rem;
  }

  .type-card__icon,
  .payment-card__icon {
    font-size: 1.5rem;
  }

  .type-card__label,
  .payment-card__label {
    font-size: 0.75rem;
  }

  .label {
    font-size: 0.8125rem;
  }

  .input,
  .textarea,
  .currency-btn {
    font-size: 16px !important;
  }

  .money-field {
    flex-direction: row;
  }

  .currency-btn {
    height: 48px;
    padding: 0 0.75rem;
  }

  .submit-btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    min-height: 50px;
  }

  .notification-toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
}

/* Touch-friendly improvements for mobile */
@media (pointer: coarse) {
  .type-card,
  .payment-card {
    min-height: 80px;
  }

  .currency-btn {
    min-height: 48px;
    min-width: 48px;
  }

  .input,
  .textarea {
    min-height: 48px;
  }

  .submit-btn {
    min-height: 50px;
  }

  .theme-toggle {
    min-width: 48px;
    min-height: 48px;
  }
}
</style>

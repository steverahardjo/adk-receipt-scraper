<script setup lang="ts">
import { ref, watch } from 'vue'
import { vMaska } from "maska/vue";

import "flag-icons/css/flag-icons.min.css"

type Currency = 'USD' | 'IDR' | 'SGD' | 'MYR' | 'JPY'

const title = ref('')
const type = ref('')
const amount = ref<number | null>(null)
const date = ref(new Date().toISOString().slice(0, 10))
const payment_type = ref('')
const description = ref('')

const currencyMap: Record<Currency, { code: string; label: string }> = {
  USD: { code: 'us', label: 'US Dollar' },
  IDR: { code: 'id', label: 'Indonesian Rupiah' },
  SGD: { code: 'sg', label: 'Singapore Dollar' },
  MYR: { code: 'my', label: 'Malaysian Ringgit' },
  JPY: { code: 'jp', label: 'Japanese Yen' }
}

// Safely retrieve currency or default to USD
const initialCurrency = (localStorage.getItem('currency') as Currency) || 'USD'
const currency = ref<Currency>(initialCurrency)

watch(currency, val => {
  localStorage.setItem('currency', val)
})

const showCurrencyDropdown = ref(false)

const selectCurrency = (key: string) => {
  currency.value = key as Currency
  showCurrencyDropdown.value = false
}

const submitForm = () => {
  if (!title.value || !amount.value || !date.value || !payment_type.value) return

  const payload = {
    title: title.value,
    type: type.value,
    amount: amount.value,
    currency: currency.value,
    date: date.value,
    payment_type: payment_type.value,
    description: description.value,
  }

  console.log('expense-payload', JSON.stringify(payload, null, 2))
  alert(`Saved: ${payload.currency} ${payload.amount} for ${payload.title}`)
}
</script>

<template>
  <main class="container">
    <h1>Add Expense</h1>

    <form @submit.prevent="submitForm">
      <label>
        Title
        <input
          v-model="title"
          type="text"
          placeholder="e.g. Morning coffee"
          required
        />
      </label>

      <label>
        Expense Type
        <select v-model="type" required>
          <option disabled value="">Select type</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Amount
        <div class="money-field">
          <div class="currency-dropdown">
            <button
              type="button"
              class="currency-btn"
              @click.prevent="showCurrencyDropdown = !showCurrencyDropdown"
            >
              <span :class="['fi', `fi-${currencyMap[currency].code}`]"></span>
              <span class="currency-code">{{ currency }}</span>
              <svg 
                class="dropdown-arrow" 
                :class="{ 'rotated': showCurrencyDropdown }"
                width="12" height="12" viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5" stroke="#333" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
            </button>

            <ul v-show="showCurrencyDropdown" class="currency-list">
              <li
                v-for="(val, key) in currencyMap"
                :key="key"
                @click="selectCurrency(key)"
              >
                <span :class="['fi', `fi-${val.code}`]"></span>
                <span class="currency-code-item">{{ key }}</span>
              </li>
            </ul>
          </div>

          <input
            v-model="amount"
            type="number"
            inputmode="decimal"
            class="amount-input"
            placeholder="0.00"
            :step="currency === 'JPY' || currency === 'IDR' ? '1' : '0.01'"
            min="0"
            required
          />
        </div>
      </label>

      <label>
        Date
        <input
          type="date"
          v-model="date"
          required
        />
      </label>

      <label>
        Payment Method
        <select v-model="payment_type" required>
          <option disabled value="">Select type</option>
          <option>Cash</option>
          <option>Debit</option>
          <option>E-Wallet</option>
        </select>
      </label>

      <label>
        Description
        <textarea
          v-model="description"
          rows="3"
          placeholder="Optional notes"
        />
      </label>

      <button type="submit" class="submit-btn">Save Expense</button>
    </form>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Google+Sans:wght@400;500&display=swap');

.container {
  max-width: 440px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Roboto', system-ui, sans-serif;
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
}

h1 {
  font-family: 'Google Sans', sans-serif;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f1f1f;
  font-size: 1.75rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.0rem;
  font-weight: 500;
  color: #444746;
  font-weight: bold;
}

/* Standard Inputs */
input:not(.amount-input),
textarea,
select {
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 1px solid #747775;
  border-radius: 4px;
  background-color: transparent;
  transition: border 0.2s;
  font-family: inherit;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border: 2px solid #0b57d0;
  padding: calc(0.875rem - 1px) calc(1rem - 1px); /* Prevent layout shift */
}

/* --- Money Field Wrapper --- */
.money-field {
  display: flex;
  align-items: center;
  border: 1px solid #747775;
  border-radius: 4px;
  background-color: transparent;
  transition: border 0.2s;
  position: relative;
}

/* Simulate focus on the wrapper when child input is focused */
.money-field:focus-within {
  border: 2px solid #0b57d0;
}

/* The actual number input inside the wrapper */
.amount-input {
  border: none;
  background: transparent;
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  min-width: 0;
  outline: none;
}

/* Ensure inner input doesn't double-border on focus */
.amount-input:focus {
  border: none;
  outline: none;
  box-shadow: none;
  padding: 0.875rem 1rem;
}

/* --- Currency Dropdown --- */
.currency-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  border-right: 1px solid #e0e0e0;
}

.currency-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0 0.75rem;
  height: 3rem;
  color: #444746;
  font-weight: 500;
}

.currency-btn:hover {
  background-color: #f5f5f5;
}

.dropdown-arrow {
  transition: transform 0.5s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.currency-list {
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 50;
  margin: 0;
}

.currency-list li {
  list-style: none;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #1f1f1f;
}

.currency-list li:hover {
  background: #f0f4f9;
}

/* Flag Icons */
.fi {
  width: 1.5em;
  border-radius: 2px;
  box-shadow: 0 0 1px rgba(0,0,0,0.2);
}

@media (max-width: 480px) {
  .container {
    margin: 0;
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    padding: 1.5rem;
    box-shadow: none;
  }

  h1 {
    font-size: 1.5rem;
    margin-top: 1rem;
  }

  input, select, textarea, .currency-btn {
    font-size: 16px !important;
  }
}

/* --- Submit Button --- */
.submit-btn {
  margin-top: 1rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 100px; 
  background: #0b57d0;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  letter-spacing: 0.02em;
}

.submit-btn:hover {
  background-color: #0842a0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.submit-btn:active {
  background-color: #062e6f;
  box-shadow: none;
}
</style>
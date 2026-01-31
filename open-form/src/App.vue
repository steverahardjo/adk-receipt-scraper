<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const type = ref('')
const amount = ref<number | null>(null)
const date = ref('')
const description = ref('')

const submitForm = () => {
  alert(
    `Title: ${title.value}
Type: ${type.value}
Amount: ${amount.value}
Date: ${date.value}
Description: ${description.value}`
  )
}
</script>

<template>
  <main class="container">
    <h1>Add Expense</h1>

    <form @submit.prevent="submitForm">
      <!-- Title -->
      <label>
        Title
        <input
          v-model="title"
          type="text"
          placeholder="e.g. Morning coffee"
          required
        />
      </label>

      <!-- Expense Type -->
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

      <!-- Amount -->
      <label>
        Amount
        <div class="money-field">
          <span class="currency">USD</span>
          <input
            v-model="amount"
            type="number"
            inputmode="decimal"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>
      </label>

      <!-- Date -->
      <label>
        Date
        <input
          v-model="date"
          type="date"
          required
        />
      </label>

      <!-- Description -->
      <label>
        Description
        <textarea
          v-model="description"
          rows="3"
          placeholder="Optional notes"
        />
      </label>

      <button type="submit">Save Expense</button>
    </form>
  </main>
</template>

<style scoped>
.container {
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

input,
textarea,
select {
  margin-top: 0.25rem;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.money-field {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 0.25rem;
}

.currency {
  padding: 0 0.75rem;
  background: #f5f5f5;
  font-size: 0.9rem;
  white-space: nowrap;
}

.money-field input {
  border: none;
  flex: 1;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #42b883;
}

button {
  padding: 0.9rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: white;
}

button:active {
  opacity: 0.9;
}
</style>

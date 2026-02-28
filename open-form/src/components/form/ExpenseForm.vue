<script setup lang="ts">
import { watch } from 'vue'
import TitleInput from './TitleInput.vue'
import TypeSelector from './TypeSelector.vue'
import AmountInput from './AmountInput.vue'
import DateInput from './DateInput.vue'
import PaymentMethodSelector from './PaymentMethodSelector.vue'
import DescriptionInput from './DescriptionInput.vue'
import SubmitButton from './SubmitButton.vue'
import SuccessOverlay from '../ui/SuccessOverlay.vue'

interface ExpenseType {
  value: string
  label: string
  icon: string
}

interface Currency {
  code: string
  label: string
}

interface PaymentMethod {
  value: string
  label: string
  icon: string
}

interface FormState {
  title: string
  type: string
  amount: number | null
  currency: string
  date: Date | string
  payment_type: string
  description: string
}

interface FormErrors {
  title?: string
  type?: string
  amount?: string
  date?: string
  payment_type?: string
}

interface Props {
  form: FormState
  errors: FormErrors
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  expenseTypes: ExpenseType[]
  currencies: Record<string, Currency>
  paymentMethods: PaymentMethod[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:form': [form: FormState]
  'update:title': [title: string]
  'update:type': [type: string]
  'update:amount': [amount: number | null]
  'update:currency': [currency: string]
  'update:date': [date: string]
  'update:payment_type': [payment_type: string]
  'update:description': [description: string]
  'submit': []
}>()

const updateForm = (field: keyof FormState, value: any) => {
  emit('update:form', { ...props.form, [field]: value })
}

// Watch for form changes to sync with parent
watch(() => props.form, (newForm) => {
  emit('update:form', newForm)
}, { deep: true })
</script>

<template>
  <form class="form" @submit.prevent="emit('submit')">
    <TitleInput
      v-model="form.title"
      :error="errors.title"
      :is-loading="isLoading"
    />

    <TypeSelector
      v-model="form.type"
      :error="errors.type"
      :is-loading="isLoading"
      :types="expenseTypes"
    />

    <div class="form__row">
      <AmountInput
        v-model="form.amount"
        v-model:currency="form.currency"
        :error="errors.amount"
        :is-loading="isLoading"
        :currencies="currencies"
      />

      <DateInput
        v-model="form.date"
        :error="errors.date"
        :is-loading="isLoading"
      />
    </div>

    <PaymentMethodSelector
      v-model="form.payment_type"
      :error="errors.payment_type"
      :is-loading="isLoading"
      :methods="paymentMethods"
    />

    <DescriptionInput
      v-model="form.description"
      :is-loading="isLoading"
    />

    <SubmitButton
      :is-loading="isLoading"
      :is-submitting="isLoading"
      @submit="emit('submit')"
    />
  </form>

  <SuccessOverlay :visible="isSuccess" />
</template>

<style scoped>
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

@media (max-width: 640px) {
  .form__row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>

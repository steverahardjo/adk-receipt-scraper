<script setup lang="ts">
interface Props {
  isLoading: boolean
  isSubmitting: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <div class="form__actions">
    <md-filled-button
      class="submit-btn"
      :disabled="isLoading || isSubmitting"
      @click="emit('submit')"
    >
      <md-circular-progress v-if="isSubmitting" indeterminate density="-3"></md-circular-progress>
      <span v-else>Save Expense</span>
    </md-filled-button>
  </div>
</template>

<style scoped>
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

.dark-mode .submit-btn {
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0947a8 0%, #0b57d0 100%);
  box-shadow: 0 4px 12px rgba(11, 87, 208, 0.4);
  transform: translateY(-1px);
}

.dark-mode .submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4285f4 0%, #5c9aff 100%);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.5);
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
</style>

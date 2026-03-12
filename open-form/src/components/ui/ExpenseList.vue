<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Expense, ExpenseFilters } from '@/composables/useExpenses'
import LoadingSkeleton from './LoadingSkeleton.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import { haptic } from '@/utils/haptic'

interface Props {
  expenses: Expense[]
  isLoading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expenses: () => [],
  isLoading: false,
})

const emit = defineEmits<{
  delete: [id: string]
  edit: [expense: Expense]
}>()

// Virtual scrolling
const containerRef = ref<HTMLElement | null>(null)
const ITEM_HEIGHT = 88
const VISIBLE_COUNT = 10

const scrollTop = ref(0)
const containerHeight = ref(0)

const visibleStart = computed(() => Math.floor(scrollTop.value / ITEM_HEIGHT))
const visibleEnd = computed(() =>
  Math.min(visibleStart.value + VISIBLE_COUNT + 1, props.expenses.length)
)

const visibleExpenses = computed(() => {
  return props.expenses.slice(visibleStart.value, visibleEnd.value)
})

const totalHeight = computed(() => props.expenses.length * ITEM_HEIGHT)
const offsetY = computed(() => visibleStart.value * ITEM_HEIGHT)

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
  containerHeight.value = target.clientHeight
}

// Swipe gesture handling
const swipeStates = ref<Record<string, { startX: number; currentX: number; isSwiping: boolean }>>({})

const getSwipeState = (id: string) => {
  if (!swipeStates.value[id]) {
    swipeStates.value[id] = { startX: 0, currentX: 0, isSwiping: false }
  }
  return swipeStates.value[id]
}

const handleTouchStart = (id: string, event: TouchEvent) => {
  const state = getSwipeState(id)
  state.startX = event.touches[0].clientX
  state.currentX = state.startX
  state.isSwiping = true
}

const handleTouchMove = (id: string, event: TouchEvent) => {
  const state = getSwipeState(id)
  if (!state.isSwiping) return

  state.currentX = event.touches[0].clientX
  const diff = state.currentX - state.startX

  // Only allow swipe left (delete action)
  if (diff > 0) {
    state.currentX = state.startX
  }
}

const handleTouchEnd = (id: string, event: TouchEvent) => {
  const state = getSwipeState(id)
  const diff = state.currentX - state.startX
  const threshold = -80

  if (diff < threshold) {
    // Swipe detected - show delete options
    haptic.warning()
  }

  state.isSwiping = false
  state.currentX = 0
}

const getSwipeStyle = (id: string) => {
  const state = getSwipeState(id)
  if (!state.isSwiping) return {}

  const diff = state.currentX - state.startX
  return {
    transform: `translateX(${Math.max(diff, -80)}px)`,
    transition: state.isSwiping ? 'none' : 'transform 0.2s ease',
  }
}

// Delete confirmation
const deleteDialogVisible = ref(false)
const expenseToDelete = ref<string | null>(null)

const confirmDelete = (id: string) => {
  expenseToDelete.value = id
  deleteDialogVisible.value = true
  haptic.warning()
}

const handleDeleteConfirm = () => {
  if (expenseToDelete.value) {
    emit('delete', expenseToDelete.value)
    haptic.success()
  }
}

const handleDeleteCancel = () => {
  expenseToDelete.value = null
}

// Format helpers
const formatCurrency = (amount: number, currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    IDR: 'Rp',
    SGD: 'S$',
    MYR: 'RM',
    JPY: '¥',
  }
  const symbol = symbols[currency] || currency
  return `${symbol}${amount.toLocaleString()}`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '📄',
    Entertainment: '🎬',
    Health: '💊',
    Other: '📦',
  }
  return icons[type] || '📦'
}

const getPaymentIcon = (type: string) => {
  const icons: Record<string, string> = {
    Cash: '💵',
    Debit: '💳',
    Credit: '💳',
    'E-Wallet': '📱',
    'Bank Transfer': '🏦',
  }
  return icons[type] || '💳'
}
</script>

<template>
  <div class="expense-list-container">
    <!-- Header -->
    <div class="expense-list__header">
      <h2 class="expense-list__title">Recent Expenses</h2>
      <span class="expense-list__count">{{ expenses.length }} items</span>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="expense-list__loading">
      <LoadingSkeleton variant="rounded" height="72px" border-radius="12px" />
      <LoadingSkeleton variant="rounded" height="72px" border-radius="12px" />
      <LoadingSkeleton variant="rounded" height="72px" border-radius="12px" />
    </div>

    <!-- Empty state -->
    <div v-else-if="expenses.length === 0" class="expense-list__empty">
      <div class="empty-state__icon">📝</div>
      <h3 class="empty-state__title">No expenses yet</h3>
      <p class="empty-state__text">Start tracking your spending by adding your first expense.</p>
    </div>

    <!-- Virtual scroll list -->
    <div
      v-else
      ref="containerRef"
      class="expense-list__scroll-container"
      @scroll="handleScroll"
      role="list"
      aria-label="Expense list"
    >
      <div class="expense-list__content" :style="{ height: `${totalHeight}px` }">
        <div
          v-for="expense in visibleExpenses"
          :key="expense.id"
          class="expense-item"
          :style="{ transform: `translateY(${offsetY}px)` }"
          role="listitem"
          :aria-label="`${expense.title}, ${formatCurrency(expense.amount, expense.currency)}`"
          @touchstart="handleTouchStart(expense.id, $event)"
          @touchmove="handleTouchMove(expense.id, $event)"
          @touchend="handleTouchEnd(expense.id, $event)"
        >
          <!-- Swipe action background -->
          <div class="expense-item__swipe-actions">
            <button
              class="swipe-action swipe-action--delete"
              @click="confirmDelete(expense.id)"
              :aria-label="'Delete ' + expense.title"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>

          <!-- Expense content -->
          <div class="expense-item__content" :style="getSwipeStyle(expense.id)">
            <div class="expense-item__icon" :aria-hidden="true">
              {{ getTypeIcon(expense.type) }}
            </div>

            <div class="expense-item__details">
              <h3 class="expense-item__title">{{ expense.title }}</h3>
              <div class="expense-item__meta">
                <span class="expense-item__date">{{ formatDate(expense.date) }}</span>
                <span class="expense-item__separator">•</span>
                <span class="expense-item__payment">
                  {{ getPaymentIcon(expense.payment_type) }} {{ expense.payment_type }}
                </span>
              </div>
            </div>

            <div class="expense-item__amount">
              {{ formatCurrency(expense.amount, expense.currency) }}
            </div>

            <button
              class="expense-item__more"
              @click="confirmDelete(expense.id)"
              aria-label="More options"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation dialog -->
    <ConfirmationDialog
      v-model:visible="deleteDialogVisible"
      title="Delete Expense"
      message="Are you sure you want to delete this expense? This action cannot be undone."
      confirm-label="Delete"
      cancel-label="Cancel"
      type="danger"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<style scoped>
.expense-list-container {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.expense-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}

.expense-list__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary, #1f1f1f);
  margin: 0;
}

.expense-list__count {
  font-size: 0.875rem;
  color: var(--text-secondary, #5f6368);
  font-weight: 500;
}

.expense-list__loading {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.expense-list__empty {
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary, #1f1f1f);
  margin: 0 0 0.5rem;
}

.empty-state__text {
  font-size: 0.9375rem;
  color: var(--text-secondary, #5f6368);
  margin: 0;
}

.expense-list__scroll-container {
  max-height: 440px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.expense-list__content {
  position: relative;
}

.expense-item {
  position: absolute;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color, #f5f5f5);
  overflow: hidden;
}

.expense-item:last-child {
  border-bottom: none;
}

.expense-item__swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  background: linear-gradient(90deg, transparent, #dc2626);
}

.swipe-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.swipe-action:hover {
  transform: scale(1.1);
}

.expense-item__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  background: var(--card-bg, #ffffff);
  width: 100%;
  z-index: 1;
  transition: transform 0.2s ease;
}

.expense-item__content:hover {
  background: var(--item-hover-bg, #fafafa);
}

.expense-item__icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.expense-item__details {
  flex: 1;
  min-width: 0;
}

.expense-item__title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary, #1f1f1f);
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expense-item__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary, #5f6368);
}

.expense-item__separator {
  opacity: 0.5;
}

.expense-item__amount {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1f1f1f);
  white-space: nowrap;
}

.expense-item__more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-secondary, #5f6368);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.expense-item__more:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary, #1f1f1f);
}

/* Scrollbar styling */
.expense-list__scroll-container::-webkit-scrollbar {
  width: 6px;
}

.expense-list__scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.expense-list__scroll-container::-webkit-scrollbar-thumb {
  background: var(--text-secondary, #c0c0c0);
  border-radius: 3px;
  opacity: 0.5;
}
</style>

import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'expense_draft'

export interface DraftState {
  title: string
  type: string
  amount: number | null
  currency: string
  date: string
  payment_type: string
  description: string
}

export function useDraft() {
  const hasDraft = ref(false)
  const draft = ref<DraftState | null>(null)

  const loadDraft = (): DraftState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        hasDraft.value = true
        draft.value = data
        return data
      }
    } catch {
      // Ignore parse errors
    }
    return null
  }

  const saveDraft = (data: DraftState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    hasDraft.value = true
    draft.value = data
  }

  const clearDraft = (): void => {
    localStorage.removeItem(STORAGE_KEY)
    hasDraft.value = false
    draft.value = null
  }

  // Auto-save draft on changes (debounced)
  const setupAutoSave = (form: DraftState & { date: string | Date }): void => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    
    watch(
      () => ({ ...form }),
      (newForm) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
          saveDraft({
            ...newForm,
            date: (newForm.date as any instanceof Date) ? (newForm.date as Date).toISOString().slice(0, 10) : String(newForm.date),
          })
        }, 500)
      },
      { deep: true }
    )
  }

  onMounted(() => {
    loadDraft()
  })

  return {
    draft,
    hasDraft,
    loadDraft,
    saveDraft,
    clearDraft,
    setupAutoSave,
  }
}

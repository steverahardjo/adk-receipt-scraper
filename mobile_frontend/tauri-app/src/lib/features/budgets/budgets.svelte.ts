import { readValue, writeValue } from '$lib/features/core/storage'

export interface BudgetCategory {
  id: string
  name: string
  groupId: string
  emoji: string
  limit: number
}

export interface BudgetGroup {
  id: string
  name: string
}

const KEY = 'budgets'

// Category names intentionally match `Entry.type` so spend can be derived live
// from the records store. Limits are monthly, in IDR.
const defaultGroups: BudgetGroup[] = [
  { id: 'g-essentials', name: 'Essentials' },
  { id: 'g-lifestyle', name: 'Lifestyle' },
  { id: 'g-other', name: 'Other' },
]

// Limits scaled to the mock ledger so bars land in a believable range
// (most under, one likely over). Replace with real figures on API wiring.
const defaultCategories: BudgetCategory[] = [
  { id: 'b-bills', name: 'Bills', groupId: 'g-essentials', emoji: '🧾', limit: 9000000 },
  { id: 'b-transport', name: 'Transport', groupId: 'g-essentials', emoji: '🚌', limit: 2500000 },
  { id: 'b-food', name: 'Food', groupId: 'g-lifestyle', emoji: '🍜', limit: 1500000 },
  { id: 'b-shopping', name: 'Shopping', groupId: 'g-lifestyle', emoji: '🛍️', limit: 6000000 },
  { id: 'b-other', name: 'Other', groupId: 'g-other', emoji: '✨', limit: 1200000 },
]

function createBudgets() {
  let groups = $state<BudgetGroup[]>(structuredClone(defaultGroups))
  let items = $state<BudgetCategory[]>(structuredClone(defaultCategories))
  let ready = $state(false)

  async function init() {
    const stored = await readValue<{ groups: BudgetGroup[]; categories: BudgetCategory[] }>(KEY)
    if (stored?.categories?.length) {
      items = stored.categories
      groups = stored.groups?.length ? stored.groups : structuredClone(defaultGroups)
    }
    ready = true
  }

  async function persist() {
    await writeValue(KEY, { groups, categories: items })
  }

  async function setLimit(id: string, limit: number) {
    const next = Math.max(0, Math.round(limit))
    items = items.map((c) => (c.id === id ? { ...c, limit: next } : c))
    await persist()
  }

  function byGroup(groupId: string) {
    return items.filter((c) => c.groupId === groupId)
  }

  return {
    get groups() { return groups },
    get categories() { return items },
    get ready() { return ready },
    get totalLimit() { return items.reduce((s, c) => s + c.limit, 0) },
    init,
    setLimit,
    byGroup,
  }
}

export const budgets = createBudgets()

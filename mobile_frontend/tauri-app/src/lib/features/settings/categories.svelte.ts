import { readValue, writeValue } from '$lib/features/core/storage'
import { reassignCategory as reassignEntries } from '$lib/features/records/store.svelte'

export interface Category {
  id: string
  name: string
  flow: 'expense' | 'income'
  parentId: string | null
  icon: string
  color: string
  disabled: boolean
}

const KEY = 'categories'

export const CATEGORY_ICONS = [
  'food', 'transport', 'shopping', 'bill', 'health', 'travel',
  'education', 'entertainment', 'income', 'freelance', 'gift', 'other',
]

export const CATEGORY_COLORS = [
  '#346538', '#1F6C9F', '#956400', '#9F2F2D',
  '#6C5CE7', '#009E73', '#E69F00', '#CC79A7',
]

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `cat-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const defaults: Category[] = [
  { id: 'c-food', name: 'Food', flow: 'expense', parentId: null, icon: 'food', color: '#346538', disabled: false },
  { id: 'c-transport', name: 'Transport', flow: 'expense', parentId: null, icon: 'transport', color: '#1F6C9F', disabled: false },
  { id: 'c-shopping', name: 'Shopping', flow: 'expense', parentId: null, icon: 'shopping', color: '#956400', disabled: false },
  { id: 'c-bills', name: 'Bills', flow: 'expense', parentId: null, icon: 'bill', color: '#9F2F2D', disabled: false },
  { id: 'c-other', name: 'Other', flow: 'expense', parentId: null, icon: 'other', color: '#787774', disabled: false },
  { id: 'c-salary', name: 'Salary', flow: 'income', parentId: null, icon: 'income', color: '#346538', disabled: false },
  { id: 'c-freelance', name: 'Freelance', flow: 'income', parentId: null, icon: 'freelance', color: '#009E73', disabled: false },
  { id: 'c-gift', name: 'Gift', flow: 'income', parentId: null, icon: 'gift', color: '#CC79A7', disabled: false },
  { id: 'c-other-income', name: 'Other', flow: 'income', parentId: null, icon: 'other', color: '#787774', disabled: false },
]

function createCategories() {
  let items = $state<Category[]>(structuredClone(defaults))
  let ready = $state(false)

  async function init() {
    const stored = await readValue<Category[]>(KEY)
    if (stored?.length) items = stored
    ready = true
  }

  async function persist() {
    await writeValue(KEY, items)
  }

  function byId(id: string | null) {
    return id ? items.find((c) => c.id === id) ?? null : null
  }

  function list(flow: 'expense' | 'income') {
    return items.filter((c) => c.flow === flow)
  }

  function parents(flow: 'expense' | 'income') {
    return items.filter((c) => c.flow === flow && c.parentId === null)
  }

  async function add(input: { name: string; flow: 'expense' | 'income'; parentId: string | null; icon: string; color: string }) {
    items = [...items, { id: uid(), disabled: false, ...input }]
    await persist()
  }

  async function update(id: string, patch: Partial<Omit<Category, 'id'>>) {
    items = items.map((c) => (c.id === id ? { ...c, ...patch } : c))
    await persist()
  }

  async function toggleDisabled(id: string) {
    items = items.map((c) => (c.id === id ? { ...c, disabled: !c.disabled } : c))
    await persist()
  }

  async function remove(id: string, reassignToId?: string) {
    const target = byId(id)
    if (!target) return
    if (reassignToId) {
      const replacement = byId(reassignToId)
      if (replacement) reassignEntries(target.name, replacement.name)
    }
    items = items.filter((c) => c.id !== id && c.parentId !== id)
    await persist()
  }

  return {
    get value() { return items },
    get ready() { return ready },
    init,
    byId,
    list,
    parents,
    add,
    update,
    toggleDisabled,
    remove,
  }
}

export const categories = createCategories()

// ExpenseTracker.jsx — React + shadcn-style + Zustand + TanStack Query + Framer Motion
// Dependencies (CDN / inline simulation):
//   framer-motion, zustand, @tanstack/react-query, react-hot-toast, lucide-react

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import {
  Plus,
  List,
  Trash2,
  Pencil,
  DollarSign,
  Search,
  X,
  ChevronDown,
  Wallet,
  Tag,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react'

// ─── Haptic Utility ──────────────────────────────────────────────────────────
const haptic = {
  light: () => {
    try {
      navigator.vibrate?.(30)
    } catch {}
  },
  medium: () => {
    try {
      navigator.vibrate?.(60)
    } catch {}
  },
  success: () => {
    try {
      navigator.vibrate?.([40, 30, 80])
    } catch {}
  },
  error: () => {
    try {
      navigator.vibrate?.([80, 40, 80])
    } catch {}
  },
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EXPENSE_TYPES = [
  { value: 'Food', label: 'Food & Dining', icon: '🍔' },
  { value: 'Transport', label: 'Transport', icon: '🚗' },
  { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'Bills', label: 'Bills & Utilities', icon: '📄' },
  { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'Health', label: 'Health', icon: '💊' },
  { value: 'Other', label: 'Other', icon: '📦' },
]

const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash', icon: '💵' },
  { value: 'Debit', label: 'Debit Card', icon: '💳' },
  { value: 'Credit', label: 'Credit Card', icon: '💳' },
  { value: 'E-Wallet', label: 'E-Wallet', icon: '📱' },
  { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar', flag: '🇺🇸' },
  { value: 'IDR', label: 'IDR — Indonesian Rupiah', flag: '🇮🇩' },
  { value: 'SGD', label: 'SGD — Singapore Dollar', flag: '🇸🇬' },
  { value: 'MYR', label: 'MYR — Malaysian Ringgit', flag: '🇲🇾' },
  { value: 'JPY', label: 'JPY — Japanese Yen', flag: '🇯🇵' },
]

const CURRENCY_SYMBOLS = { USD: '$', IDR: 'Rp', SGD: 'S$', MYR: 'RM', JPY: '¥' }

const DEFAULT_FORM = {
  title: '',
  type: 'Food',
  amount: '',
  currency: 'USD',
  date: new Date().toISOString().slice(0, 10),
  payment_type: 'Cash',
  description: '',
}

// ─── Zustand Store ────────────────────────────────────────────────────────────
const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      draft: null,
      addExpense: (expense) =>
        set((s) => ({ expenses: [expense, ...s.expenses] })),
      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
      updateExpense: (id, data) =>
        set((s) => ({
          expenses: s.expenses.map((e) =>
            e.id === id ? { ...e, ...data } : e,
          ),
        })),
      saveDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    { name: 'expense-tracker-v2' },
  ),
)

// ─── TanStack Query "service" (local mutation wrapped) ───────────────────────
const queryClient = new QueryClient()

function useExpenseMutation() {
  const addExpense = useExpenseStore((s) => s.addExpense)
  const clearDraft = useExpenseStore((s) => s.clearDraft)
  return useMutation({
    mutationFn: async (payload) => {
      await new Promise((r) => setTimeout(r, 500)) // simulate async
      return {
        ...payload,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }
    },
    onSuccess: (data) => {
      addExpense(data)
      clearDraft()
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const springBounce = { type: 'spring', stiffness: 500, damping: 28, mass: 0.8 }
const springGentle = { type: 'spring', stiffness: 300, damping: 25 }

const fadeUp = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springGentle },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.15 } },
}

const listItem = {
  hidden: { opacity: 0, x: -20, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { ...springBounce, delay: i * 0.04 },
  }),
  exit: { opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.18 } },
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function AnimatedNumber({ value }) {
  const spring = useSpring(value, { stiffness: 200, damping: 20 })
  const display = useTransform(spring, (v) => v.toFixed(2))
  useEffect(() => {
    spring.set(value)
  }, [value])
  return <motion.span>{display}</motion.span>
}

function Badge({ children, color = 'slate' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    violet: 'bg-violet-100 text-violet-700',
    slate: 'bg-slate-100 text-slate-600',
    cyan: 'bg-cyan-100 text-cyan-700',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color] || colors.slate}`}
    >
      {children}
    </span>
  )
}

const TYPE_COLORS = {
  Food: 'amber',
  Transport: 'blue',
  Shopping: 'violet',
  Bills: 'rose',
  Entertainment: 'cyan',
  Health: 'green',
  Other: 'slate',
}

function SelectField({ label, icon: Icon, value, onChange, options, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={13} />} {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-white border rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-800
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all
            ${error ? 'border-rose-400 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.icon
                ? `${o.icon}  ${o.label}`
                : o.flag
                  ? `${o.flag}  ${o.label}`
                  : o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

function InputField({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  step,
  min,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={13} />} {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-medium text-slate-800
          placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400
          focus:border-transparent transition-all
          ${error ? 'border-rose-400 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}
      />
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

function TextareaField({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={13} />} {label}
        <span className="text-slate-300 font-normal normal-case">
          (optional)
        </span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3
          text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none
          focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
      />
    </div>
  )
}

// ─── Expense Form ─────────────────────────────────────────────────────────────
function ExpenseForm({ editingExpense, onEditComplete }) {
  const [form, setForm] = useState(
    editingExpense ? { ...editingExpense } : { ...DEFAULT_FORM },
  )
  const [errors, setErrors] = useState({})
  const { saveDraft, draft, clearDraft } = useExpenseStore()
  const { mutateAsync, isPending } = useExpenseMutation()
  const updateExpense = useExpenseStore((s) => s.updateExpense)

  // Load draft on mount
  useEffect(() => {
    if (!editingExpense && draft) {
      setForm((f) => ({ ...f, ...draft }))
    }
  }, [])

  // Auto-save draft
  useEffect(() => {
    if (!editingExpense) {
      const t = setTimeout(() => saveDraft(form), 600)
      return () => clearTimeout(t)
    }
  }, [form])

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Date is required'
    return e
  }

  const handleSubmit = async () => {
    haptic.medium()
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      haptic.error()
      toast.error('Please fix the errors below')
      return
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      amount: Number(form.amount),
      currency: form.currency,
      date: form.date,
      payment_type: form.payment_type,
      description: form.description.trim() || undefined,
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, payload)
      toast.success('Expense updated!')
      haptic.success()
      onEditComplete?.()
    } else {
      try {
        await mutateAsync(payload)
        toast.success('Expense saved!', { icon: '✅' })
        haptic.success()
        setForm({ ...DEFAULT_FORM })
        clearDraft()
      } catch {
        toast.error('Failed to save expense')
        haptic.error()
      }
    }
  }

  const hasDraft =
    !editingExpense && draft && Object.values(draft).some(Boolean)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-4"
    >
      {/* Draft pill */}
      <AnimatePresence>
        {hasDraft && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: springBounce }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-medium text-indigo-600"
          >
            <FileText size={13} />
            <span>Draft auto-saved</span>
            <button
              className="ml-auto hover:bg-indigo-100 rounded-lg p-1 transition-colors"
              onClick={() => {
                clearDraft()
                setForm({ ...DEFAULT_FORM })
                haptic.light()
              }}
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <InputField
          label="Title"
          icon={Tag}
          value={form.title}
          onChange={set('title')}
          placeholder="e.g. Morning coffee"
          error={errors.title}
        />

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Category"
            icon={Sparkles}
            value={form.type}
            onChange={set('type')}
            options={EXPENSE_TYPES}
          />
          <SelectField
            label="Payment"
            icon={CreditCard}
            value={form.payment_type}
            onChange={set('payment_type')}
            options={PAYMENT_METHODS}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Amount"
            icon={DollarSign}
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={set('amount')}
            placeholder="0.00"
            error={errors.amount}
          />
          <SelectField
            label="Currency"
            value={form.currency}
            onChange={set('currency')}
            options={CURRENCIES}
          />
        </div>

        <InputField
          label="Date"
          icon={Calendar}
          type="date"
          value={form.date}
          onChange={set('date')}
          error={errors.date}
        />

        <TextareaField
          label="Notes"
          icon={FileText}
          value={form.description}
          onChange={set('description')}
          placeholder="Any additional notes..."
        />
      </div>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        disabled={isPending}
        whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
        whileHover={{ scale: 1.02, transition: springBounce }}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500
          text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300
          transition-shadow disabled:opacity-60 disabled:cursor-not-allowed select-none text-sm"
      >
        {isPending ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <>
            {editingExpense ? <CheckCircle2 size={17} /> : <Plus size={17} />}
            {editingExpense ? 'Update Expense' : 'Save Expense'}
          </>
        )}
      </motion.button>

      {editingExpense && (
        <motion.button
          onClick={() => {
            onEditComplete?.()
            haptic.light()
          }}
          whileTap={{ scale: 0.97 }}
          className="w-full text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors"
        >
          Cancel editing
        </motion.button>
      )}
    </motion.div>
  )
}

// ─── Expense List ─────────────────────────────────────────────────────────────
function ExpenseList({ onEdit }) {
  const expenses = useExpenseStore((s) => s.expenses)
  const deleteExpense = useExpenseStore((s) => s.deleteExpense)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        !search || e.title.toLowerCase().includes(search.toLowerCase())
      const matchType = !typeFilter || e.type === typeFilter
      return matchSearch && matchType
    })
  }, [expenses, search, typeFilter])

  // total in USD (rough, no conversion — just sums same currency)
  const totalUSD = useMemo(
    () =>
      expenses
        .filter((e) => e.currency === 'USD')
        .reduce((s, e) => s + e.amount, 0),
    [expenses],
  )

  const handleDelete = (id) => {
    haptic.medium()
    deleteExpense(id)
    toast('Expense removed', { icon: '🗑️' })
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-4"
    >
      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { ...springBounce, delay: 0.05 },
        }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-5 text-white shadow-xl shadow-indigo-200"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
          Total Spent (USD)
        </p>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold font-mono">
            $<AnimatedNumber value={totalUSD} />
          </span>
        </div>
        <p className="text-xs text-white/60 mt-2">
          {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
        </p>
        <Wallet
          size={40}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20"
        />
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 pr-7 text-sm
              font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          >
            <option value="">All</option>
            {EXPENSE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.icon} {t.value}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-12 text-slate-400"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl"
          >
            💸
          </motion.div>
          <p className="text-sm font-medium">No expenses yet</p>
          <p className="text-xs text-slate-300">
            Add your first expense to get started
          </p>
        </motion.div>
      ) : (
        <motion.ul className="flex flex-col gap-2" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((expense, i) => {
              const typeInfo = EXPENSE_TYPES.find(
                (t) => t.value === expense.type,
              )
              const sym = CURRENCY_SYMBOLS[expense.currency] || expense.currency
              return (
                <motion.li
                  key={expense.id}
                  custom={i}
                  variants={listItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3.5 shadow-sm
                    hover:border-slate-200 hover:shadow-md transition-all group"
                >
                  {/* Icon bubble */}
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      rotate: 10,
                      transition: springBounce,
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl flex-shrink-0"
                  >
                    {typeInfo?.icon}
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {expense.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge color={TYPE_COLORS[expense.type]}>
                        {expense.type}
                      </Badge>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">
                        {expense.date}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-800">
                      {sym}
                      {expense.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {expense.payment_type}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <motion.button
                      whileTap={{ scale: 0.85, transition: springBounce }}
                      onClick={() => {
                        haptic.light()
                        onEdit(expense)
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <Pencil size={14} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85, transition: springBounce }}
                      onClick={() => handleDelete(expense.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      )}
    </motion.div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useState('form')
  const [editingExpense, setEditingExpense] = useState(null)
  const expenses = useExpenseStore((s) => s.expenses)

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setTab('form')
  }

  const handleEditComplete = () => {
    setEditingExpense(null)
    setTab('list')
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
      `}</style>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '14px',
            background: '#1e1b4b',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            padding: '10px 16px',
            boxShadow: '0 8px 32px rgba(79,70,229,0.25)',
          },
          success: { iconTheme: { primary: '#a5f3a8', secondary: '#1e1b4b' } },
        }}
      />

      <div className="max-w-md mx-auto px-4 py-6 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0, transition: springGentle }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <motion.div
              animate={{ rotate: [0, 10, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl"
            >
              💰
            </motion.div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Expense Tracker
            </h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">
            Track your spending, one tap at a time.
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.nav
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { ...springBounce, delay: 0.08 },
          }}
          className="flex gap-1.5 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm mb-5"
        >
          {[
            {
              key: 'form',
              icon: Plus,
              label: editingExpense ? 'Edit' : 'Add Expense',
            },
            {
              key: 'list',
              icon: List,
              label: 'History',
              count: expenses.length,
            },
          ].map(({ key, icon: Icon, label, count }) => (
            <motion.button
              key={key}
              onClick={() => {
                setTab(key)
                if (key === 'form' && tab === 'form') {
                }
                haptic.light()
              }}
              whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                transition-all select-none ${
                  tab === key
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Icon size={16} />
              {label}
              {count != null && (
                <motion.span
                  key={count}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1, transition: springBounce }}
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    tab === key
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </motion.span>
              )}
            </motion.button>
          ))}
        </motion.nav>

        {/* Panel content */}
        <AnimatePresence mode="wait">
          {tab === 'form' ? (
            <motion.div
              key="form"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ExpenseForm
                key={editingExpense?.id || 'new'}
                editingExpense={editingExpense}
                onEditComplete={handleEditComplete}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ExpenseList onEdit={handleEdit} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

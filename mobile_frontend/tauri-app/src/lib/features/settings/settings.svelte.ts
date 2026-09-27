import { readValue, writeValue } from '$lib/features/core/storage'

export interface NotificationPrefs {
  receiptProcessed: boolean
  largeTransaction: boolean
  failedSync: boolean
  budgetNearing: boolean
  budgetExceeded: boolean
  upcomingBill: boolean
  overdueBill: boolean
  portfolioSync: boolean
  priceMovement: boolean
}

export interface AppSettings {
  currency: string
  country: string
  numberFormat: string
  dateFormat: string
  firstDayOfWeek: string
  financialYearStart: string
  density: 'comfortable' | 'compact'
  chartAnimations: boolean
  defaultExpenseAccount: string
  defaultIncomeAccount: string
  defaultCategory: string
  defaultType: 'expense' | 'income'
  defaultCurrency: string
  dailyBudget: number
  notifications: NotificationPrefs
  dataCollection: boolean
  analytics: boolean
  twoFactor: boolean
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  lastBackup: string
}

const KEY = 'app-settings'

export const CURRENCY_OPTIONS = ['MYR', 'IDR', 'USD', 'EUR', 'SGD']
export const COUNTRY_OPTIONS = ['Malaysia', 'Indonesia', 'Singapore', 'United States', 'United Kingdom']
export const NUMBER_FORMAT_OPTIONS = ['1,234.56', '1.234,56', '1 234,56']
export const DATE_FORMAT_OPTIONS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
export const WEEK_START_OPTIONS = ['Monday', 'Sunday']
export const MONTH_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
export const ACCOUNT_OPTIONS = ['BCA', 'Mandiri', 'Cash', 'GoPay', 'DANA']

const defaults: AppSettings = {
  currency: 'IDR',
  country: 'Indonesia',
  numberFormat: '1.234,56',
  dateFormat: 'DD/MM/YYYY',
  firstDayOfWeek: 'Monday',
  financialYearStart: 'January',
  density: 'comfortable',
  chartAnimations: true,
  defaultExpenseAccount: 'Cash',
  defaultIncomeAccount: 'BCA',
  defaultCategory: 'Food',
  defaultType: 'expense',
  defaultCurrency: 'IDR',
  dailyBudget: 350000,
  notifications: {
    receiptProcessed: true,
    largeTransaction: true,
    failedSync: true,
    budgetNearing: true,
    budgetExceeded: true,
    upcomingBill: true,
    overdueBill: true,
    portfolioSync: false,
    priceMovement: false,
  },
  dataCollection: false,
  analytics: false,
  twoFactor: false,
  autoBackup: false,
  backupFrequency: 'weekly',
  lastBackup: '',
}

function createSettings() {
  let settings = $state<AppSettings>(structuredClone(defaults))
  let ready = $state(false)

  function applyAppearance() {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('density-compact', settings.density === 'compact')
    root.classList.toggle('no-chart-anim', !settings.chartAnimations)
  }

  async function init() {
    const stored = await readValue<Partial<AppSettings>>(KEY)
    if (stored) {
      settings = {
        ...defaults,
        ...stored,
        notifications: { ...defaults.notifications, ...(stored.notifications ?? {}) },
      }
    }
    applyAppearance()
    ready = true
  }

  async function update(patch: Partial<AppSettings>) {
    settings = { ...settings, ...patch }
    applyAppearance()
    await writeValue(KEY, settings)
  }

  async function setNotification(key: keyof NotificationPrefs, value: boolean) {
    settings = { ...settings, notifications: { ...settings.notifications, [key]: value } }
    await writeValue(KEY, settings)
  }

  return {
    get value() { return settings },
    get ready() { return ready },
    init,
    update,
    setNotification,
  }
}

export const settings = createSettings()

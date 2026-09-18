import { readValue, writeValue } from '$lib/features/core/storage'
import { getEntries, importEntries } from '$lib/features/records/store.svelte'
import type { Entry } from '$lib/features/records/types'
import { profile } from '$lib/features/profile/profile.svelte'
import { settings } from './settings.svelte'
import { categories } from './categories.svelte'

const BACKUP_KEY = 'backup'

export interface Backup {
  version: number
  createdAt: string
  profile: unknown
  settings: unknown
  categories: unknown[]
  entries: Entry[]
}

export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? '' : String(value)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const lines = [headers.join(',')]
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(','))
  return lines.join('\n')
}

export function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field); field = ''
    } else if (char === '\n') {
      row.push(field); rows.push(row); row = []; field = ''
    } else if (char !== '\r') {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

export function entriesToRows(entries: Entry[]) {
  return entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString().slice(0, 10),
    title: e.title,
    amount: e.amount,
    currency: e.currency,
    flow: e.flow,
    type: e.type ?? '',
    paymentMethod: e.paymentMethod ?? '',
    source: e.source ?? '',
    description: e.description ?? '',
  }))
}

export function importEntriesFromCSV(text: string): number {
  const rows = parseCSV(text)
  if (rows.length < 2) return 0
  const header = rows[0].map((h) => h.trim().toLowerCase())
  const index = (name: string) => header.indexOf(name)
  const pick = (row: string[], name: string) => {
    const i = index(name)
    return i >= 0 ? (row[i] ?? '').trim() : ''
  }

  const incoming: Entry[] = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    const title = pick(row, 'title') || pick(row, 'description') || pick(row, 'merchant')
    const amount = Number(pick(row, 'amount').replace(/[^0-9.-]/g, ''))
    if (!title || !Number.isFinite(amount) || amount === 0) continue
    const flow = pick(row, 'flow').toLowerCase() === 'income' ? 'income' : 'expense'
    const dateText = pick(row, 'date')
    const parsed = dateText ? new Date(dateText) : new Date()
    incoming.push({
      id: globalThis.crypto?.randomUUID?.() ?? `imp-${Date.now()}-${r}`,
      title,
      amount: Math.abs(amount),
      currency: (pick(row, 'currency').toUpperCase() as Entry['currency']) || 'IDR',
      date: Number.isNaN(parsed.getTime()) ? new Date() : parsed,
      flow,
      type: (pick(row, 'type') as Entry['type']) || undefined,
      paymentMethod: (pick(row, 'paymentmethod') as Entry['paymentMethod']) || undefined,
      source: (pick(row, 'source') as Entry['source']) || undefined,
      description: pick(row, 'description') || undefined,
    })
  }
  if (incoming.length > 0) importEntries(incoming)
  return incoming.length
}

export function allData() {
  return {
    profile: profile.value,
    settings: settings.value,
    categories: categories.value,
    entries: entriesToRows(getEntries()),
  }
}

export async function backupNow(): Promise<Backup> {
  const backup: Backup = {
    version: 1,
    createdAt: new Date().toISOString(),
    profile: profile.value,
    settings: settings.value,
    categories: categories.value,
    entries: getEntries(),
  }
  await writeValue(BACKUP_KEY, backup)
  await settings.update({ lastBackup: new Date().toLocaleString() })
  return backup
}

export function readBackup(): Promise<Backup | null> {
  return readValue<Backup>(BACKUP_KEY)
}

<script lang="ts">
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ToggleSwitch from '$lib/features/settings/ToggleSwitch.svelte'
  import ChoiceSheet from '$lib/features/settings/ChoiceSheet.svelte'
  import ConfirmSheet from '$lib/features/settings/ConfirmSheet.svelte'
  import { settings } from '$lib/features/settings/settings.svelte'
  import { categories } from '$lib/features/settings/categories.svelte'
  import { profile } from '$lib/features/profile/profile.svelte'
  import { getEntries, replaceEntries } from '$lib/features/records/store.svelte'
  import { download, toCSV, importEntriesFromCSV, allData, backupNow, readBackup } from '$lib/features/settings/data'
  import { entriesToRows } from '$lib/features/settings/data'
  import { showToast } from '$lib/features/core/toast.svelte'

  let csvInput = $state<HTMLInputElement | null>(null)
  let format = $state('CSV')
  let formatOpen = $state(false)
  let freqOpen = $state(false)
  let restoreConfirm = $state(false)

  const formats = ['CSV', 'JSON', 'XLSX']
  const frequencies = ['daily', 'weekly', 'monthly']

  const mockAccounts = [
    { name: 'BCA', balance: 5200000, currency: 'IDR' },
    { name: 'Mandiri', balance: 3100000, currency: 'IDR' },
    { name: 'Cash', balance: 1800000, currency: 'IDR' },
  ]
  const mockInvestments = [
    { symbol: 'BBCA', units: 100, value: 9500000 },
    { symbol: 'BBRI', units: 250, value: 12500000 },
  ]
  const mockBudgets = [
    { category: 'Food', limit: 2000000, spent: 1320000 },
    { category: 'Transport', limit: 1200000, spent: 875000 },
  ]

  async function onCSV(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    target.value = ''
    if (!file) return
    const text = await file.text()
    const count = importEntriesFromCSV(text)
    if (count > 0) showToast({ type: 'success', title: `Imported ${count} transactions`, duration: 2500 })
    else showToast({ type: 'error', title: 'No importable rows found', message: 'Expected columns like date, title, amount', duration: 3000 })
  }

  function exportKind(kind: string) {
    if (format === 'XLSX') {
      showToast({ type: 'error', title: 'XLSX export coming soon', message: 'Choose CSV or JSON for now', duration: 3000 })
      return
    }
    const stamp = new Date().toISOString().slice(0, 10)

    if (kind === 'all') {
      download(`deneb-all-${stamp}.json`, JSON.stringify(allData(), null, 2), 'application/json')
      showToast({ type: 'success', title: 'Exported all data', duration: 2000 })
      return
    }

    let rows: Record<string, unknown>[]
    if (kind === 'transactions') rows = entriesToRows(getEntries())
    else if (kind === 'categories') rows = categories.value.map((c) => ({ id: c.id, name: c.name, flow: c.flow, parent: c.parentId ?? '', icon: c.icon, color: c.color, disabled: c.disabled }))
    else if (kind === 'accounts') rows = mockAccounts
    else if (kind === 'investments') rows = mockInvestments
    else rows = mockBudgets

    if (format === 'JSON') {
      download(`deneb-${kind}-${stamp}.json`, JSON.stringify(rows, null, 2), 'application/json')
    } else {
      download(`deneb-${kind}-${stamp}.csv`, toCSV(rows), 'text/csv')
    }
    showToast({ type: 'success', title: `Exported ${kind}`, duration: 2000 })
  }

  async function doBackup() {
    await backupNow()
    showToast({ type: 'success', title: 'Backup created', duration: 2000 })
  }

  async function doRestore() {
    const backup = await readBackup()
    if (!backup) {
      showToast({ type: 'error', title: 'No backup found', duration: 2500 })
      return
    }
    replaceEntries(backup.entries as never)
    if (backup.profile) await profile.update(backup.profile as never)
    if (backup.settings) await settings.update(backup.settings as never)
    showToast({ type: 'success', title: 'Backup restored', duration: 2500 })
  }

  function unsupported(label: string) {
    showToast({ type: 'error', title: `${label} coming soon`, message: 'This needs the backend parser', duration: 3000 })
  }
</script>

<SettingsScaffold title="Data">
  <SettingsGroup title="Import">
    <SettingsRow label="Import CSV" desc="Map columns: date, title, amount, type" chevron onclick={() => csvInput?.click()} />
    <SettingsRow label="Import XLSX" chevron onclick={() => unsupported('XLSX import')} />
    <SettingsRow label="Import bank statement" chevron onclick={() => unsupported('Bank statement import')} />
    <SettingsRow label="Import transaction history" chevron onclick={() => unsupported('History import')} />
  </SettingsGroup>

  <SettingsGroup title="Export">
    <SettingsRow label="Format" value={format} chevron onclick={() => formatOpen = true} />
    <SettingsRow label="Export transactions" chevron onclick={() => exportKind('transactions')} />
    <SettingsRow label="Export accounts" chevron onclick={() => exportKind('accounts')} />
    <SettingsRow label="Export investments" chevron onclick={() => exportKind('investments')} />
    <SettingsRow label="Export budgets" chevron onclick={() => exportKind('budgets')} />
    <SettingsRow label="Export categories" chevron onclick={() => exportKind('categories')} />
    <SettingsRow label="Export all data" chevron onclick={() => exportKind('all')} />
  </SettingsGroup>

  <SettingsGroup title="Backup">
    <SettingsRow label="Automatic backup" desc="Back up your data on a schedule">
      <ToggleSwitch checked={settings.value.autoBackup} label="Automatic backup" onchange={(v) => settings.update({ autoBackup: v })} />
    </SettingsRow>
    <SettingsRow label="Backup frequency" value={settings.value.backupFrequency} chevron onclick={() => freqOpen = true} />
    <SettingsRow label="Last successful backup" value={settings.value.lastBackup || 'Never'} />
    <SettingsRow label="Backup now" chevron onclick={doBackup} />
    <SettingsRow label="Restore backup" chevron onclick={() => restoreConfirm = true} />
  </SettingsGroup>

  <input bind:this={csvInput} class="hidden" type="file" accept=".csv,text/csv" onchange={onCSV} />
</SettingsScaffold>

<ChoiceSheet opened={formatOpen} title="Export format" options={formats.map((f) => ({ value: f }))} value={format} onSelect={(v) => format = v} onClose={() => formatOpen = false} />
<ChoiceSheet opened={freqOpen} title="Backup frequency" options={frequencies.map((f) => ({ value: f }))} value={settings.value.backupFrequency} onSelect={(v) => settings.update({ backupFrequency: v as 'daily' | 'weekly' | 'monthly' })} onClose={() => freqOpen = false} />

<ConfirmSheet
  opened={restoreConfirm}
  title="Restore from backup?"
  message="This replaces your current transactions, profile and settings with the last backup."
  confirmLabel="Restore"
  onConfirm={doRestore}
  onClose={() => restoreConfirm = false}
/>

<style>
  .hidden { display: none; }
</style>

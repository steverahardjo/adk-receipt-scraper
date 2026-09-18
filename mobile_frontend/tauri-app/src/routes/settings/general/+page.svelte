<script lang="ts">
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ChoiceSheet from '$lib/features/settings/ChoiceSheet.svelte'
  import ToggleSwitch from '$lib/features/settings/ToggleSwitch.svelte'
  import {
    settings, CURRENCY_OPTIONS, COUNTRY_OPTIONS, NUMBER_FORMAT_OPTIONS,
    DATE_FORMAT_OPTIONS, WEEK_START_OPTIONS, MONTH_OPTIONS,
  } from '$lib/features/settings/settings.svelte'
  import type { AppSettings } from '$lib/features/settings/settings.svelte'
  import { theme } from '$lib/features/core/theme.svelte'
  import type { ThemeMode } from '$lib/features/core/theme.svelte'

  type Key = 'currency' | 'country' | 'numberFormat' | 'dateFormat' | 'firstDayOfWeek' | 'financialYearStart'

  const optionSets: Record<Key, { title: string; options: string[] }> = {
    currency: { title: 'Primary currency', options: CURRENCY_OPTIONS },
    country: { title: 'Country / region', options: COUNTRY_OPTIONS },
    numberFormat: { title: 'Number format', options: NUMBER_FORMAT_OPTIONS },
    dateFormat: { title: 'Date format', options: DATE_FORMAT_OPTIONS },
    firstDayOfWeek: { title: 'First day of week', options: WEEK_START_OPTIONS },
    financialYearStart: { title: 'Financial year starts', options: MONTH_OPTIONS },
  }

  let sheet = $state<{ key: Key; title: string; options: string[] } | null>(null)
  let themeOpen = $state(false)
  let densityOpen = $state(false)

  const themeOptions = [
    { value: 'system', label: 'System', desc: 'Match device setting' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ]
  const densityOptions = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
  ]

  function openSheet(key: Key) { sheet = { key, ...optionSets[key] } }
  function select(value: string) {
    if (sheet) settings.update({ [sheet.key]: value } as Partial<AppSettings>)
  }
  function cap(value: string) { return value.charAt(0).toUpperCase() + value.slice(1) }
</script>

<SettingsScaffold title="General">
  <SettingsGroup title="Currency & Region">
    <SettingsRow label="Primary currency" value={settings.value.currency} chevron onclick={() => openSheet('currency')} />
    <SettingsRow label="Country / region" value={settings.value.country} chevron onclick={() => openSheet('country')} />
    <SettingsRow label="Number format" value={settings.value.numberFormat} chevron onclick={() => openSheet('numberFormat')} />
    <SettingsRow label="Date format" value={settings.value.dateFormat} chevron onclick={() => openSheet('dateFormat')} />
    <SettingsRow label="First day of week" value={settings.value.firstDayOfWeek} chevron onclick={() => openSheet('firstDayOfWeek')} />
    <SettingsRow label="Financial year" value={settings.value.financialYearStart} chevron onclick={() => openSheet('financialYearStart')} />
  </SettingsGroup>

  <SettingsGroup title="Appearance">
    <SettingsRow label="Theme" value={cap(theme.mode)} chevron onclick={() => themeOpen = true} />
    <SettingsRow label="Display density" value={cap(settings.value.density)} chevron onclick={() => densityOpen = true} />
    <SettingsRow label="Chart animations" desc="Animate charts when they load">
      <ToggleSwitch checked={settings.value.chartAnimations} label="Chart animations" onchange={(v) => settings.update({ chartAnimations: v })} />
    </SettingsRow>
  </SettingsGroup>
</SettingsScaffold>

<ChoiceSheet
  opened={!!sheet}
  title={sheet?.title ?? ''}
  options={(sheet?.options ?? []).map((o) => ({ value: o }))}
  value={sheet ? (settings.value[sheet.key] as string) : ''}
  onSelect={select}
  onClose={() => sheet = null}
/>

<ChoiceSheet
  opened={themeOpen}
  title="Theme"
  options={themeOptions}
  value={theme.mode}
  onSelect={(v) => theme.setMode(v as ThemeMode)}
  onClose={() => themeOpen = false}
/>

<ChoiceSheet
  opened={densityOpen}
  title="Display density"
  options={densityOptions}
  value={settings.value.density}
  onSelect={(v) => settings.update({ density: v as 'comfortable' | 'compact' })}
  onClose={() => densityOpen = false}
/>

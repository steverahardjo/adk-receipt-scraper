<script lang="ts">
  import SettingsRow from '../SettingsRow.svelte'
  import ChoiceSheet from '../ChoiceSheet.svelte'

  let {
    label,
    value,
    options,
    onSelect,
  }: {
    label: string
    value: string | null
    options: { value: string; label: string }[]
    onSelect?: (value: string) => void
  } = $props()

  let open = $state(false)
  let current = $derived(options.find((o) => o.value === value)?.label ?? 'Select model')
</script>

<SettingsRow {label} value={current} chevron onclick={() => open = true} />

<ChoiceSheet
  opened={open}
  title={label}
  {options}
  value={value ?? ''}
  onSelect={(v) => onSelect?.(v)}
  onClose={() => open = false}
/>

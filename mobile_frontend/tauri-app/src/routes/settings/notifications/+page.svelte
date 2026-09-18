<script lang="ts">
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ToggleSwitch from '$lib/features/settings/ToggleSwitch.svelte'
  import { settings } from '$lib/features/settings/settings.svelte'
  import type { NotificationPrefs } from '$lib/features/settings/settings.svelte'

  const groups: { title: string; items: { key: keyof NotificationPrefs; label: string; desc: string }[] }[] = [
    {
      title: 'Transactions',
      items: [
        { key: 'receiptProcessed', label: 'Receipt processed', desc: 'When a scanned receipt is recognised' },
        { key: 'largeTransaction', label: 'Large transaction', desc: 'Unusually large amounts' },
        { key: 'failedSync', label: 'Failed synchronization', desc: 'When a connection fails to sync' },
      ],
    },
    {
      title: 'Budgets',
      items: [
        { key: 'budgetNearing', label: 'Budget nearing limit', desc: 'At 80% of a budget' },
        { key: 'budgetExceeded', label: 'Budget exceeded', desc: 'When a budget is passed' },
      ],
    },
    {
      title: 'Bills',
      items: [
        { key: 'upcomingBill', label: 'Upcoming bill', desc: 'A few days before a bill is due' },
        { key: 'overdueBill', label: 'Overdue bill', desc: 'When a bill is past due' },
      ],
    },
    {
      title: 'Investments',
      items: [
        { key: 'portfolioSync', label: 'Portfolio synchronization', desc: 'When holdings are updated' },
        { key: 'priceMovement', label: 'Significant price movement', desc: 'Large changes in holdings' },
      ],
    },
  ]
</script>

<SettingsScaffold title="Notifications">
  {#each groups as group}
    <SettingsGroup title={group.title}>
      {#each group.items as item}
        <SettingsRow label={item.label} desc={item.desc}>
          <ToggleSwitch
            checked={settings.value.notifications[item.key]}
            label={item.label}
            onchange={(v) => settings.setNotification(item.key, v)}
          />
        </SettingsRow>
      {/each}
    </SettingsGroup>
  {/each}
</SettingsScaffold>

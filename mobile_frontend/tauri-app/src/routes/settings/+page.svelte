<script lang="ts">
  import { goto } from '$app/navigation'
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'

  const sections = [
    { href: '/settings/general', label: 'General', desc: 'Currency, region, appearance' },
    { href: '/settings/financial', label: 'Financial', desc: 'Categories, default preferences' },
    { href: '/settings/connections', label: 'Connections', desc: 'Banks, investments, services' },
    { href: '/settings/notifications', label: 'Notifications', desc: 'Alerts and reminders' },
    { href: '/settings/security', label: 'Security', desc: 'Authentication, sessions, privacy' },
    { href: '/settings/data', label: 'Data', desc: 'Import, export, backup' },
    { href: '/settings/about', label: 'About', desc: 'Version, legal, support' },
  ]
</script>

<SettingsScaffold title="Settings">
  <SettingsGroup>
    {#each sections as section}
      <SettingsRow label={section.label} desc={section.desc} chevron onclick={() => goto(section.href)} />
    {/each}
  </SettingsGroup>
</SettingsScaffold>

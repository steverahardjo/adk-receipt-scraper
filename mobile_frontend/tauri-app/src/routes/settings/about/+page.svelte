<script lang="ts">
  import { goto } from '$app/navigation'
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ConfirmSheet from '$lib/features/settings/ConfirmSheet.svelte'
  import { clearAll } from '$lib/features/core/storage'
  import { lock } from '$lib/features/core/lock.svelte'
  import { showToast } from '$lib/features/core/toast.svelte'

  const VERSION = '0.1.0'

  // Placeholder destinations — replace with the real URLs before release.
  const LINKS = {
    terms: 'https://example.com/deneb/terms',
    privacy: 'https://example.com/deneb/privacy',
    support: 'mailto:support@example.com',
  }

  const licenses = [
    { name: 'Tauri', license: 'MIT / Apache-2.0' },
    { name: 'Svelte & SvelteKit', license: 'MIT' },
    { name: 'Framework7', license: 'MIT' },
    { name: 'Plotly.js', license: 'MIT' },
    { name: 'Geist & JetBrains Mono', license: 'SIL OFL 1.1' },
  ]

  let deleteConfirm = $state(false)

  async function openLink(url: string) {
    try {
      const { openUrl } = await import('@tauri-apps/plugin-opener')
      await openUrl(url)
      return
    } catch {
      /* not running under Tauri */
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function signOut() {
    showToast({ type: 'success', title: 'Signed out', duration: 2000 })
    goto('/verification')
  }

  async function deleteAccount() {
    await clearAll()
    await lock.disable()
    showToast({ type: 'success', title: 'Account deleted', duration: 2500 })
    goto('/verification')
  }
</script>

<SettingsScaffold title="About">
  <SettingsGroup title="Application">
    <SettingsRow label="Application version" value={VERSION} />
    <SettingsRow label="Terms of Service" chevron onclick={() => openLink(LINKS.terms)} />
    <SettingsRow label="Privacy Policy" chevron onclick={() => openLink(LINKS.privacy)} />
    <SettingsRow label="Contact / Support" chevron onclick={() => openLink(LINKS.support)} />
  </SettingsGroup>

  <SettingsGroup title="Open-source licenses">
    {#each licenses as item}
      <SettingsRow label={item.name} value={item.license} />
    {/each}
  </SettingsGroup>

  <SettingsGroup title="Account">
    <SettingsRow label="Sign out" onclick={signOut} />
    <SettingsRow label="Delete account" desc="Erases all local data on this device" danger onclick={() => deleteConfirm = true} />
  </SettingsGroup>
</SettingsScaffold>

<ConfirmSheet
  opened={deleteConfirm}
  title="Delete account?"
  message="This permanently erases your profile, transactions, settings and backups from this device. This cannot be undone."
  confirmLabel="Delete everything"
  onConfirm={deleteAccount}
  onClose={() => deleteConfirm = false}
/>

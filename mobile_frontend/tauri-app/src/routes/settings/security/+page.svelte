<script lang="ts">
  import { goto } from '$app/navigation'
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ToggleSwitch from '$lib/features/settings/ToggleSwitch.svelte'
  import ChoiceSheet from '$lib/features/settings/ChoiceSheet.svelte'
  import ConfirmSheet from '$lib/features/settings/ConfirmSheet.svelte'
  import PasswordChangeSheet from '$lib/features/settings/PasswordChangeSheet.svelte'
  import SecuritySheet from '$lib/features/core/SecuritySheet.svelte'
  import { settings } from '$lib/features/settings/settings.svelte'
  import { sessions } from '$lib/features/settings/sessions.svelte'
  import type { Session } from '$lib/features/settings/sessions.svelte'
  import { lock } from '$lib/features/core/lock.svelte'
  import { showToast } from '$lib/features/core/toast.svelte'

  let pwOpen = $state(false)
  let securityOpen = $state(false)
  let sessionTarget = $state<Session | null>(null)
  let confirmSignOut = $state(false)

  const sessionActions = [{ value: 'revoke', label: 'Revoke session', desc: 'Sign out this device' }]

  let pinValue = $derived(lock.enabled ? (lock.biometricEnabled ? 'PIN + biometrics' : 'PIN') : 'Off')

  async function runSessionAction(action: string) {
    if (action === 'revoke' && sessionTarget) {
      await sessions.revoke(sessionTarget.id)
      showToast({ type: 'success', title: 'Session revoked', duration: 2000 })
    }
  }

  async function signOutOthers() {
    await sessions.signOutOthers()
    showToast({ type: 'success', title: 'Signed out other devices', duration: 2000 })
  }
</script>

<SettingsScaffold title="Security">
  <SettingsGroup title="Authentication">
    <SettingsRow label="Change password" chevron onclick={() => pwOpen = true} />
    <SettingsRow label="Two-factor authentication" desc="Require a code in addition to your password">
      <ToggleSwitch checked={settings.value.twoFactor} label="Two-factor authentication" onchange={(v) => settings.update({ twoFactor: v })} />
    </SettingsRow>
    <SettingsRow label="App PIN & biometrics" value={pinValue} chevron onclick={() => securityOpen = true} />
  </SettingsGroup>

  <SettingsGroup title="Sessions">
    {#each sessions.value as session}
      <SettingsRow
        label={session.device}
        desc={`${session.location} · ${session.lastActive}`}
        value={session.current ? 'This device' : ''}
        chevron={!session.current}
        onclick={session.current ? undefined : () => sessionTarget = session}
      />
    {/each}
    {#if sessions.value.length > 1}
      <SettingsRow label="Sign out all other devices" danger onclick={() => confirmSignOut = true} />
    {/if}
  </SettingsGroup>

  <SettingsGroup title="Privacy">
    <SettingsRow label="Data collection" desc="Share anonymised usage to improve Deneb">
      <ToggleSwitch checked={settings.value.dataCollection} label="Data collection" onchange={(v) => settings.update({ dataCollection: v })} />
    </SettingsRow>
    <SettingsRow label="Analytics" desc="Allow product analytics">
      <ToggleSwitch checked={settings.value.analytics} label="Analytics" onchange={(v) => settings.update({ analytics: v })} />
    </SettingsRow>
    <SettingsRow label="Connected service permissions" chevron onclick={() => goto('/settings/connections')} />
  </SettingsGroup>
</SettingsScaffold>

<PasswordChangeSheet
  opened={pwOpen}
  onClose={() => pwOpen = false}
  onSaved={() => showToast({ type: 'success', title: 'Password updated', duration: 2000 })}
/>

<SecuritySheet opened={securityOpen} onClose={() => securityOpen = false} />

<ChoiceSheet
  opened={!!sessionTarget}
  title={sessionTarget?.device ?? ''}
  options={sessionActions}
  value=""
  onSelect={runSessionAction}
  onClose={() => sessionTarget = null}
/>

<ConfirmSheet
  opened={confirmSignOut}
  title="Sign out other devices?"
  message="All other sessions will be signed out immediately."
  confirmLabel="Sign out"
  onConfirm={signOutOthers}
  onClose={() => confirmSignOut = false}
/>

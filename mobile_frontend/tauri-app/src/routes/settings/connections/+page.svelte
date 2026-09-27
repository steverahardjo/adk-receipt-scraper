<script lang="ts">
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ChoiceSheet from '$lib/features/settings/ChoiceSheet.svelte'
  import { connections } from '$lib/features/settings/connections.svelte'
  import type { Connection, ConnectionKind } from '$lib/features/settings/connections.svelte'
  import { showToast } from '$lib/features/core/toast.svelte'

  const groups: { kind: ConnectionKind; label: string; addLabel: string }[] = [
    { kind: 'bank', label: 'Bank Accounts', addLabel: 'Connect a bank' },
    { kind: 'investment', label: 'Investment Accounts', addLabel: 'Connect a broker' },
    { kind: 'service', label: 'Other Services', addLabel: 'Connect a service' },
  ]

  let actionTarget = $state<Connection | null>(null)

  const actionOptions = [
    { value: 'sync', label: 'Synchronize now' },
    { value: 'disconnect', label: 'Disconnect', desc: 'Removes stored access for this connection' },
  ]

  function statusLabel(c: Connection) {
    if (c.status === 'syncing') return 'Syncing...'
    if (c.status === 'error') return 'Sync error'
    return 'Connected'
  }

  async function runAction(action: string) {
    const target = actionTarget
    if (!target) return
    if (action === 'sync') {
      await connections.sync(target.id)
      showToast({ type: 'success', title: `${target.name} synced`, duration: 2000 })
    } else if (action === 'disconnect') {
      await connections.disconnect(target.id)
      showToast({ type: 'success', title: `${target.name} disconnected`, duration: 2000 })
    }
  }

  async function addConnection(kind: ConnectionKind, name: string) {
    await connections.connect({ kind, name })
    showToast({ type: 'success', title: 'Connection added', duration: 2000 })
  }
</script>

<SettingsScaffold title="Connections">
  {#each groups as group}
    <SettingsGroup title={group.label}>
      {#each connections.list(group.kind) as conn}
        <SettingsRow label={conn.name} desc={`${statusLabel(conn)} · Last synced ${conn.lastSync}`} chevron onclick={() => actionTarget = conn}>
          <span class="status" class:ok={conn.status === 'connected'} class:err={conn.status === 'error'} class:busy={conn.status === 'syncing'}></span>
        </SettingsRow>
      {/each}
      <SettingsRow label={group.addLabel} onclick={() => addConnection(group.kind, group.addLabel.replace('Connect a ', '').replace(/^./, (m) => m.toUpperCase()))}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </SettingsRow>
    </SettingsGroup>
  {/each}

  <p class="note">Deneb never stores or displays your banking credentials, API keys, or access tokens. Connections are read-only and can be revoked at any time.</p>
</SettingsScaffold>

<ChoiceSheet
  opened={!!actionTarget}
  title={actionTarget?.name ?? ''}
  options={actionOptions}
  value=""
  onSelect={runAction}
  onClose={() => actionTarget = null}
/>

<style>
  .status { width: 8px; height: 8px; border-radius: 50%; background: var(--deneb-text-muted); flex-shrink: 0; }
  .status.ok { background: var(--deneb-positive); }
  .status.err { background: var(--deneb-negative); }
  .status.busy { background: var(--deneb-warning); }
  .note { margin: 0; padding: 0 4px; font-family: var(--deneb-sans); font-size: 12px; line-height: 1.5; color: var(--deneb-text-secondary); }
</style>

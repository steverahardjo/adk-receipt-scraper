<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'
  import NotificationFeed from '$lib/features/notifications/NotificationFeed.svelte'
  import ContextPicker from '$lib/features/core/ContextPicker.svelte'
  import { longpress } from '$lib/features/core/longpress'

  let contextOpen = $state(false), contextTitle = $state(''), contextMessage = $state('')
  function openContext(t: string, m: string) { contextTitle = t; contextMessage = m; contextOpen = true }
</script>

<BaseLayer title="Notifications">
  <div use:longpress={{ duration: 500, onLongPress: () => openContext('Notifications', 'Recent notifications including security alerts, payment confirmations, investment updates, and important reminders about your finances.') }}>
    <div class="card"><NotificationFeed /></div>
  </div>
</BaseLayer>
<ContextPicker opened={contextOpen} title={contextTitle} message={contextMessage} onClose={() => contextOpen = false} />

<style>
  .card { background: var(--deneb-surface); border: 1px solid var(--deneb-border); border-radius: 10px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
</style>

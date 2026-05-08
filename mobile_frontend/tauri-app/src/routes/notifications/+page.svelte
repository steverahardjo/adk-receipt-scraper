<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'
  import NotificationFeed from '$lib/features/notifications/NotificationFeed.svelte'
  import ContextPicker from '$lib/features/core/ContextPicker.svelte'
  import { longpress } from '$lib/features/core/longpress'

  let contextOpen = $state(false)
  let contextTitle = $state('')
  let contextMessage = $state('')

  function openContext(title: string, message: string) {
    contextTitle = title
    contextMessage = message
    contextOpen = true
  }
</script>

<BaseLayer title="Notifications">
  <div class="page">
    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Notifications', 'Recent notifications including security alerts, payment confirmations, investment updates, and important reminders about your finances.') }}>
      <div class="card">
        <NotificationFeed />
      </div>
    </div>
  </div>
</BaseLayer>

<ContextPicker opened={contextOpen} title={contextTitle} message={contextMessage} onClose={() => contextOpen = false} />

<style>
  .page { padding: 8px 0 16px; }
  .card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 8px 20px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }
  :global(.dark) .card {
    background: #2f3133;
    border-color: rgba(110, 212, 236, 0.08);
  }
</style>

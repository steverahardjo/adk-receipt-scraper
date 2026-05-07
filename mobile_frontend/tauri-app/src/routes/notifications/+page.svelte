<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'
  import NotificationFeed from '$lib/features/notifications/NotificationFeed.svelte'
</script>

<BaseLayer title="Notifications">
  <div class="page">
    <div class="card">
      <NotificationFeed />
    </div>
  </div>
</BaseLayer>

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

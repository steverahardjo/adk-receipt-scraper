<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'

  let { title = 'Settings', children }: { title?: string; children?: import('svelte').Snippet } = $props()
</script>

<BaseLayer {title}>
  <div class="settings-page">{@render children?.()}</div>
</BaseLayer>

<style>
  .settings-page { display: flex; flex-direction: column; gap: 22px; padding: 12px 16px 100px; }
</style>

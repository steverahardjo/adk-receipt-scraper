<script lang="ts">
  import { App } from 'framework7-svelte'

  let { children } = $props()

  const f7params = {
    theme: 'ios' as const,
    name: 'Deneb',
    version: '0.1.0',
  }
</script>

<App {...f7params}>
  {@render children()}
</App>

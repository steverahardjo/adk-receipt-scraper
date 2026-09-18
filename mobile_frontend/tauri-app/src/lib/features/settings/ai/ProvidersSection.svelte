<script lang="ts">
  import SettingsGroup from '../SettingsGroup.svelte'
  import ProviderRow from './ProviderRow.svelte'
  import ProviderKeySheet from './ProviderKeySheet.svelte'
  import { PROVIDERS } from './ai.svelte'
  import type { Provider } from './ai.svelte'

  let target = $state<Provider | null>(null)
</script>

<SettingsGroup title="AI Providers">
  {#each PROVIDERS as provider (provider.id)}
    <ProviderRow {provider} onManage={() => target = provider} />
  {/each}
</SettingsGroup>

<ProviderKeySheet opened={!!target} provider={target} onClose={() => target = null} />

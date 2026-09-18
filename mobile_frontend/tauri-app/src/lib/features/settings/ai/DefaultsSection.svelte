<script lang="ts">
  import SettingsGroup from '../SettingsGroup.svelte'
  import DefaultModelSelector from './DefaultModelSelector.svelte'
  import { ai, USE_CASE_LABELS } from './ai.svelte'
  import type { UseCase, Capability } from './ai.svelte'

  const USE_CASES: { useCase: UseCase; capability: Capability }[] = [
    { useCase: 'chat', capability: 'text' },
    { useCase: 'vision', capability: 'vision' },
    { useCase: 'reasoning', capability: 'reasoning' },
    { useCase: 'tts', capability: 'tts' },
  ]

  function optionsFor(capability: Capability) {
    return ai.modelsByCapability(capability).map((m) => ({
      value: m.id,
      label: `${ai.providerById(m.providerId)?.name ?? 'Unknown'} / ${m.name}`,
    }))
  }
</script>

<SettingsGroup title="Default Models">
  {#if ai.allModels().length === 0}
    <div class="empty">Connect a provider to choose default models.</div>
  {:else}
    {#each USE_CASES as item}
      <DefaultModelSelector
        label={USE_CASE_LABELS[item.useCase]}
        value={ai.defaults[item.useCase]}
        options={optionsFor(item.capability)}
        onSelect={(v) => ai.setDefault(item.useCase, v)}
      />
    {/each}
  {/if}
</SettingsGroup>

<style>
  .empty { padding: 24px 16px; text-align: center; font-family: 'Geist Sans', system-ui, sans-serif; font-size: 13px; color: var(--deneb-text-secondary); }
</style>

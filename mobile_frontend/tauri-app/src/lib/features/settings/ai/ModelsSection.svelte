<script lang="ts">
  import SettingsGroup from '../SettingsGroup.svelte'
  import AIProviderLogo from './AIProviderLogo.svelte'
  import { ai } from './ai.svelte'
  import type { Capability } from './ai.svelte'

  const CAP_LABELS: Record<Capability, string> = {
    text: 'Text',
    vision: 'Vision',
    reasoning: 'Reasoning',
    tts: 'TTS',
  }

  let providers = $derived(ai.connectedProviders())
</script>

<SettingsGroup title="Models">
  {#if providers.length === 0}
    <div class="empty">Add an API key to load the models available on each provider.</div>
  {:else}
    {#each providers as provider (provider.id)}
      <div class="provider-head">
        <AIProviderLogo id={provider.id} size={22} />
        <span class="provider-name">{provider.name}</span>
        <span class="count">{ai.modelsFor(provider.id).length}</span>
      </div>
      {#each ai.modelsFor(provider.id) as model (model.id)}
        <div class="model-row">
          <span class="model-name">{model.name}</span>
          <span class="caps">
            {#each model.capabilities as cap}
              <span class="cap">{CAP_LABELS[cap]}</span>
            {/each}
          </span>
        </div>
      {/each}
    {/each}
  {/if}
</SettingsGroup>

<style>
  .provider-head {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    background: var(--deneb-canvas);
    border-bottom: 1px solid var(--deneb-divider);
  }
  .provider-name { flex: 1; font-family: var(--deneb-sans); font-size: 14px; font-weight: 600; color: var(--f7-page-text-color); }
  .count { font-family: 'Geist Mono', monospace; font-size: 10px; color: var(--deneb-text-muted); }

  .model-row {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    padding: 12px 16px 12px 28px;
    border-bottom: 1px solid var(--deneb-divider);
  }
  .model-row:last-child { border-bottom: none; }
  .model-name { font-family: var(--deneb-sans); font-size: 14px; color: var(--f7-page-text-color); }

  .caps { display: flex; gap: 4px; flex-shrink: 0; }
  .cap {
    padding: 2px 7px; border-radius: 9999px;
    background: var(--deneb-canvas); border: 1px solid var(--deneb-border);
    font-family: 'Geist Mono', monospace; font-size: 9px; color: var(--deneb-text-secondary);
  }

  .empty { padding: 24px 16px; text-align: center; font-family: var(--deneb-sans); font-size: 13px; color: var(--deneb-text-secondary); }
</style>

<script lang="ts">
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import ProvidersSection from '$lib/features/settings/ai/ProvidersSection.svelte'
  import ModelsSection from '$lib/features/settings/ai/ModelsSection.svelte'
  import DefaultsSection from '$lib/features/settings/ai/DefaultsSection.svelte'
</script>

<SettingsScaffold title="AI Models">
  <ProvidersSection />
  <ModelsSection />
  <DefaultsSection />
</SettingsScaffold>

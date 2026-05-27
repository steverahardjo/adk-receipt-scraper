<script lang="ts">
  import { onMount } from 'svelte';
  import '$lib/f7';
  import 'framework7/css/bundle';
  import 'framework7-icons/css/framework7-icons.css';

  import '@fontsource/geist-sans/400.css';
  import '@fontsource/geist-sans/500.css';
  import '@fontsource/geist-sans/600.css';
  import '@fontsource/geist-sans/700.css';
  import '@fontsource/geist-mono/400.css';
  import '@fontsource/geist-mono/500.css';
  import '@fontsource/geist-mono/600.css';
  import '@fontsource/geist-mono/700.css';
  import '@fontsource/jetbrains-mono/400.css';
  import '@fontsource/jetbrains-mono/700.css';

  import '../lib/app.css';
  import DenebApp from '$lib/DenebApp.svelte';
  import Toast from '$lib/features/core/Toast.svelte';
  import LoadingOverlay from '$lib/features/core/LoadingOverlay.svelte';
  import { theme } from '$lib/features/core/theme.svelte';

  let { children } = $props();

  onMount(() => {
    theme.init();
  });
</script>

<Toast />
<LoadingOverlay />
<DenebApp>
  {@render children()}
</DenebApp>

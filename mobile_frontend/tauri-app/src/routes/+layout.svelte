<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
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
  import { lock } from '$lib/features/core/lock.svelte';

  let { children } = $props();

  onMount(() => {
    theme.init();
    lock.init();
  });

  $effect(() => {
    if (!lock.ready) return;
    const path = $page.url.pathname;
    if (lock.enabled && lock.locked && path !== '/lock') {
      goto('/lock');
    } else if ((!lock.enabled || !lock.locked) && path === '/lock') {
      goto('/');
    }
  });
</script>

<Toast />
<LoadingOverlay />
<DenebApp>
  {#if lock.ready}
    {@render children()}
  {/if}
</DenebApp>

<script lang="ts">
  import { onMount } from 'svelte';
  import '$lib/f7';
  import 'framework7/css/bundle';
  import 'framework7-icons/css/framework7-icons.css';
  import '../lib/app.css';
  import DenebApp from '$lib/DenebApp.svelte';
  import Toast from '$lib/features/core/Toast.svelte';
  import { theme } from '$lib/features/core/theme.svelte';

  let { children } = $props();

  onMount(() => {
    theme.init();
  });
</script>

<Toast />
<DenebApp>
  {@render children()}
</DenebApp>

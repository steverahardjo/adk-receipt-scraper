<script lang="ts">
  import '$lib/f7';
  import 'framework7/css/bundle';
  import '../lib/app.css';
  import DenebApp from '$lib/DenebApp.svelte';
  import Toast from '$lib/features/core/Toast.svelte';

  let { children } = $props();
</script>

<Toast />
<DenebApp>
  {@render children()}
</DenebApp>

<script lang="ts">
  const BRAND_BG: Record<string, string> = {
    together: '#6C5CE7',
    openai: '#0A0A0A',
    deepseek: '#4D6BFE',
    anthropic: '#1A1A1A',
    gemini: '#4285F4',
    openrouter: '#6467F2',
    kimi: '#111111',
  }

  let { id, size = 30 }: { id: string; size?: number } = $props()

  let bg = $derived(BRAND_BG[id] ?? '#787774')
  let style = $derived(`width:${size}px;height:${size}px;background:${bg}`)
  let glyph = $derived(Math.round(size * 0.6))
</script>

<span class="logo" {style} aria-hidden="true">
  <svg viewBox="0 0 24 24" width={glyph} height={glyph}>
    {#if id === 'together'}
      <rect x="4" y="6" width="16" height="3" rx="1.5" fill="#fff" />
      <rect x="4" y="10.5" width="11" height="3" rx="1.5" fill="#fff" opacity="0.8" />
      <rect x="4" y="15" width="7" height="3" rx="1.5" fill="#fff" opacity="0.6" />
    {:else if id === 'openai'}
      <path d="M12 3.2l7 4v8l-7 4-7-4v-8z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" />
      <circle cx="12" cy="11.2" r="2.8" fill="none" stroke="#fff" stroke-width="1.6" />
    {:else if id === 'deepseek'}
      <path d="M4 14c4-6 11-7 15-2" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="8.5" cy="11.5" r="1.3" fill="#fff" />
      <path d="M17 12.5l3.5-2.5v5z" fill="#fff" />
    {:else if id === 'anthropic'}
      <path d="M6.5 18L12 6l5.5 12" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="8.8" y1="13.8" x2="15.2" y2="13.8" stroke="#fff" stroke-width="1.8" stroke-linecap="round" />
    {:else if id === 'gemini'}
      <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z" fill="#fff" />
    {:else if id === 'openrouter'}
      <circle cx="6" cy="12" r="2.2" fill="none" stroke="#fff" stroke-width="1.6" />
      <circle cx="18" cy="7" r="2.2" fill="none" stroke="#fff" stroke-width="1.6" />
      <circle cx="18" cy="17" r="2.2" fill="none" stroke="#fff" stroke-width="1.6" />
      <path d="M8 11l8-3M8 13l8 3" stroke="#fff" stroke-width="1.4" stroke-linecap="round" />
    {:else if id === 'kimi'}
      <path d="M14 4.5a7.5 7.5 0 1 0 5.5 12.5A6 6 0 0 1 14 4.5z" fill="#fff" />
    {:else}
      <circle cx="12" cy="12" r="6" fill="none" stroke="#fff" stroke-width="1.8" />
    {/if}
  </svg>
</span>

<style>
  .logo {
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px;
    flex-shrink: 0;
  }
</style>

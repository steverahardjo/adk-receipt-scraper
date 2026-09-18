<script lang="ts">
  let {
    image = '',
    initials = '',
    size = 40,
    onclick,
  }: { image?: string; initials?: string; size?: number; onclick?: () => void } = $props()

  let style = $derived(`width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px`)
</script>

{#if onclick}
  <button class="avatar" {style} {onclick} aria-label="Profile">
    {#if image}<img src={image} alt="" />{:else}<span>{initials}</span>{/if}
  </button>
{:else}
  <div class="avatar" {style}>
    {#if image}<img src={image} alt="" />{:else}<span>{initials}</span>{/if}
  </div>
{/if}

<style>
  .avatar {
    border-radius: 50%;
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    background: var(--deneb-canvas);
    border: 1px solid var(--deneb-border);
    color: var(--f7-page-text-color);
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-weight: 600;
    padding: 0;
    flex-shrink: 0;
  }
  button.avatar { cursor: pointer; -webkit-tap-highlight-color: transparent; }
  button.avatar:active { opacity: 0.8; }
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>

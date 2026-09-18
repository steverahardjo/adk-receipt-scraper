<script lang="ts">
  let {
    checked = false,
    disabled = false,
    onchange,
    label = 'Toggle',
  }: { checked?: boolean; disabled?: boolean; onchange?: (value: boolean) => void; label?: string } = $props()
</script>

<button
  class="switch"
  class:on={checked}
  role="switch"
  aria-checked={checked}
  aria-label={label}
  {disabled}
  onclick={() => onchange?.(!checked)}
>
  <span></span>
</button>

<style>
  .switch {
    width: 46px; height: 28px; flex-shrink: 0;
    border: none; border-radius: 9999px; cursor: pointer; padding: 3px;
    background: var(--deneb-border); transition: background 0.15s;
    display: flex; align-items: center;
    -webkit-tap-highlight-color: transparent;
  }
  .switch span {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--deneb-surface); box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.15s;
  }
  .switch.on { background: var(--f7-page-text-color); }
  .switch.on span { transform: translateX(18px); background: var(--f7-page-bg-color); }
  .switch:disabled { opacity: 0.35; cursor: default; }
</style>

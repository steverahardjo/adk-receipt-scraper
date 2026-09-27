<script lang="ts">
  import ChoiceSheet from './ChoiceSheet.svelte'
  import ToggleSwitch from './ToggleSwitch.svelte'
  import { CATEGORY_ICONS, CATEGORY_COLORS, categories } from './categories.svelte'
  import type { Category } from './categories.svelte'

  let {
    opened = false,
    category = null,
    flow = 'expense' as 'expense' | 'income',
    onClose,
    onSaved,
    onRequestDelete,
  }: {
    opened?: boolean
    category?: Category | null
    flow?: 'expense' | 'income'
    onClose?: () => void
    onSaved?: () => void
    onRequestDelete?: (category: Category) => void
  } = $props()

  let name = $state('')
  let icon = $state(CATEGORY_ICONS[0])
  let color = $state(CATEGORY_COLORS[0])
  let parentId = $state<string | null>(null)
  let disabled = $state(false)

  let iconOpen = $state(false)
  let parentOpen = $state(false)
  let transitioning = $state(false)
  let visible = $state(false)

  $effect(() => {
    if (opened) {
      name = category?.name ?? ''
      icon = category?.icon ?? CATEGORY_ICONS[0]
      color = category?.color ?? CATEGORY_COLORS[0]
      parentId = category?.parentId ?? null
      disabled = category?.disabled ?? false
      visible = true
      requestAnimationFrame(() => requestAnimationFrame(() => { transitioning = true }))
    } else {
      transitioning = false
      setTimeout(() => { visible = false }, 250)
    }
  })

  let parentOptions = $derived([
    { value: '', label: 'None (top level)' },
    ...categories.list(flow)
      .filter((c) => c.id !== category?.id && c.parentId === null)
      .map((c) => ({ value: c.id, label: c.name })),
  ])

  async function save() {
    if (!name.trim()) return
    if (category) {
      await categories.update(category.id, { name: name.trim(), icon, color, parentId, disabled })
    } else {
      await categories.add({ name: name.trim(), flow, parentId, icon, color })
    }
    onSaved?.()
    onClose?.()
  }

  function requestDelete() {
    if (category) onRequestDelete?.(category)
    onClose?.()
  }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={onClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>
    <h2 class="title headline-md">{category ? 'Edit category' : `New ${flow} category`}</h2>

    <div class="fields">
      <div class="field">
        <label class="field-label" for="cat-name">Name</label>
        <input id="cat-name" class="field-input" type="text" placeholder="Category name" bind:value={name} />
      </div>

      <div class="field">
        <span class="field-label">Color</span>
        <div class="swatches">
          {#each CATEGORY_COLORS as swatch}
            <button
              class="swatch"
              class:active={color === swatch}
              style="background:{swatch}"
              aria-label={swatch}
              onclick={() => color = swatch}
            ></button>
          {/each}
        </div>
      </div>

      <div class="field">
        <span class="field-label">Icon</span>
        <button class="field-input select" onclick={() => iconOpen = true}>
          <span>{icon.charAt(0).toUpperCase() + icon.slice(1)}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>

      <div class="field">
        <span class="field-label">Parent category</span>
        <button class="field-input select" onclick={() => parentOpen = true}>
          <span class:placeholder={!parentId}>{parentId ? categories.byId(parentId)?.name : 'None (top level)'}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>

      {#if category}
        <div class="field row-field">
          <div>
            <span class="field-label">Disabled</span>
            <p class="field-hint">Hidden from new entries, kept for history</p>
          </div>
          <ToggleSwitch checked={disabled} label="Disabled" onchange={(v) => disabled = v} />
        </div>
      {/if}
    </div>

    <div class="actions">
      {#if category}
        <button class="btn danger-text" onclick={requestDelete}>Delete</button>
      {/if}
      <button class="btn primary" onclick={save} disabled={!name.trim()}>{category ? 'Save' : 'Add category'}</button>
    </div>
  </div>
{/if}

<ChoiceSheet
  opened={iconOpen}
  title="Icon"
  options={CATEGORY_ICONS.map((i) => ({ value: i, label: i.charAt(0).toUpperCase() + i.slice(1) }))}
  value={icon}
  onSelect={(v) => icon = v}
  onClose={() => iconOpen = false}
/>

<ChoiceSheet
  opened={parentOpen}
  title="Parent category"
  options={parentOptions}
  value={parentId ?? ''}
  onSelect={(v) => parentId = v || null}
  onClose={() => parentOpen = false}
/>

<style>
  .backdrop { position: fixed; inset: 0; z-index: 16000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 16001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); max-height: 90dvh; overflow-y: auto;
    padding: 0 20px calc(20px + env(safe-area-inset-bottom, 0px));
  }
  .sheet.show { transform: translateY(0); }
  .handle { width: 36px; height: 4px; border-radius: 2px; background: var(--deneb-border); margin: 10px auto 10px; }
  .title { margin: 0 0 16px; }

  .fields { display: flex; flex-direction: column; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .row-field { flex-direction: row; align-items: center; justify-content: space-between; }
  .field-label { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.02em; color: var(--deneb-text-secondary); }
  .field-hint { margin: 2px 0 0; font-family: var(--deneb-sans); font-size: 12px; color: var(--deneb-text-secondary); }
  .field-input {
    width: 100%; height: 44px; padding: 0 14px;
    border: 1px solid var(--deneb-border); border-radius: 10px;
    font-family: var(--deneb-sans); font-size: 15px;
    color: var(--f7-page-text-color); background: var(--deneb-canvas);
    outline: none; transition: border-color 0.15s; box-sizing: border-box;
  }
  .field-input:focus { border-color: var(--f7-page-text-color); }
  .select { display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left; }
  .select .placeholder { color: var(--deneb-text-muted); }
  .select svg { color: var(--deneb-text-muted); }

  .swatches { display: flex; flex-wrap: wrap; gap: 10px; }
  .swatch { width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .swatch.active { border-color: var(--f7-page-text-color); transform: scale(1.05); }

  .actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn {
    flex: 1; height: 48px; border-radius: 10px; border: none;
    font-family: var(--deneb-sans); font-size: 15px; font-weight: 600;
    cursor: pointer; -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
  }
  .btn.primary { background: var(--f7-page-text-color); color: var(--f7-page-bg-color); }
  .btn.primary:disabled { opacity: 0.4; }
  .btn.danger-text { flex: 0 0 auto; padding: 0 18px; background: transparent; border: 1px solid var(--deneb-border); color: var(--deneb-negative); }
  .btn:active:not(:disabled) { opacity: 0.85; }
</style>

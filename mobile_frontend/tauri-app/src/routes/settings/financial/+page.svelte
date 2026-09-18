<script lang="ts">
  import SettingsScaffold from '$lib/features/settings/SettingsScaffold.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ChoiceSheet from '$lib/features/settings/ChoiceSheet.svelte'
  import CategoryEditor from '$lib/features/settings/CategoryEditor.svelte'
  import { categories } from '$lib/features/settings/categories.svelte'
  import type { Category } from '$lib/features/settings/categories.svelte'
  import { settings, ACCOUNT_OPTIONS, CURRENCY_OPTIONS } from '$lib/features/settings/settings.svelte'
  import type { AppSettings } from '$lib/features/settings/settings.svelte'

  let editorOpen = $state(false)
  let editing = $state<Category | null>(null)
  let editorFlow = $state<'expense' | 'income'>('expense')

  let deleteTarget = $state<Category | null>(null)

  type PrefKey = 'defaultExpenseAccount' | 'defaultIncomeAccount' | 'defaultCategory' | 'defaultType' | 'defaultCurrency'
  let prefSheet = $state<{ key: PrefKey; title: string; options: string[] } | null>(null)

  let expenseCategories = $derived(categories.list('expense'))
  let incomeCategories = $derived(categories.list('income'))

  let deleteOptions = $derived(
    deleteTarget
      ? [
          { value: '', label: 'Delete without reassigning' },
          ...categories.list(deleteTarget.flow).filter((c) => c.id !== deleteTarget!.id).map((c) => ({ value: c.id, label: `Move to ${c.name}` })),
        ]
      : [],
  )

  function addCategory(flow: 'expense' | 'income') {
    editing = null
    editorFlow = flow
    editorOpen = true
  }

  function editCategory(category: Category) {
    editing = category
    editorFlow = category.flow
    editorOpen = true
  }

  function requestDelete(category: Category) {
    deleteTarget = category
  }

  async function confirmDelete(reassignId: string) {
    if (deleteTarget) await categories.remove(deleteTarget.id, reassignId || undefined)
    deleteTarget = null
  }

  function openPref(key: PrefKey) {
    const sets: Record<PrefKey, { title: string; options: string[] }> = {
      defaultExpenseAccount: { title: 'Default account for expenses', options: ACCOUNT_OPTIONS },
      defaultIncomeAccount: { title: 'Default account for income', options: ACCOUNT_OPTIONS },
      defaultCategory: { title: 'Default transaction category', options: expenseCategories.map((c) => c.name) },
      defaultType: { title: 'Default transaction type', options: ['expense', 'income'] },
      defaultCurrency: { title: 'Default currency', options: CURRENCY_OPTIONS },
    }
    prefSheet = { key, ...sets[key] }
  }

  function selectPref(value: string) {
    if (prefSheet) settings.update({ [prefSheet.key]: value } as Partial<AppSettings>)
  }

  function topLevel(flow: 'expense' | 'income') {
    return categories.list(flow).filter((c) => c.parentId === null)
  }
  function children(id: string) {
    return categories.value.filter((c) => c.parentId === id)
  }
</script>

<SettingsScaffold title="Financial">
  {#each [{ flow: 'expense' as const, label: 'Expense Categories' }, { flow: 'income' as const, label: 'Income Categories' }] as group}
    <SettingsGroup title={group.label}>
      {#each topLevel(group.flow) as parent}
        <SettingsRow label={parent.name} desc={parent.disabled ? 'Disabled' : parent.parentId ? '' : 'Parent category'} chevron onclick={() => editCategory(parent)}>
          <span class="dot" style="background:{parent.color}"></span>
        </SettingsRow>
        {#each children(parent.id) as child}
          <SettingsRow label={child.name} desc={child.disabled ? 'Disabled' : 'Subcategory'} chevron onclick={() => editCategory(child)}>
            <span class="dot" style="background:{child.color}"></span>
          </SettingsRow>
        {/each}
      {/each}
      <SettingsRow label={`Add ${group.flow} category`} onclick={() => addCategory(group.flow)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </SettingsRow>
    </SettingsGroup>
  {/each}

  <SettingsGroup title="Default Preferences">
    <SettingsRow label="Default account for expenses" value={settings.value.defaultExpenseAccount} chevron onclick={() => openPref('defaultExpenseAccount')} />
    <SettingsRow label="Default account for income" value={settings.value.defaultIncomeAccount} chevron onclick={() => openPref('defaultIncomeAccount')} />
    <SettingsRow label="Default category" value={settings.value.defaultCategory} chevron onclick={() => openPref('defaultCategory')} />
    <SettingsRow label="Default transaction type" value={settings.value.defaultType} chevron onclick={() => openPref('defaultType')} />
    <SettingsRow label="Default currency" value={settings.value.defaultCurrency} chevron onclick={() => openPref('defaultCurrency')} />
  </SettingsGroup>
</SettingsScaffold>

<CategoryEditor
  opened={editorOpen}
  category={editing}
  flow={editorFlow}
  onClose={() => editorOpen = false}
  onRequestDelete={requestDelete}
/>

<ChoiceSheet
  opened={!!prefSheet}
  title={prefSheet?.title ?? ''}
  options={(prefSheet?.options ?? []).map((o) => ({ value: o }))}
  value={prefSheet ? (settings.value[prefSheet.key] as string) : ''}
  onSelect={selectPref}
  onClose={() => prefSheet = null}
/>

<ChoiceSheet
  opened={!!deleteTarget}
  title={`Delete ${deleteTarget?.name ?? ''}`}
  options={deleteOptions}
  value=""
  onSelect={confirmDelete}
  onClose={() => deleteTarget = null}
/>

<style>
  .dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
</style>

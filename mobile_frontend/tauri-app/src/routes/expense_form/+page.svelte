<script lang="ts">
  import { page } from '$app/stores'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import ExpenseFormCard from '$lib/features/expense/ExpenseFormCard.svelte'
  import ContextPicker from '$lib/features/core/ContextPicker.svelte'
  import { longpress } from '$lib/features/core/longpress'

  let contextOpen = $state(false)
  let contextTitle = $state('')
  let contextMessage = $state('')

  let scanTitle = $derived($page.url.searchParams.get('merchant') ?? '')
  let scanAmount = $derived($page.url.searchParams.get('amount') ?? '')

  function openContext(title: string, message: string) {
    contextTitle = title
    contextMessage = message
    contextOpen = true
  }
</script>

<BaseLayer title="Add Expense">
  <div class="page">
    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Add Expense', 'Expense form for recording new transactions. Fill in merchant, amount, date, category, and notes. You can also scan QR codes or use the camera for instant capture.') }}>
      <ExpenseFormCard {scanTitle} {scanAmount} />
    </div>
  </div>
</BaseLayer>

<ContextPicker opened={contextOpen} title={contextTitle} message={contextMessage} onClose={() => contextOpen = false} />

<style>
  .page { display: flex; flex-direction: column; gap: 20px; padding: 0 0 16px; }
</style>

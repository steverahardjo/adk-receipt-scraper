<script lang="ts">
  import BaseLayer from '$lib/BaseLayer.svelte'
  import ExpenseFormCard from '$lib/features/expense/ExpenseFormCard.svelte'
</script>

<BaseLayer fab>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Add Expense</h1>
    </div>
    <ExpenseFormCard />
  </div>
</BaseLayer>

<style>
  .page { display: flex; flex-direction: column; gap: 20px; padding: 0 0 16px; }
  .page-header { padding: 8px 0 0; }
  .page-title {
    font-family: 'Manrope', sans-serif;
    font-size: 28px; font-weight: 700;
    margin: 0; color: #1a1c1e;
    letter-spacing: -0.02em;
  }
  :global(.dark) .page-title { color: #f0f0f3; }
</style>

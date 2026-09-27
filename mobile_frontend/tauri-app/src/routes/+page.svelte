<script lang="ts">
  import { goto } from '$app/navigation'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import SafeToSpend from '$lib/features/dashboard/SafeToSpend.svelte'
  import AccountList from '$lib/features/dashboard/AccountList.svelte'
  import BudgetModal from '$lib/features/dashboard/BudgetModal.svelte'
  import RecentTxList from '$lib/features/dashboard/RecentTxList.svelte'
  import UpcomingBills from '$lib/features/dashboard/UpcomingBills.svelte'

  let budgetOpen = $state(false)
</script>

{#snippet navbarRight()}
  <button class="notif-btn" onclick={() => goto('/notifications')} aria-label="Notifications">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
    <span class="notif-dot-nav"></span>
  </button>
{/snippet}

<BaseLayer title="Home" {navbarRight}>
  <div class="dash">
    <SafeToSpend />

    <AccountList />

    <UpcomingBills />

    <RecentTxList />

    <button class="budget-link" onclick={() => budgetOpen = true}>
      <span>Daily budget</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>
</BaseLayer>

<BudgetModal opened={budgetOpen} onClose={() => budgetOpen = false} />

<style>
  .dash { display: flex; flex-direction: column; gap: 16px; padding: 10px 16px 28px 16px; }

  .budget-link {
    display: flex; align-items: center; justify-content: space-between;
    min-height: 52px;
    padding: 0 18px;
    border: 1px solid var(--deneb-border);
    border-radius: var(--deneb-radius-md);
    background: var(--deneb-surface);
    box-shadow: var(--deneb-shadow-sm);
    font-family: var(--deneb-sans);
    font-size: 15px; font-weight: 500;
    color: var(--deneb-ink);
    cursor: pointer; width: 100%;
    -webkit-tap-highlight-color: transparent;
    transition: transform var(--deneb-dur-fast) var(--deneb-ease), opacity var(--deneb-dur-fast) var(--deneb-ease);
  }
  .budget-link:active { transform: scale(0.99); opacity: 0.85; }
  .budget-link svg { color: var(--deneb-text-muted); flex-shrink: 0; }

  :global(.notif-dot-nav) {
    position: absolute; top: 8px; right: 8px;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--deneb-negative); border: 2px solid var(--f7-navbar-bg-color, #F2F2F7);
  }
  :global(.dark .notif-dot-nav) { border-color: var(--f7-navbar-bg-color, #000000); }
</style>

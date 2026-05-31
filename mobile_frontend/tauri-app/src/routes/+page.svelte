<script lang="ts">
  import { goto } from '$app/navigation'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import WelcomeCard from '$lib/features/dashboard/WelcomeCard.svelte'
  import AccountPie from '$lib/features/dashboard/AccountPie.svelte'
  import BudgetModal from '$lib/features/dashboard/BudgetModal.svelte'
  import RecentTxList from '$lib/features/dashboard/RecentTxList.svelte'
  import UpcomingBills from '$lib/features/dashboard/UpcomingBills.svelte'
  import ContextPicker from '$lib/features/core/ContextPicker.svelte'
  import QRScanner from '$lib/features/dashboard/qris/QRScanner.svelte'
  import { longpress } from '$lib/features/core/longpress'

  let budgetOpen = $state(false), scannerOpen = $state(false)
  let contextOpen = $state(false), contextTitle = $state(''), contextMessage = $state('')

  function openContext(title: string, message: string) { contextTitle = title; contextMessage = message; contextOpen = true }
</script>

{#snippet navbarRight()}
  <button class="notif-btn" onclick={() => goto('/notifications')} aria-label="Notifications">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
    <span class="notif-dot-nav"></span>
  </button>
{/snippet}

<BaseLayer title="Home" {navbarRight} onScan={() => scannerOpen = true}>
  <div class="dash">
    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Net Worth', 'Net worth Rp 187.5M. Assets Rp 200M, Liabilities Rp 12.5M.') }}>
      <WelcomeCard />
    </div>

    <div class="bento">
      <div class="bento-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Liquid Money', 'Liquid money: BCA Rp 5.2M, Mandiri Rp 3.1M, Cash Rp 1.8M, GoPay Rp 850K, DANA Rp 500K.') }}>
        <AccountPie />
      </div>
      <div class="bento-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Upcoming Bills', 'Upcoming: PLN Rp 850K, Netflix Rp 180K, BPJS Rp 150K, Telkomsel Rp 200K.') }}>
        <UpcomingBills />
      </div>
    </div>

    <div class="divider"></div>

    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Recent Spending', 'Recent: GoFood Rp 52K, Pertamina Rp 275K, Indomaret Rp 38K, Netflix Rp 180K.') }}>
      <RecentTxList />
    </div>

    <div class="divider"></div>

    <button class="budget-link" onclick={() => budgetOpen = true}>
      <span>Daily budget</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>
</BaseLayer>

<BudgetModal opened={budgetOpen} onClose={() => budgetOpen = false} />
<ContextPicker opened={contextOpen} title={contextTitle} message={contextMessage} onClose={() => contextOpen = false} />
<QRScanner opened={scannerOpen} onClose={() => scannerOpen = false} />

<style>
  .dash { display: flex; flex-direction: column; gap: 0; padding: 8px 16px 80px 16px; }

  .bento { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px; }
  .bento-card { min-width: 0; }

  .divider { height: 1px; background: var(--deneb-divider); margin: 28px 0 20px 0; }

  .budget-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0;
    border: none; background: transparent;
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 15px; font-weight: 500;
    color: var(--f7-page-text-color);
    cursor: pointer; width: 100%;
    -webkit-tap-highlight-color: transparent;
    transition: opacity 0.15s;
  }
  .budget-link:active { opacity: 0.6; }
  .budget-link svg { color: var(--deneb-text-muted); flex-shrink: 0; }

  :global(.notif-dot-nav) {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--deneb-negative); border: 2px solid var(--f7-navbar-bg-color, #FBFBFA);
  }
  :global(.dark .notif-dot-nav) { border-color: var(--f7-navbar-bg-color, #18181A); }
</style>

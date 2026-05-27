<script lang="ts">
  import { goto } from '$app/navigation'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import WelcomeCard from '$lib/features/dashboard/WelcomeCard.svelte'
  import CashFlowStrip from '$lib/features/dashboard/CashFlowStrip.svelte'
  import AccountPie from '$lib/features/dashboard/AccountPie.svelte'
  import BudgetModal from '$lib/features/dashboard/BudgetModal.svelte'
  import CategoryBreakdown from '$lib/features/dashboard/CategoryBreakdown.svelte'
  import RecentTxList from '$lib/features/dashboard/RecentTxList.svelte'
  import UpcomingBills from '$lib/features/dashboard/UpcomingBills.svelte'
  import ContextPicker from '$lib/features/core/ContextPicker.svelte'
  import QRScanner from '$lib/features/dashboard/qris/QRScanner.svelte'
  import { longpress } from '$lib/features/core/longpress'

  let budgetOpen = $state(false)
  let scannerOpen = $state(false)

  let contextOpen = $state(false)
  let contextTitle = $state('')
  let contextMessage = $state('')

  function openContext(title: string, message: string) {
    contextTitle = title
    contextMessage = message
    contextOpen = true
  }
</script>

{#snippet navbarRight()}
  <button class="notif-btn" onclick={() => goto('/notifications')} aria-label="Notifications">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
    <span class="notif-dot-nav"></span>
  </button>
{/snippet}

<BaseLayer title="Dashboard" {navbarRight} onScan={() => scannerOpen = true}>
  <div class="dash">
    <div class="dash-header">
      <div class="date-chip">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>

    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Net Worth', 'Net worth Rp 187.5M. Assets Rp 200M, Liabilities Rp 12.5M. Monthly income Rp 8.5M, spent Rp 3.3M.') }}>
      <WelcomeCard />
    </div>
    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Cash Flow', 'Cash flow summary: Income Rp 8.5M, Expenses Rp 3.3M, Net +Rp 5.2M this month.') }}>
      <CashFlowStrip />
    </div>
    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Liquid Money', 'Liquid money breakdown: BCA Rp 5.2M, Mandiri Rp 3.1M, Cash Rp 1.8M, GoPay Rp 850K, DANA Rp 500K. Total Rp 11.45M across 5 accounts.') }}>
      <AccountPie />
    </div>
    <div class="scroll-row">
      <div class="scroll-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Recent Transactions', 'Recent expenses: GoFood Rp 52K, Pertamina Rp 275K, Indomaret Rp 38K, Netflix Rp 180K. Total today Rp 545K.') }}>
        <RecentTxList />
      </div>
      <div class="scroll-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Upcoming Bills', 'Upcoming bills: PLN Rp 850K due soon, Netflix Rp 180K, BPJS Rp 150K, Telkomsel Rp 200K.') }}>
        <UpcomingBills />
      </div>
      <div class="scroll-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Category Spending', 'Monthly spending by category: Food & Drinks Rp 1.32M, Transportation Rp 875K, Shopping Rp 620K, Bills Rp 450K. Total Rp 3.25M.') }}>
        <CategoryBreakdown />
      </div>
    </div>
    <button class="budget-btn" onclick={() => budgetOpen = true}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <span>Today's Budget</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>
</BaseLayer>

<BudgetModal opened={budgetOpen} onClose={() => budgetOpen = false} />

<ContextPicker opened={contextOpen} title={contextTitle} message={contextMessage} onClose={() => contextOpen = false} />

<QRScanner opened={scannerOpen} onClose={() => scannerOpen = false} />

<style>
  .dash { display: flex; flex-direction: column; gap: 20px; padding: 0 0 80px; }

  .dash-header { padding: 8px 0 0; }

  :global(.notif-btn) {
    position: relative;
    width: 36px; height: 36px;
    border: none; border-radius: 10px;
    background: rgba(0, 141, 163, 0.06);
    color: #6b7b72;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s;
  }
  :global(.dark) .notif-btn { background: rgba(110, 212, 236, 0.06); color: #6b7b72; }
  :global(.notif-btn:active) { background: rgba(0, 141, 163, 0.12); }
  :global(.dark .notif-btn:active) { background: rgba(110, 212, 236, 0.12); }

  :global(.notif-dot-nav) {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #006c50;
    border: 2px solid var(--f7-navbar-bg-color, #f9f9fc);
  }
  :global(.dark .notif-dot-nav) { background: #24e0ab; border-color: var(--f7-navbar-bg-color, #1a1c1e); }

  .scroll-row {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    margin: 0 -16px;
    padding: 0 16px;
    scrollbar-width: none;
  }
  .scroll-row::-webkit-scrollbar { display: none; }
  .scroll-card {
    flex: 0 0 280px;
    scroll-snap-align: start;
  }

  .date-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: rgba(0, 141, 163, 0.06);
    border-radius: 8px;
    color: #6b7b72;
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.01em;
  }
  :global(.dark) .date-chip { background: rgba(110, 212, 236, 0.06); color: #6b7b72; }

  .budget-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 16px 20px;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    background: #ffffff;
    color: #1a1c1e;
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
    transition: background 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  :global(.dark) .budget-btn { background: #2f3133; border-color: rgba(110, 212, 236, 0.08); color: #f0f0f3; }
  .budget-btn:active { background: #f0f9f8; }
  :global(.dark) .budget-btn:active { background: rgba(36, 224, 171, 0.06); }
  .budget-btn svg:first-child { color: #006c50; }
  :global(.dark) .budget-btn svg:first-child { color: #24e0ab; }
  .budget-btn svg:last-child { margin-left: auto; color: #aeaeb2; }
  :global(.dark) .budget-btn svg:last-child { color: #6b7b72; }
  .budget-btn span { flex: 1; text-align: left; }
</style>

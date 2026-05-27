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

    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Net Worth', 'Net worth Rp 187.5M. Assets Rp 200M, Liabilities Rp 12.5M. Monthly income Rp 8.5M, spent Rp 3.3M.') }}><WelcomeCard /></div>
    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Cash Flow', 'Cash flow summary: Income Rp 8.5M, Expenses Rp 3.3M, Net +Rp 5.2M this month.') }}><CashFlowStrip /></div>
    <div use:longpress={{ duration: 500, onLongPress: () => openContext('Liquid Money', 'Liquid money breakdown: BCA Rp 5.2M, Mandiri Rp 3.1M, Cash Rp 1.8M, GoPay Rp 850K, DANA Rp 500K. Total Rp 11.45M across 5 accounts.') }}><AccountPie /></div>

    <div class="scroll-row">
      <div class="scroll-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Recent Transactions', 'Recent expenses: GoFood Rp 52K, Pertamina Rp 275K, Indomaret Rp 38K, Netflix Rp 180K. Total today Rp 545K.') }}><RecentTxList /></div>
      <div class="scroll-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Upcoming Bills', 'Upcoming bills: PLN Rp 850K, Netflix Rp 180K, BPJS Rp 150K, Telkomsel Rp 200K.') }}><UpcomingBills /></div>
      <div class="scroll-card" use:longpress={{ duration: 500, onLongPress: () => openContext('Category Spending', 'Monthly spending by category: Food & Drinks Rp 1.32M, Transportation Rp 875K, Shopping Rp 620K, Bills Rp 450K. Total Rp 3.25M.') }}><CategoryBreakdown /></div>
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
  .dash { display: flex; flex-direction: column; gap: 24px; padding: 12px 16px 80px 16px; }
  .dash-header { padding: 8px 0 0; }

  :global(.notif-dot-nav) {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--deneb-negative); border: 2px solid var(--f7-navbar-bg-color, #FBFBFA);
  }
  :global(.dark .notif-dot-nav) { border-color: var(--f7-navbar-bg-color, #18181A); }

  .scroll-row {
    display: flex; gap: 16px; overflow-x: auto;
    scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
    margin: 0 -16px; padding: 0 16px; scrollbar-width: none;
  }
  .scroll-row::-webkit-scrollbar { display: none; }
  .scroll-card { flex: 0 0 280px; scroll-snap-align: start; }

  .date-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 6px 10px;
    background: var(--deneb-canvas); border: 1px solid var(--deneb-border);
    border-radius: 8px;
    color: var(--deneb-text-secondary);
    font-family: 'Geist Mono', monospace;
    font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
  }

  .budget-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 16px 20px;
    border: 1px solid var(--deneb-border); border-radius: 10px;
    background: var(--deneb-surface);
    color: var(--f7-page-text-color);
    font-family: 'Geist Sans', system-ui, sans-serif;
    font-size: 15px; font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    transition: transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .budget-btn:active { transform: scale(0.98); }
  .budget-btn svg:first-child { color: var(--deneb-text-secondary); }
  .budget-btn svg:last-child { margin-left: auto; color: var(--deneb-text-muted); }
  .budget-btn span { flex: 1; text-align: left; }
</style>

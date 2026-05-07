<script lang="ts">
  import { goto } from '$app/navigation'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import WelcomeCard from '$lib/features/dashboard/WelcomeCard.svelte'
  import NewsFeed from '$lib/features/dashboard/NewsFeed.svelte'
  import CashFlowStrip from '$lib/features/dashboard/CashFlowStrip.svelte'
  import AccountCards from '$lib/features/dashboard/AccountCards.svelte'
</script>

<BaseLayer fab>
  <div class="dash">
    <div class="dash-header">
      <div class="header-top">
        <h1 class="header-title">Dashboard</h1>
        <div class="header-actions">
          <button class="notif-btn" onclick={() => goto('/notifications')} aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span class="notif-dot"></span>
          </button>
          <div class="date-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>

    <WelcomeCard />
    <CashFlowStrip />
    <AccountCards />
    <NewsFeed />
  </div>
</BaseLayer>

<style>
  .dash {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 0 16px;
  }

  .dash-header {
    padding: 8px 0 0;
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-title {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: #1a1c1e;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  :global(.dark) .header-title {
    color: #f0f0f3;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .notif-btn {
    position: relative;
    width: 36px; height: 36px;
    border: none; border-radius: 10px;
    background: rgba(0, 141, 163, 0.06);
    color: #6b7b72;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s;
  }
  :global(.dark) .notif-btn {
    background: rgba(110, 212, 236, 0.06);
    color: #6b7b72;
  }
  .notif-btn:active { background: rgba(0, 141, 163, 0.12); }
  :global(.dark) .notif-btn:active { background: rgba(110, 212, 236, 0.12); }

  .notif-dot {
    position: absolute; top: 8px; right: 8px;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #006c50;
    border: 2px solid #f9f9fc;
  }
  :global(.dark) .notif-dot {
    background: #24e0ab;
    border-color: #1a1c1e;
  }

  .date-chip {
    display: flex;
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

  :global(.dark) .date-chip {
    background: rgba(110, 212, 236, 0.06);
    color: #6b7b72;
  }
</style>

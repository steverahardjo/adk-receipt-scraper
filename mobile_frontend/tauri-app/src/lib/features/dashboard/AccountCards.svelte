<script lang="ts">
  const accounts = [
    { name: 'BCA', balance: 5200000, type: 'bank' },
    { name: 'Mandiri', balance: 3100000, type: 'bank' },
    { name: 'Cash', balance: 1800000, type: 'cash' },
    { name: 'GoPay', balance: 850000, type: 'ewallet' },
    { name: 'DANA', balance: 500000, type: 'ewallet' },
  ]

  let maxBalance = $derived(Math.max(...accounts.map((a) => a.balance)))
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Accounts</span>
    <button class="header-action">See all</button>
  </div>

  <div class="list">
    {#each accounts as a}
      <div class="row">
        <div class="left">
          <div class="avatar" class:bank={a.type === 'bank'} class:cash={a.type === 'cash'} class:ewallet={a.type === 'ewallet'}>
            {#if a.type === 'bank'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
              </svg>
            {:else if a.type === 'cash'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M2 12h2m16 0h2m-10-8V2m0 20v-2" />
              </svg>
            {:else}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            {/if}
          </div>
          <span class="name">{a.name}</span>
        </div>
        <div class="right">
          <span class="balance">Rp {a.balance.toLocaleString('id-ID')}</span>
          <div class="mini-bar">
            <div class="mini-fill" style="width: {(a.balance / maxBalance) * 100}%"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .card {
    background: #ffffff;
    border: 1px solid rgba(0, 141, 163, 0.08);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 16px rgba(0, 141, 163, 0.06);
  }

  :global(.dark) .card {
    background: #2f3133;
    border-color: rgba(110, 212, 236, 0.08);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .header-title {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #1a1c1e;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :global(.dark) .header-title {
    color: #f0f0f3;
  }

  .header-action {
    background: none;
    border: none;
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #008da3;
    cursor: pointer;
    padding: 0;
  }

  :global(.dark) .header-action {
    color: #6ed4ec;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .avatar.bank { background: rgba(0, 108, 80, 0.1); color: #006c50; }
  .avatar.cash { background: rgba(0, 141, 163, 0.1); color: #008da3; }
  .avatar.ewallet { background: rgba(46, 229, 175, 0.12); color: #006c50; }

  :global(.dark) .avatar.bank { background: rgba(36, 224, 171, 0.12); color: #24e0ab; }
  :global(.dark) .avatar.cash { background: rgba(110, 212, 236, 0.12); color: #6ed4ec; }
  :global(.dark) .avatar.ewallet { background: rgba(36, 224, 171, 0.1); color: #24e0ab; }

  .name {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1a1c1e;
  }

  :global(.dark) .name {
    color: #f0f0f3;
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  .balance {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #1a1c1e;
    font-variant-numeric: tabular-nums;
  }

  :global(.dark) .balance {
    color: #f0f0f3;
  }

  .mini-bar {
    width: 80px;
    height: 3px;
    background: rgba(0, 141, 163, 0.08);
    border-radius: 2px;
    overflow: hidden;
  }

  :global(.dark) .mini-bar {
    background: rgba(110, 212, 236, 0.08);
  }

  .mini-fill {
    height: 100%;
    background: #2ee5af;
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .mini-fill {
    background: #24e0ab;
  }
</style>

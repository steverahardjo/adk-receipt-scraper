<script lang="ts">
  const accounts = [
    { name: 'BCA', balance: 5200000, color: '#006c50' },
    { name: 'Mandiri', balance: 3100000, color: '#2ee5af' },
    { name: 'Cash', balance: 1800000, color: '#008da3' },
    { name: 'GoPay', balance: 850000, color: '#24e0ab' },
    { name: 'DANA', balance: 500000, color: '#005c75' },
  ]

  let total = $derived(accounts.reduce((s, a) => s + a.balance, 0))

  let segments = $derived.by(() => {
    const r = 72, circumference = 2 * Math.PI * r
    let offset = 0
    return accounts.map((a) => {
      const ratio = a.balance / total
      const length = ratio * circumference
      const seg = { ...a, ratio, length, offset, circumference, r }
      offset += length
      return seg
    })
  })
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Liquid Money</span>
    <span class="header-total">Rp {total.toLocaleString('id-ID')}</span>
  </div>

  <div class="pie-wrap">
    <svg width="180" height="180" viewBox="0 0 180 180">
      {#each segments as seg}
        <circle
          cx="90" cy="90" r={seg.r}
          fill="none"
          stroke={seg.color}
          stroke-width="28"
          stroke-dasharray="{seg.length} {seg.circumference - seg.length}"
          stroke-dashoffset={-seg.offset}
          transform="rotate(-90 90 90)"
          style="transition: stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)"
        />
      {/each}
      <text x="90" y="86" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-size="26" font-weight="700" fill="currentColor">
        {accounts.length}
      </text>
      <text x="90" y="104" text-anchor="middle" font-family="Public Sans, system-ui, sans-serif" font-size="11" font-weight="500" fill="#6b7b72">
        Accounts
      </text>
    </svg>
  </div>

  <div class="legend">
    {#each segments as seg}
      <div class="legend-row">
        <div class="legend-left">
          <span class="legend-dot" style="background: {seg.color}"></span>
          <span class="legend-name">{seg.name}</span>
        </div>
        <span class="legend-value">Rp {(seg.balance / 1000000).toFixed(1)}M</span>
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
    margin-bottom: 12px;
  }

  .header-title {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #1a1c1e;
  }

  :global(.dark) .header-title {
    color: #f0f0f3;
  }

  .header-total {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1a1c1e;
    font-variant-numeric: tabular-nums;
  }

  :global(.dark) .header-total {
    color: #f0f0f3;
  }

  .pie-wrap {
    display: flex;
    justify-content: center;
    margin: 4px 0 16px;
  }

  .pie-wrap svg {
    color: #1a1c1e;
  }

  :global(.dark) .pie-wrap svg {
    color: #f0f0f3;
  }

  .legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .legend-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-name {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1a1c1e;
  }

  :global(.dark) .legend-name {
    color: #f0f0f3;
  }

  .legend-value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #6b7b72;
    font-variant-numeric: tabular-nums;
  }
</style>

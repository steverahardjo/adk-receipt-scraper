<script lang="ts">
  const accounts = [
    { name: 'BCA', balance: 5200000, color: '#0072B2' },
    { name: 'Mandiri', balance: 3100000, color: '#E69F00' },
    { name: 'Cash', balance: 1800000, color: '#009E73' },
    { name: 'GoPay', balance: 850000, color: '#CC79A7' },
    { name: 'DANA', balance: 500000, color: '#56B4E9' },
  ]
  let total = $derived(accounts.reduce((s, a) => s + a.balance, 0))
  let selected = $state<string | null>(null)
  let selectedAccount = $derived(accounts.find(a => a.name === selected) ?? null)

  let segments = $derived.by(() => {
    const r = 72, c = 2 * Math.PI * r
    let offset = 0
    return accounts.map((a) => {
      const ratio = a.balance / total
      const length = ratio * c
      const seg = { ...a, ratio, length, offset, circumference: c, r }
      offset += length
      return seg
    })
  })

  function selectSeg(name: string) { selected = selected === name ? null : name }
</script>

<div class="card">
  <div class="header">
    <span class="header-title">Liquid Money</span>
    <span class="header-total">Rp {total.toLocaleString('id-ID')}</span>
  </div>
  <div class="pie-wrap">
    <svg viewBox="0 0 180 180" width="180" height="180">
      {#each segments as seg}
        <circle cx="90" cy="90" r={seg.r} fill="none" stroke={seg.color}
          stroke-width="28"
          stroke-dasharray="{seg.length} {seg.circumference - seg.length}"
          stroke-dashoffset={-seg.offset} transform="rotate(-90 90 90)"
          class="arc" class:selected={selected === seg.name}
          style="transition: stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)"
          onclick={() => selectSeg(seg.name)} role="button" tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') selectSeg(seg.name) }} />
      {/each}
      <g transform="translate(90, 90)" text-anchor="middle">
        <text y="-8" dominant-baseline="middle"
          font-family="Geist Sans, system-ui, sans-serif"
          font-size={selectedAccount ? '20' : '26'} font-weight="700" fill="currentColor">
          {#if selectedAccount}
            Rp {(selectedAccount.balance / 1000000).toFixed(1)}M
          {:else}{accounts.length}{/if}
        </text>
        <text y="12" dominant-baseline="middle"
          font-family="Geist Mono, monospace" font-size="11" font-weight="500"
          fill="currentColor" opacity={selectedAccount ? 0.6 : 0.5}>
          {#if selectedAccount}{selectedAccount.name}{:else}Accounts{/if}
        </text>
      </g>
    </svg>
  </div>
</div>

<style>
  .card {
    background: var(--deneb-surface);
    border: 1px solid var(--deneb-border);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .header-title { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.03em; color: var(--f7-page-text-color); }
  .header-total { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; color: var(--f7-page-text-color); font-variant-numeric: tabular-nums; }
  .pie-wrap { display: flex; justify-content: center; margin: 4px 0 0; }
  .pie-wrap svg { color: var(--f7-page-text-color); }
  .arc { cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .arc.selected { filter: brightness(1.1) drop-shadow(0 0 4px currentColor); }
</style>

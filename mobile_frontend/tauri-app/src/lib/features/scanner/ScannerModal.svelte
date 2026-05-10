<script lang="ts">
  import { goto } from '$app/navigation'
  import { startScanning, parseQrisManual } from './scanner'
  import type { QrisData } from './types'

  let {
    opened = false,
    onClose,
  }: {
    opened?: boolean
    onClose?: () => void
  } = $props()

  let transitioning = $state(false)
  let visible = $state(false)

  let video = $state<HTMLVideoElement | null>(null)
  let canvas = $state<HTMLCanvasElement | null>(null)
  let scanning = $state(false)
  let error = $state('')
  let manualInput = $state('')
  let result = $state<QrisData | null>(null)
  let abortController = $state<AbortController | null>(null)

  $effect(() => {
    if (opened) {
      visible = true
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          transitioning = true
          startCamera()
        })
      })
    } else {
      transitioning = false
      stopCamera()
      setTimeout(() => { visible = false; result = null; error = ''; manualInput = '' }, 250)
    }
  })

  function startCamera() {
    if (!video || !canvas) return
    scanning = true
    error = ''
    result = null
    abortController = new AbortController()
    startScanning(video, canvas, {
      onResult: (d) => {
        scanning = false
        result = d
      },
      onError: (msg) => {
        scanning = false
        error = msg
      },
    }, abortController.signal)
  }

  function stopCamera() {
    abortController?.abort()
    abortController = null
    scanning = false
  }

  function retry() {
    error = ''
    result = null
    startCamera()
  }

  async function handleManualSubmit() {
    if (!manualInput.trim()) return
    try {
      const d = await parseQrisManual(manualInput.trim())
      result = d
    } catch {
      error = 'Invalid QRIS code'
    }
  }

  function handleConfirm() {
    if (!result) return
    onClose?.()
    goto(result.deeplink)
  }

  function handleClose() {
    stopCamera()
    onClose?.()
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" class:show={transitioning} onclick={handleClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="body">
      <h2 class="title">Scan QRIS</h2>

      {#if error && !result}
        <div class="error-box">
          <p class="error-text">{error}</p>
          <button class="retry-btn" onclick={retry}>Try Again</button>
        </div>

        <div class="manual-section">
          <span class="manual-label">Or paste QRIS code manually</span>
          <div class="manual-row">
            <input class="manual-input" type="text" placeholder="Paste QRIS string..." bind:value={manualInput} />
            <button class="manual-btn" onclick={handleManualSubmit} disabled={!manualInput.trim()}>Parse</button>
          </div>
        </div>
      {:else if result}
        <div class="result-card">
          <div class="result-badge" class:tng={result.code_type === 'tng'}>
            {result.code_type === 'tng' ? 'TNG' : 'QRIS'}
          </div>
          <div class="result-row">
            <span class="result-label">Merchant</span>
            <span class="result-value">{result.merchant}</span>
          </div>
          {#if result.amount}
            <div class="result-row">
              <span class="result-label">Amount</span>
              <span class="result-value">Rp {result.amount.toLocaleString('id-ID')}</span>
            </div>
          {/if}
          {#if result.reference}
            <div class="result-row">
              <span class="result-label">Reference</span>
              <span class="result-value">{result.reference}</span>
            </div>
          {/if}
          <div class="result-actions">
            <button class="result-btn secondary" onclick={retry}>Re-scan</button>
            <button class="result-btn primary" onclick={handleConfirm}>Fill Expense</button>
          </div>
        </div>
      {:else}
        <div class="viewfinder">
          <video bind:this={video} class="video-feed" autoplay playsinline muted></video>
          <canvas bind:this={canvas} class="capture-canvas"></canvas>
          <div class="scan-overlay">
            <div class="scan-corner tl"></div>
            <div class="scan-corner tr"></div>
            <div class="scan-corner bl"></div>
            <div class="scan-corner br"></div>
          </div>
          {#if scanning}
            <div class="scanning-indicator">
              <div class="scan-line"></div>
            </div>
          {/if}
        </div>
        <p class="hint">Point camera at a QRIS code</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 14000; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.6); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0;
    z-index: 14001;
    background: #fff;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
    max-height: 90dvh;
    overflow-y: auto;
  }
  :global(.dark) .sheet { background: #1c1c1e; }
  .sheet.show { transform: translateY(0); }

  .handle { width: 40px; height: 5px; border-radius: 3px; background: #d1d1d6; margin: 10px auto 6px; }
  :global(.dark) .handle { background: #48484a; }

  .body { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 4px 24px 32px; }

  .title { font-family: 'Manrope', system-ui, sans-serif; font-size: 20px; font-weight: 700; margin: 0; color: #1a1c1e; }
  :global(.dark) .title { color: #f0f0f3; }

  .viewfinder {
    position: relative;
    width: 240px;
    height: 240px;
    border-radius: 16px;
    overflow: hidden;
    background: #000;
  }
  .video-feed { width: 100%; height: 100%; object-fit: cover; }
  .capture-canvas { display: none; }

  .scan-overlay {
    position: absolute; inset: 0;
    pointer-events: none;
  }
  .scan-corner {
    position: absolute;
    width: 24px; height: 24px;
    border-color: #2ee5af;
    border-style: solid;
  }
  .tl { top: 12px; left: 12px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
  .tr { top: 12px; right: 12px; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
  .bl { bottom: 12px; left: 12px; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
  .br { bottom: 12px; right: 12px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }

  .scanning-indicator {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 0;
    pointer-events: none;
  }
  .scan-line {
    height: 2px;
    background: #2ee5af;
    animation: scan 2s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(46, 229, 175, 0.5);
  }
  @keyframes scan {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(220px); }
  }

  .hint { font-family: 'Manrope', sans-serif; font-size: 14px; color: #6b7b72; margin: -8px 0 0; }

  .error-box { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px; }
  .error-text { font-family: 'Manrope', sans-serif; font-size: 14px; color: #ba1a1a; margin: 0; text-align: center; }
  .retry-btn { padding: 8px 20px; border: 1px solid #006c50; border-radius: 20px; background: none; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; color: #006c50; cursor: pointer; }
  :global(.dark) .retry-btn { border-color: #24e0ab; color: #24e0ab; }

  .manual-section { width: 100%; display: flex; flex-direction: column; gap: 8px; }
  .manual-label { font-family: 'Public Sans', sans-serif; font-size: 12px; font-weight: 500; color: #6b7b72; text-align: center; }
  .manual-row { display: flex; gap: 8px; }
  .manual-input { flex: 1; height: 44px; padding: 0 14px; border: 1.5px solid transparent; border-radius: 10px; font-family: 'Manrope', sans-serif; font-size: 14px; color: #1a1c1e; background: #f0f9f8; outline: none; box-sizing: border-box; }
  :global(.dark) .manual-input { background: #2f3133; color: #f0f0f3; }
  .manual-input:focus { border-color: #2ee5af; }
  .manual-btn { height: 44px; padding: 0 16px; border: none; border-radius: 10px; background: #006c50; color: #fff; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; }
  :global(.dark) .manual-btn { background: #24e0ab; color: #1a1c1e; }
  .manual-btn:disabled { opacity: 0.4; }

  .result-card { width: 100%; display: flex; flex-direction: column; gap: 12px; padding: 20px; background: #f0f9f8; border-radius: 16px; position: relative; }
  :global(.dark) .result-card { background: rgba(36, 224, 171, 0.06); }
  .result-badge { position: absolute; top: 12px; right: 12px; padding: 3px 10px; border-radius: 6px; font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; background: #006c50; color: #fff; }
  .result-badge.tng { background: #1a3a8a; }
  :global(.dark) .result-badge { background: #24e0ab; color: #1a1c1e; }
  :global(.dark) .result-badge.tng { background: #3b82f6; color: #fff; }
  :global(.dark) .result-card { background: rgba(36, 224, 171, 0.06); }

  .result-row { display: flex; justify-content: space-between; align-items: center; }
  .result-label { font-family: 'Public Sans', sans-serif; font-size: 13px; font-weight: 500; color: #6b7b72; }
  .result-value { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; color: #1a1c1e; }
  :global(.dark) .result-value { color: #f0f0f3; }

  .result-actions { display: flex; gap: 10px; margin-top: 4px; }
  .result-btn { flex: 1; height: 44px; border-radius: 10px; border: none; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; }
  .result-btn.primary { background: #006c50; color: #fff; }
  :global(.dark) .result-btn.primary { background: #24e0ab; color: #1a1c1e; }
  .result-btn.secondary { border: 1.5px solid rgba(0, 108, 80, 0.2); background: transparent; color: #006c50; }
  :global(.dark) .result-btn.secondary { border-color: rgba(36, 224, 171, 0.3); color: #24e0ab; }
</style>

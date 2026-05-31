<script lang="ts">
  import { goto } from "$app/navigation";
  import { scan, Format } from "@tauri-apps/plugin-barcode-scanner";
  import { parseQrisManual } from "$lib/features/scanner/scanner";
  import type { QrisData } from "$lib/features/scanner/types";

  let {
    opened = false,
    onClose,
  }: {
    opened?: boolean;
    onClose?: () => void;
  } = $props();

  let transitioning = $state(false);
  let visible = $state(false);
  let scanning = $state(false);
  let pluginAvailable = $state(true);
  let error = $state("");
  let manualInput = $state("");
  let result = $state<QrisData | null>(null);

  $effect(() => {
    if (opened) {
      visible = true;
      result = null; error = ""; manualInput = ""; pluginAvailable = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { transitioning = true; });
      });
    } else {
      transitioning = false;
      setTimeout(() => { visible = false; }, 250);
    }
  });

  async function handleScan() {
    scanning = true; error = ""; result = null;

    try {
      const scanned = await scan({
        formats: [Format.QRCode],
        cameraDirection: "back",
      });

      if (!scanned || !scanned.content) {
        error = "No QR code detected";
        scanning = false;
        return;
      }

      const data = await parseQrisManual(scanned.content);
      result = data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("cancelled") || msg.includes("Closed")) return;
      if (msg.includes("plugin") || msg.includes("not available") || msg.includes("not allowed")) {
        error = "Camera scanner is only available in the mobile app. Try pasting a QRIS code below.";
        pluginAvailable = false;
      } else {
        error = msg || "Scanning failed. Check camera permissions.";
      }
    } finally {
      scanning = false;
    }
  }

  function retry() { error = ""; result = null; pluginAvailable = true; handleScan(); }

  async function handleManualSubmit() {
    if (!manualInput.trim()) return;
    try {
      const d = await parseQrisManual(manualInput.trim());
      result = d;
    } catch {
      error = "Invalid QRIS code";
    }
  }

  function handleConfirm() {
    if (!result) return;
    onClose?.();
    goto(result.deeplink);
  }

  function handleClose() { onClose?.(); }
</script>

{#if visible}
  <div class="backdrop" class:show={transitioning} onclick={handleClose} role="presentation"></div>
  <div class="sheet" class:show={transitioning}>
    <div class="handle"></div>

    <div class="body">
      <h2 class="title headline-md">Scan QRIS</h2>

      {#if error && !result}
        <div class="error-box">
          <p class="error-text">{error}</p>
          {#if !pluginAvailable}
            <p class="error-hint">Use the manual input below instead</p>
          {:else}
            <button class="retry-btn" onclick={retry}>Try Again</button>
          {/if}
        </div>
      {:else if result}
        <div class="result-card">
          <div class="result-badge" class:tng={result.code_type === "tng"}>
            {result.code_type === "tng" ? "TNG" : "QRIS"}
          </div>
          <div class="result-row">
            <span class="result-label">Merchant</span>
            <span class="result-value">{result.merchant}</span>
          </div>
          {#if result.amount}
            <div class="result-row">
              <span class="result-label">Amount</span>
              <span class="result-value">Rp {result.amount.toLocaleString("id-ID")}</span>
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
        <div class="scan-placeholder">
          <div class="scanner-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7V5a2 2 0 012-2h2" /><path d="M17 3h2a2 2 0 012 2v2" /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path d="M7 21H5a2 2 0 01-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" />
            </svg>
          </div>
          <p class="hint">Tap below to open the camera scanner</p>
          <button class="scan-btn" onclick={handleScan} disabled={scanning}>
            {scanning ? "Opening camera..." : "Scan QRIS Code"}
          </button>
        </div>
      {/if}

      <div class="divider-line"></div>

      <div class="manual-section">
        <span class="manual-label">Or paste QRIS code manually</span>
        <div class="manual-row">
          <input class="manual-input" type="text" placeholder="Paste QRIS string..."
            bind:value={manualInput}
            onkeydown={(e) => { if (e.key === 'Enter') handleManualSubmit() }} />
          <button class="manual-btn" onclick={handleManualSubmit} disabled={!manualInput.trim()}>Parse</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 14000; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.25s ease-out; }
  :global(.dark) .backdrop { background: rgba(0,0,0,0.5); }
  .backdrop.show { opacity: 1; }

  .sheet {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 14001;
    background: var(--deneb-surface); border-radius: 16px 16px 0 0;
    transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); max-height: 90dvh; overflow-y: auto;
  }
  .sheet.show { transform: translateY(0); }

  .handle { width: 36px; height: 4px; border-radius: 2px; background: #E5E5E5; margin: 10px auto 6px; }
  :global(.dark) .handle { background: #48484A; }

  .body { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 4px 24px 32px; }
  .title { margin: 0; }

  .scan-placeholder { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 0; }
  .scanner-icon { color: var(--deneb-text-muted); opacity: 0.6; }
  .hint { font-family: 'Geist Sans', sans-serif; font-size: 14px; color: var(--deneb-text-secondary); margin: 0; text-align: center; }

  .scan-btn {
    height: 48px; padding: 0 32px; border: none; border-radius: 8px;
    background: #111111; color: #FFFFFF;
    font-family: 'Geist Sans', sans-serif; font-size: 15px; font-weight: 500;
    cursor: pointer; transition: opacity 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  :global(.dark) .scan-btn { background: #ECECEC; color: #18181A; }
  .scan-btn:disabled { opacity: 0.4; cursor: default; }
  .scan-btn:active:not(:disabled) { opacity: 0.85; }

  .error-box { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px; }
  .error-text { font-family: 'Geist Sans', sans-serif; font-size: 14px; color: var(--deneb-negative); margin: 0; text-align: center; }
  .error-hint { font-family: 'Geist Sans', sans-serif; font-size: 12px; color: var(--deneb-text-secondary); margin: 0; }
  .retry-btn {
    padding: 8px 20px; border: 1px solid var(--deneb-border); border-radius: 8px;
    background: transparent; font-family: 'Geist Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--f7-page-text-color); cursor: pointer;
  }
  .retry-btn:active { background: var(--deneb-divider); }

  .divider-line { width: 100%; height: 1px; background: var(--deneb-border); }

  .manual-section { width: 100%; display: flex; flex-direction: column; gap: 8px; }
  .manual-label { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 500; color: var(--deneb-text-secondary); text-align: center; }
  .manual-row { display: flex; gap: 8px; }
  .manual-input {
    flex: 1; height: 44px; padding: 0 14px;
    border: 1px solid var(--deneb-border); border-radius: 8px;
    font-family: 'Geist Sans', sans-serif; font-size: 14px;
    color: var(--f7-page-text-color); background: var(--deneb-canvas);
    outline: none; box-sizing: border-box;
  }
  .manual-input:focus { border-color: var(--deneb-text-secondary); }
  .manual-input::placeholder { color: var(--deneb-text-muted); }
  .manual-btn {
    height: 44px; padding: 0 16px; border: none; border-radius: 8px;
    background: #111111; color: #FFFFFF;
    font-family: 'Geist Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer;
  }
  :global(.dark) .manual-btn { background: #ECECEC; color: #18181A; }
  .manual-btn:disabled { opacity: 0.35; }

  .result-card {
    width: 100%; display: flex; flex-direction: column; gap: 12px;
    padding: 20px; background: var(--deneb-canvas);
    border: 1px solid var(--deneb-border); border-radius: 10px;
    position: relative;
  }
  .result-badge {
    position: absolute; top: 12px; right: 12px;
    padding: 3px 10px; border-radius: 9999px;
    font-family: 'Geist Mono', monospace; font-size: 10px; font-weight: 600;
    letter-spacing: 0.06em;
    background: #111111; color: #FFFFFF;
  }
  :global(.dark) .result-badge { background: #ECECEC; color: #18181A; }
  .result-badge.tng { background: var(--deneb-info); color: #FFFFFF; }
  :global(.dark) .result-badge.tng { background: var(--deneb-info-bg); color: var(--deneb-info); }

  .result-row { display: flex; justify-content: space-between; align-items: center; }
  .result-label { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 500; color: var(--deneb-text-secondary); }
  .result-value { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; color: var(--f7-page-text-color); }

  .result-actions { display: flex; gap: 10px; margin-top: 4px; }
  .result-btn { flex: 1; height: 44px; border-radius: 8px; border: none; font-family: 'Geist Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; }
  .result-btn.primary { background: #111111; color: #FFFFFF; }
  :global(.dark) .result-btn.primary { background: #ECECEC; color: #18181A; }
  .result-btn.secondary { border: 1px solid var(--deneb-border); background: transparent; color: var(--f7-page-text-color); }
  .result-btn.secondary:active { background: var(--deneb-divider); }
</style>

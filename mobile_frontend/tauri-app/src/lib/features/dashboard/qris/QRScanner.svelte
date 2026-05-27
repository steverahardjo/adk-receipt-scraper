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
    let error = $state("");
    let manualInput = $state("");
    let result = $state<QrisData | null>(null);

    $effect(() => {
        if (opened) {
            visible = true;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    transitioning = true;
                });
            });
        } else {
            transitioning = false;
            setTimeout(() => {
                visible = false;
                result = null;
                error = "";
                manualInput = "";
            }, 250);
        }
    });

    async function handleScan() {
        scanning = true;
        error = "";
        result = null;

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
            scanning = false;
        } catch (e) {
            scanning = false;
            const msg = e instanceof Error ? e.message : "";
            if (msg.includes("cancelled") || msg.includes("Closed")) {
                return;
            }
            error = msg || "Scanning failed or was cancelled";
        }
    }

    function retry() {
        error = "";
        result = null;
        handleScan();
    }

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

    function handleClose() {
        onClose?.();
    }
</script>

{#if visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="backdrop"
        class:show={transitioning}
        onclick={handleClose}
        role="presentation"
    ></div>
    <div class="sheet" class:show={transitioning}>
        <div class="handle"></div>

        <div class="body">
            <h2 class="title headline-md">Scan QRIS</h2>

            {#if error && !result}
                <div class="error-box">
                    <p class="error-text">{error}</p>
                    <button class="retry-btn" onclick={retry}>Try Again</button>
                </div>

                <div class="manual-section">
                    <span class="manual-label">Or paste QRIS code manually</span
                    >
                    <div class="manual-row">
                        <input
                            class="manual-input"
                            type="text"
                            placeholder="Paste QRIS string..."
                            bind:value={manualInput}
                        />
                        <button
                            class="manual-btn"
                            onclick={handleManualSubmit}
                            disabled={!manualInput.trim()}>Parse</button
                        >
                    </div>
                </div>
            {:else if result}
                <div class="result-card">
                    <div
                        class="result-badge"
                        class:tng={result.code_type === "tng"}
                    >
                        {result.code_type === "tng" ? "TNG" : "QRIS"}
                    </div>
                    <div class="result-row">
                        <span class="result-label">Merchant</span>
                        <span class="result-value">{result.merchant}</span>
                    </div>
                    {#if result.amount}
                        <div class="result-row">
                            <span class="result-label">Amount</span>
                            <span class="result-value"
                                >Rp {result.amount.toLocaleString(
                                    "id-ID",
                                )}</span
                            >
                        </div>
                    {/if}
                    {#if result.reference}
                        <div class="result-row">
                            <span class="result-label">Reference</span>
                            <span class="result-value">{result.reference}</span>
                        </div>
                    {/if}
                    <div class="result-actions">
                        <button class="result-btn secondary" onclick={retry}
                            >Re-scan</button
                        >
                        <button
                            class="result-btn primary"
                            onclick={handleConfirm}>Fill Expense</button
                        >
                    </div>
                </div>
            {:else}
                <div class="scan-placeholder">
                    <div class="scanner-icon">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M3 7V5a2 2 0 012-2h2" /><path
                                d="M17 3h2a2 2 0 012 2v2"
                            /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path
                                d="M7 21H5a2 2 0 01-2-2v-2"
                            /><line x1="7" y1="12" x2="17" y2="12" />
                        </svg>
                    </div>
                    <p class="hint">Tap the button below to open the camera</p>
                    <button
                        class="scan-btn"
                        onclick={handleScan}
                        disabled={scanning}
                    >
                        {scanning ? "Opening camera..." : "Scan QRIS Code"}
                    </button>
                </div>

                <div class="manual-section">
                    <span class="manual-label">Or paste QRIS code manually</span
                    >
                    <div class="manual-row">
                        <input
                            class="manual-input"
                            type="text"
                            placeholder="Paste QRIS string..."
                            bind:value={manualInput}
                        />
                        <button
                            class="manual-btn"
                            onclick={handleManualSubmit}
                            disabled={!manualInput.trim()}>Parse</button
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        inset: 0;
        z-index: 14000;
        background: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.25s ease-out;
    }
    :global(.dark) .backdrop {
        background: rgba(0, 0, 0, 0.6);
    }
    .backdrop.show {
        opacity: 1;
    }

    .sheet {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 14001;
        background: #fff;
        border-radius: 20px 20px 0 0;
        transform: translateY(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
        max-height: 90dvh;
        overflow-y: auto;
    }
    :global(.dark) .sheet {
        background: #1c1c1e;
    }
    .sheet.show {
        transform: translateY(0);
    }

    .handle {
        width: 40px;
        height: 5px;
        border-radius: 3px;
        background: #d1d1d6;
        margin: 10px auto 6px;
    }
    :global(.dark) .handle {
        background: #48484a;
    }

    .body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 4px 24px 32px;
    }

    .title {
        margin: 0;
    }

    .scan-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 24px 0;
    }
    .scanner-icon {
        color: #6b7b72;
        opacity: 0.5;
    }

    .scan-btn {
        height: 48px;
        padding: 0 32px;
        border: none;
        border-radius: 12px;
        background: #006c50;
        color: #fff;
        font-family: "Manrope", sans-serif;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
        -webkit-tap-highlight-color: transparent;
    }
    :global(.dark) .scan-btn {
        background: #24e0ab;
        color: #1a1c1e;
    }
    .scan-btn:disabled {
        opacity: 0.5;
        cursor: default;
    }
    .scan-btn:active:not(:disabled) {
        opacity: 0.8;
    }

    .hint {
        font-family: "Manrope", sans-serif;
        font-size: 14px;
        color: #6b7b72;
        margin: 0;
        text-align: center;
    }

    .error-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 20px;
    }
    .error-text {
        font-family: "Manrope", sans-serif;
        font-size: 14px;
        color: #ba1a1a;
        margin: 0;
        text-align: center;
    }
    .retry-btn {
        padding: 8px 20px;
        border: 1px solid #006c50;
        border-radius: 20px;
        background: none;
        font-family: "Manrope", sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #006c50;
        cursor: pointer;
    }
    :global(.dark) .retry-btn {
        border-color: #24e0ab;
        color: #24e0ab;
    }

    .manual-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .manual-label {
        font-family: "Public Sans", sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: #6b7b72;
        text-align: center;
    }
    .manual-row {
        display: flex;
        gap: 8px;
    }
    .manual-input {
        flex: 1;
        height: 44px;
        padding: 0 14px;
        border: 1.5px solid transparent;
        border-radius: 10px;
        font-family: "Manrope", sans-serif;
        font-size: 14px;
        color: #1a1c1e;
        background: #f0f9f8;
        outline: none;
        box-sizing: border-box;
    }
    :global(.dark) .manual-input {
        background: #2f3133;
        color: #f0f0f3;
    }
    .manual-input:focus {
        border-color: #2ee5af;
    }
    .manual-btn {
        height: 44px;
        padding: 0 16px;
        border: none;
        border-radius: 10px;
        background: #006c50;
        color: #fff;
        font-family: "Manrope", sans-serif;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
    }
    :global(.dark) .manual-btn {
        background: #24e0ab;
        color: #1a1c1e;
    }
    .manual-btn:disabled {
        opacity: 0.4;
    }

    .result-card {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 20px;
        background: #f0f9f8;
        border-radius: 16px;
        position: relative;
    }
    :global(.dark) .result-card {
        background: rgba(36, 224, 171, 0.06);
    }
    .result-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 3px 10px;
        border-radius: 6px;
        font-family: "Manrope", sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        background: #006c50;
        color: #fff;
    }
    .result-badge.tng {
        background: #1a3a8a;
    }
    :global(.dark) .result-badge {
        background: #24e0ab;
        color: #1a1c1e;
    }
    :global(.dark) .result-badge.tng {
        background: #3b82f6;
        color: #fff;
    }
    :global(.dark) .result-card {
        background: rgba(36, 224, 171, 0.06);
    }

    .result-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .result-label {
        font-family: "Public Sans", sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: #6b7b72;
    }
    .result-value {
        font-family: "Manrope", sans-serif;
        font-size: 15px;
        font-weight: 700;
        color: #1a1c1e;
    }
    :global(.dark) .result-value {
        color: #f0f0f3;
    }

    .result-actions {
        display: flex;
        gap: 10px;
        margin-top: 4px;
    }
    .result-btn {
        flex: 1;
        height: 44px;
        border-radius: 10px;
        border: none;
        font-family: "Manrope", sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }
    .result-btn.primary {
        background: #006c50;
        color: #fff;
    }
    :global(.dark) .result-btn.primary {
        background: #24e0ab;
        color: #1a1c1e;
    }
    .result-btn.secondary {
        border: 1.5px solid rgba(0, 108, 80, 0.2);
        background: transparent;
        color: #006c50;
    }
    :global(.dark) .result-btn.secondary {
        border-color: rgba(36, 224, 171, 0.3);
        color: #24e0ab;
    }
</style>

<script>
    import { scan } from "@tauri-apps/plugin-barcode-scanner";
    import { Format } from "@tauri-apps/plugin-barcode-scanner";
    let scanResult = "";
    let errorMessage = "";

    async function handleScan() {
        try {
            // This opens the native camera UI overlay
            const result = await scan({
                // Specifying formats improves speed and accuracy
                formats: [Format.QRCode, Format.EAN13, Format.UPCA],
            });

            if (result) {
                scanResult = result.content;
                errorMessage = "";
            }
        } catch (e) {
            errorMessage = "Scanning canceled or failed.";
            console.error(e);
        }
    }
</script>

<main>
    <h2>Qris Scanner</h2>

    <button on:click={handleScan}> Scan Barcode </button>

    {#if scanResult}
        <div class="result">
            <strong>Scanned Value:</strong>
            {scanResult}
        </div>
    {/if}

    {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
    {/if}
</main>

<style>
    .result {
        margin-top: 20px;
        padding: 10px;
        background: #f4f4f4;
        border-radius: 8px;
    }
</style>

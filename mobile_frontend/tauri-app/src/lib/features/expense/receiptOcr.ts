export interface ReceiptFields {
  title?: string
  amount?: string
  date?: string
  description?: string
  confidence?: number
  raw?: string
}

/**
 * Recognise a receipt image and return structured fields.
 *
 * The Rust `ocr_receipt` command is the intended backend. Until it exists this
 * resolves to `null`, and the review UI lets the user fill the fields in
 * manually instead of failing.
 */
export async function recognizeReceipt(imageDataUrl: string): Promise<ReceiptFields | null> {
  try {
    const { invoke } = await import('@tauri-apps/api/core')
    const result = await invoke<ReceiptFields | null>('ocr_receipt', { image: imageDataUrl })
    return result ?? null
  } catch {
    return null
  }
}

import jsQR from 'jsqr'
import { invoke } from '@tauri-apps/api/core'
import type { QrisData } from './types'

export interface ScanCallbacks {
  onResult: (data: QrisData) => void
  onError: (msg: string) => void
  onTick?: () => void
}

export async function startScanning(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  callbacks: ScanCallbacks,
  signal?: AbortSignal,
) {
  let stream: MediaStream | null = null

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: 640, height: 480 },
    })
    video.srcObject = stream
    await video.play()

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    const scanLoop = () => {
      if (signal?.aborted) return cleanup(stream)

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          cleanup(stream)
          decodeQris(code.data, callbacks)
          return
        }
      }

      callbacks.onTick?.()
      requestAnimationFrame(scanLoop)
    }

    requestAnimationFrame(scanLoop)
  } catch (err) {
    cleanup(stream)
    callbacks.onError(err instanceof Error ? err.message : 'Camera access denied')
  }
}

async function decodeQris(raw: string, callbacks: ScanCallbacks) {
  try {
    const data = await invoke<QrisData>('parse_qris', { payload: raw })
    callbacks.onResult(data)
  } catch (err) {
    callbacks.onError(err instanceof Error ? err.message : 'Failed to parse QRIS')
  }
}

export async function parseQrisManual(payload: string): Promise<QrisData> {
  return invoke<QrisData>('parse_qris', { payload })
}

function cleanup(stream: MediaStream | null) {
  if (stream) {
    for (const track of stream.getTracks()) track.stop()
  }
}

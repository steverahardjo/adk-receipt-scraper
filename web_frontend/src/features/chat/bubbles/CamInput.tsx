'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  onSend: (file: File) => void
  onCancel: () => void
}

export default function CameraInput({ onSend, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [capturedFile, setCapturedFile] = useState<File | null>(null)

  // start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // mobile rear camera
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
      onCancel()
    }
  }

  useEffect(() => {
    startCamera()

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const capture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) return

      const file = new File([blob], 'photo.png', {
        type: 'image/png',
      })

      setCapturedFile(file)

      // stop camera after capture
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }, 'image/png')
  }

  const retake = async () => {
    setCapturedFile(null)
    await startCamera()
  }

  const confirm = () => {
    if (!capturedFile) return
    onSend(capturedFile)
  }

  return (
    <div className="space-y-3">
      {capturedFile ? (
        <>
          <img
            src={URL.createObjectURL(capturedFile)}
            className="w-full rounded-xl object-cover"
          />

          <div className="flex gap-2">
            <button onClick={retake} className="flex-1 border rounded p-2">
              Retake
            </button>

            <button
              onClick={confirm}
              className="flex-1 bg-black text-white rounded p-2"
            >
              Use Photo
            </button>
          </div>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-xl bg-black"
          />

          <div className="flex gap-2">
            <button
              onClick={capture}
              className="flex-1 bg-black text-white rounded p-2"
            >
              Capture
            </button>

            <button onClick={onCancel} className="flex-1 border rounded p-2">
              Cancel
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

type Props = {
  onSend: (file: File) => void
  onCancel: () => void
}

export default function CameraInput({ onSend, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null)

  // open camera once on mount
  useEffect(() => {
    async function init() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        setStream(mediaStream)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error(err)
      }
    }

    init()

    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function capture() {
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

      const file = new File([blob], 'photo.png', { type: 'image/png' })

      // preview
      const url = URL.createObjectURL(blob)
      setCapturedUrl(url)

      // cache locally
      localStorage.setItem('last_capture', url)

      // stop camera after capture
      stream?.getTracks().forEach((t) => t.stop())
    }, 'image/png')
  }

  function retake() {
    setCapturedUrl(null)
    // reopen camera
    navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    })
  }

  function confirm() {
    if (!capturedUrl) return

    fetch(capturedUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'photo.png', { type: 'image/png' })
        onSend(file)
      })
  }

  return (
    <div className="space-y-3">
      {/* PREVIEW MODE */}
      {capturedUrl ? (
        <>
          <img src={capturedUrl} className="w-full rounded-xl object-cover" />

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
          {/* LIVE CAMERA */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-xl"
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

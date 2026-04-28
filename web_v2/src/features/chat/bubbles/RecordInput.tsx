'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LiveWaveform } from '@/components/ui/live-waveform'
import { appToast } from '@/lib/toast'

type Props = {
  onSend: (blob: Blob) => void
  onCancel: () => void
  initialBlob?: Blob
}

export default function RecordInput({ onSend, onCancel, initialBlob }: Props) {
  const [active, setActive] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // load external blob
  useEffect(() => {
    if (initialBlob) {
      const url = URL.createObjectURL(initialBlob)
      setAudioUrl(url)
    }
  }, [initialBlob])

  const startRecording = async () => {
    if (active) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onerror = () => {
        appToast.error('Recording failed')
        cleanup()
      }

      recorder.onstop = () => {
        if (chunksRef.current.length === 0) {
          appToast.error('No audio recorded')
          cleanup()
          return
        }

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)

        setAudioUrl(url)
        onSend(blob)
        cleanup()
      }

      recorder.start()
      setActive(true)
    } catch (err: any) {
      if (err?.name === 'NotAllowedError') {
        appToast.error('Microphone permission denied')
      } else if (err?.name === 'NotFoundError') {
        appToast.error('No microphone found')
      } else {
        appToast.error('Failed to access microphone')
      }
    }
  }

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return

    try {
      mediaRecorderRef.current.stop()
      setActive(false)
    } catch {
      appToast.error('Failed to stop recording')
      cleanup()
    }
  }

  const cleanup = () => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    } catch {
      // ignore
    }

    streamRef.current = null
    mediaRecorderRef.current = null
    chunksRef.current = []
    setActive(false)
  }

  const handleCancel = () => {
    try {
      if (active) mediaRecorderRef.current?.stop()
      cleanup()
      onCancel()
    } catch {
      appToast.error('Failed to cancel recording')
    }
  }

  useEffect(() => {
    return () => cleanup()
  }, [])

  return (
    <div className="space-y-4">
      {/* waveform */}
      <LiveWaveform active={active} processing={false} height={80} />

      {/* preview */}
      {audioUrl && (
        <audio controls className="w-full">
          <source src={audioUrl} type="audio/webm" />
        </audio>
      )}

      {/* controls */}
      <div className="flex justify-center gap-2">
        {!active ? (
          <Button onClick={startRecording}>Record</Button>
        ) : (
          <Button onClick={stopRecording}>Stop</Button>
        )}

        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

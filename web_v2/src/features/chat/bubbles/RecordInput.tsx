'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Square, Trash2, Send, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LiveWaveform } from '@/components/ui/live-waveform'
import { appToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

type Props = {
  onSend: (blob: Blob) => void
  onCancel: () => void
  initialBlob?: Blob
}

export default function RecordInput({ onSend, onCancel, initialBlob }: Props) {
  const [active, setActive] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer logic
  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []
      setDuration(0)
      setAudioUrl(null)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordedBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        cleanup()
      }

      recorder.start()
      setActive(true)
    } catch (err: any) {
      appToast.error('Could not access microphone')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setActive(false)
  }

  const cleanup = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    mediaRecorderRef.current = null
  }

  const handleReset = () => {
    setAudioUrl(null)
    setRecordedBlob(null)
    setDuration(0)
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-card rounded-2xl shadow-sm border">
      {/* HEADER / TIMER */}
      <div className="flex flex-col items-center gap-1">
        <span
          className={cn(
            'text-2xl font-mono font-semibold transition-colors',
            active ? 'text-red-500 animate-pulse' : 'text-foreground',
          )}
        >
          {formatTime(duration)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          {active
            ? 'Recording...'
            : audioUrl
              ? 'Review Recording'
              : 'Ready to Record'}
        </span>
      </div>

      {/* WAVEFORM VISUALIZER */}
      <div className="w-full bg-muted/30 rounded-xl p-4 border border-dashed">
        <LiveWaveform active={active} processing={false} height={60} />
      </div>

      {/* AUDIO PREVIEW PLAYER */}
      {audioUrl && (
        <div className="w-full px-2">
          <audio
            controls
            className="w-full h-10 filter sepia-[.1] saturate-[.5]"
          >
            <source src={audioUrl} type="audio/webm" />
          </audio>
        </div>
      )}

      {/* CONTROLS */}
      <div className="flex items-center justify-between w-full max-w-[280px]">
        {/* DELETE / CANCEL */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={audioUrl ? handleReset : onCancel}
        >
          {audioUrl ? <RotateCcw size={22} /> : <Trash2 size={22} />}
        </Button>

        {/* PRIMARY ACTION (RECORD / STOP) */}
        <div className="relative">
          {!active && !audioUrl ? (
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
              onClick={startRecording}
            >
              <Mic size={28} className="text-white" />
            </Button>
          ) : active ? (
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-foreground hover:bg-foreground/90 shadow-lg transition-all animate-in zoom-in"
              onClick={stopRecording}
            >
              <Square size={24} className="fill-background text-background" />
            </Button>
          ) : (
            <div className="h-16 w-16" /> // Spacer for layout consistency
          )}
        </div>

        {/* SEND ACTION */}
        <Button
          variant="default"
          size="icon"
          disabled={!recordedBlob || active}
          className={cn(
            'h-12 w-12 rounded-full transition-all',
            recordedBlob
              ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
              : 'bg-muted text-muted-foreground',
          )}
          onClick={() => recordedBlob && onSend(recordedBlob)}
        >
          <Send size={22} />
        </Button>
      </div>
    </div>
  )
}

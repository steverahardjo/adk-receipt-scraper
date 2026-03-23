import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react'
import { FilePreview } from './file-preview'
import { VoiceNotePreview } from './voice-note-preview'
import { RecordingIndicator } from './recording-indicator'

interface ChatInputProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  selectedFile: File | null
  filePreview: string | null
  onFileRemove: () => void
  onFileSelect: (file: File) => void
  isRecording: boolean
  recordingTime: number
  audioBlob: Blob | null
  onStartRecording: () => void
  onStopRecording: () => void
  onCancelRecording: () => void
  onSendAudioNote: () => void
  status: string
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  selectedFile,
  filePreview,
  onFileRemove,
  onFileSelect,
  isRecording,
  recordingTime,
  audioBlob,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  onSendAudioNote,
  status,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
    e.target.value = ''
  }

  const showRecordingControls = isRecording || !!audioBlob

  return (
    <div className="flex-shrink-0 border-t bg-background p-3 sm:p-4">
      <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-2">
        {selectedFile && (
          <FilePreview file={selectedFile} previewUrl={filePreview} onRemove={onFileRemove} />
        )}

        {audioBlob && !isRecording && (
          <VoiceNotePreview onSend={onSendAudioNote} onCancel={() => onFileRemove()} disabled={status === 'streaming'} />
        )}

        {isRecording && (
          <RecordingIndicator
            recordingTime={recordingTime}
            onStop={onStopRecording}
            onCancel={onCancelRecording}
          />
        )}

        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*,audio/*" onChange={onFileChange} className="hidden" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-12 w-12 shrink-0 sm:h-10 sm:w-10"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === 'streaming' || isRecording}
          >
            <Paperclip className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={isRecording ? 'Recording...' : 'Type a message...'}
            disabled={status === 'streaming' || isRecording}
            className="h-12 flex-1 text-base sm:text-sm"
          />

          {showRecordingControls ? (
            <Button
              type="button"
              size="icon"
              className="h-12 w-12 shrink-0 sm:h-10 sm:w-10 bg-primary hover:bg-primary/90"
              onClick={isRecording ? onStopRecording : onSendAudioNote}
              disabled={status === 'streaming'}
            >
              {isRecording ? <StopCircle className="h-5 w-5 sm:h-4 sm:w-4" /> : <Send className="h-5 w-5 sm:h-4 sm:w-4" />}
              <span className="sr-only">{isRecording ? 'Stop' : 'Send'}</span>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-12 w-12 shrink-0 sm:h-10 sm:w-10"
                onClick={onStartRecording}
                disabled={status === 'streaming'}
              >
                <Mic className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="sr-only">Record voice</span>
              </Button>

              <Button
                type="submit"
                disabled={status === 'streaming' || (!input.trim() && !selectedFile)}
                size="icon"
                className="h-12 w-12 shrink-0 sm:h-10 sm:w-10"
              >
                <Send className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

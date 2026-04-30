import { Aperture } from 'lucide-react'

interface OCRButtonProps {
  onOpen: () => void
  loading?: boolean
}

export function OCRButton({ onOpen, loading }: OCRButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="h-12 w-12 rounded-full flex items-center justify-center border bg-background hover:bg-muted transition"
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <Aperture className="w-5 h-5" />
      )}
    </button>
  )
}

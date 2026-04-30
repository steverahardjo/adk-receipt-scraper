import CameraInput from '@/features/chat/bubbles/CamInput'

export function OCRCameraModal({ open, onClose, onSend }: any) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-background w-full max-w-lg rounded-xl shadow-lg p-4">
        <CameraInput onSend={onSend} onCancel={onClose} />
      </div>
    </div>
  )
}

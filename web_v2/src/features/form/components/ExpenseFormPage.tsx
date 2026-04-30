'use client'

import { useState } from 'react'
import { ExpenseFormCard } from './ExpenseFormCard'

import { useExpenseForm } from '@/hooks/use_form'

export default function ExpenseFormPage() {
  const { form, onSubmit, isSubmitting, runOCR } = useExpenseForm()

  const [cameraOpen, setCameraOpen] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)

  const handleOCR = async (file: File) => {
    setOcrLoading(true)
    try {
      await runOCR(file)
      setCameraOpen(false)
    } finally {
      setOcrLoading(false)
    }
  }

  return (
    <ExpenseFormCard
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      cameraOpen={cameraOpen}
      setCameraOpen={setCameraOpen}
      onOCR={handleOCR}
      ocrLoading={ocrLoading}
    />
  )
}

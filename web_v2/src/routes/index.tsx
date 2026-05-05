import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import BaseLayer from '#/components/BaseLayer'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [open, setOpen] = useState(false)

  return <BaseLayer>Hello welcome</BaseLayer>
}

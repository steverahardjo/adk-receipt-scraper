import { createFileRoute } from '@tanstack/react-router'
import BaseLayer from '#/components/BaseLayer'
import RecurringPage from '../features/recurring/RecurringPage'

export const Route = createFileRoute('/recurring')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <BaseLayer>
      <RecurringPage />
    </BaseLayer>
  )
}

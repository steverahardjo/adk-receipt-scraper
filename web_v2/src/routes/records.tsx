import { createFileRoute } from '@tanstack/react-router'
import Ledger from '../features/records/LedgerPage'
import { generateEntries } from '../features/records/mock_data'
import BaseLayer from '#/components/BaseLayer'
export const Route = createFileRoute('/records')({
  loader: async () => {
    return {
      data: generateEntries(100000),
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = Route.useLoaderData()

  return (
    <BaseLayer>
      <Ledger data={data} />
    </BaseLayer>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { LedgerView } from '../features/records/RecordsTable'
import { generateEntries } from '../features/records/mock_data'

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
  return <LedgerView data={data} />
}

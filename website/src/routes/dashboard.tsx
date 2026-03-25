import { createFileRoute } from '@tanstack/react-router'
import { BasicProfile } from '@/components/dashboard/Basicprofile'
import type { Profile } from '@/schema'

// 1. Mock Data (The "Test" data)
const MOCK_PROFILE: Profile = {
  nickname: 'CapitalistCat',
  moneySource: 'Software Engineering',
  currentMonthSpending: 2450.5,
  monthBudget: 4000,
  ownedAssets: {
    currentSaving: 12500,
    emergencyFund: 8000,
    assets: [
      { name: 'Bitcoin', description: 'HODL' },
      { name: 'Vintage Watch', description: 'Rolex Submariner' },
    ],
  },
}

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Financial Overview
          </h2>
          <BasicProfile {...MOCK_PROFILE} />
        </div>
      </header>
    </div>
  )
}

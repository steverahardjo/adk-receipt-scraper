'use client'

import { useMemo, useState } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { generateCashFlow, generateCashFlowDays } from './types'

export default function CashFlowChart() {
  const [mode, setMode] = useState<'month' | 'day'>('month')

  const monthData = useMemo(() => generateCashFlow(), [])
  const dayData = useMemo(() => generateCashFlowDays(), [])

  const data = (mode === 'month' ? monthData : dayData) as any[]
  const keys = ['income', 'expense']
  const indexBy = mode === 'month' ? 'month' : 'day'

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Cash Flow
        </span>
        <div className="flex border rounded-md overflow-hidden text-[11px]">
          {(['month', 'day'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2 py-0.5 font-medium transition-colors ${
                mode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground'
              }`}
            >
              {m === 'month' ? 'Month' : 'Day'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 sm:h-56">
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy={indexBy}
          margin={{ top: 8, right: 8, bottom: 24, left: 48 }}
          padding={0.25}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          colors={['#3d8a7a', '#c97a6b']}
          borderRadius={4}
          borderWidth={0}
          enableGridY={false}
          enableLabel={false}
          axisBottom={{
            tickSize: 0,
            tickPadding: 6,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 6,
            tickValues: 3,
            format: (v: number) => `Rp${(v / 1_000_000).toFixed(0)}M`,
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top-right',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -20,
              itemsSpacing: 12,
              itemWidth: 60,
              itemHeight: 14,
              itemTextColor: '#7a706a',
              symbolSize: 8,
              symbolShape: 'circle',
            },
          ]}
          theme={{
            background: 'transparent',
            text: { fill: '#7a706a', fontSize: 11 },
            axis: {
              ticks: { line: { stroke: 'transparent' }, text: { fill: '#7a706a' } },
            },
          }}
        />
      </div>
    </div>
  )
}

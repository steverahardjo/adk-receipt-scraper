'use client'

import { useMemo, useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import type { NetWorthDataPoint, NetWorthEvent } from './types'

type Range = '1M' | '3M' | '6M' | '1Y'

type Props = {
  data: NetWorthDataPoint[]
  events: NetWorthEvent[]
}

export default function NetWorthLineChart({ data, events }: Props) {
  const [range, setRange] = useState<Range>('6M')
  const [showOverlay, setShowOverlay] = useState(false)

  const rangeLen: Record<Range, number> = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12 }

  const sliced = useMemo(() => {
    const n = rangeLen[range]
    return data.slice(-n)
  }, [data, range])

  const chartData = useMemo(() => {
    const lines: { id: string; data: { x: string; y: number }[]; color?: string }[] = [
      {
        id: 'Net Worth',
        data: sliced.map((p) => ({ x: p.date, y: p.netWorth })),
      },
    ]
    if (showOverlay) {
      lines.push({
        id: 'Assets',
        data: sliced.map((p) => ({ x: p.date, y: p.assets })),
        color: '#3d8a7a',
      })
      lines.push({
        id: 'Liabilities',
        data: sliced.map((p) => ({ x: p.date, y: p.liabilities })),
        color: '#c97a6b',
      })
    }
    return lines
  }, [sliced, showOverlay])

  const visibleDates = new Set(sliced.map((p) => p.date))
  const markers = useMemo(
    () =>
      events
        .filter((e) => visibleDates.has(e.date))
        .map((e) => ({
          axis: 'x' as const,
          value: e.date,
          lineStyle: {
            stroke: '#c4904a',
            strokeWidth: 1,
            strokeDasharray: '4 4',
            strokeOpacity: 0.4,
          },
        })),
    [events, visibleDates],
  )

  const latest = sliced[sliced.length - 1]
  const changePct =
    sliced.length >= 2
      ? (((sliced[sliced.length - 1].netWorth - sliced[0].netWorth) / sliced[0].netWorth) * 100).toFixed(1)
      : '0'

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
        <div>
          <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Net Worth
          </span>
          {latest && (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                Rp {latest.netWorth.toLocaleString()}
              </span>
              <span
                className={`text-xs font-medium ${
                  Number(changePct) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {changePct}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={() => setShowOverlay(!showOverlay)}
              className="accent-primary w-3 h-3"
            />
            Assets/Liab
          </label>

          <div className="flex border rounded-md overflow-hidden text-[11px]">
            {(['1M', '3M', '6M', '1Y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-0.5 font-medium transition-colors ${
                  range === r
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72">
        <ResponsiveLine
          data={chartData}
          margin={{ top: 8, right: 20, bottom: 28, left: 56 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          curve="monotoneX"
          markers={markers}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: 4,
            format: (v: number) => {
              if (v >= 1_000_000_000) return `Rp${(v / 1_000_000_000).toFixed(1)}B`
              if (v >= 1_000_000) return `Rp${(v / 1_000_000).toFixed(0)}M`
              return `Rp${(v / 1_000).toFixed(0)}K`
            },
          }}
          enableGridY={false}
          enableGridX={false}
          enablePoints
          pointSize={5}
          pointColor="#faf8f5"
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableArea={!showOverlay}
          areaBaselineValue={0}
          areaOpacity={0.08}
          colors={(d) => d.color ?? '#c4904a'}
          lineWidth={2.5}
          enableSlices="x"
          crosshairType="bottom"
          useMesh
          sliceTooltip={({ slice }) => {
            if (!slice.points.length) return null
            return (
              <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-sm">
                {slice.points.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: String(p.seriesColor) }}
                    />
                    <span className="font-medium text-foreground">
                      {p.seriesId}
                    </span>
                    <span className="tabular-nums text-foreground">
                      Rp {Number(p.data.y).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )
          }}
          theme={{
            background: 'transparent',
            text: { fill: '#7a706a', fontSize: 11 },
            axis: {
              ticks: { line: { stroke: 'transparent' }, text: { fill: '#7a706a' } },
            },
            crosshair: {
              line: { stroke: '#c4904a', strokeWidth: 1, strokeOpacity: 0.25 },
            },
          }}
        />
      </div>
    </div>
  )
}

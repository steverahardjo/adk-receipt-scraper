'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Entry } from './types'
import FlowChart from './FlowChart'
import SummaryBar from './SummaryBar'

/* ------------------ columns ------------------ */

const columnHelper = createColumnHelper<Entry>()

const COLUMNS = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => format(info.getValue(), 'dd MMM yyyy'),
  }),

  columnHelper.accessor('title', {
    header: 'Title',
  }),

  columnHelper.display({
    id: 'type',
    header: 'Type',
    cell: ({ row }) =>
      row.original.flow === 'expense'
        ? row.original.type || '—'
        : row.original.source || '—',
  }),

  columnHelper.display({
    id: 'payment',
    header: 'Payment',
    cell: ({ row }) =>
      row.original.flow === 'expense' ? row.original.paymentMethod || '—' : '—',
  }),

  columnHelper.display({
    id: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const e = row.original
      const isIncome = e.flow === 'income'

      return (
        <span
          className={`font-semibold tabular-nums ${
            isIncome ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {isIncome ? '+' : '-'} Rp {e.amount.toLocaleString()}
        </span>
      )
    },
  }),
]

const HIDE_MOBILE = new Set(['type', 'payment'])

const COL_WIDTHS = [
  { w: '18%', hideMobile: false },
  { w: '28%', hideMobile: false },
  { w: '0%', hideMobile: true },
  { w: '0%', hideMobile: true },
  { w: 'auto', hideMobile: false },
]

type EntryDetailProps = {
  entry: Entry | null
  onClose: () => void
}

function EntryDetailDialog({ entry, onClose }: EntryDetailProps) {
  if (!entry) return null

  const isIncome = entry.flow === 'income'
  const link = entry.documentLink

  return (
    <Dialog open={!!entry} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                isIncome
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {isIncome ? 'Income' : 'Expense'}
            </span>
            <span className="text-[11px] sm:text-xs text-muted-foreground">
              {format(entry.date, 'dd MMM yyyy')}
            </span>
          </div>
          <DialogTitle className="mt-2 sm:mt-3 text-lg sm:text-xl leading-snug">
            {entry.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <span
              className={`text-2xl sm:text-3xl font-bold tabular-nums ${
                isIncome ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isIncome ? '+' : '-'}Rp {entry.amount.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-muted-foreground">Category</span>
              <p className="font-medium mt-0.5">
                {isIncome ? entry.source || '—' : entry.type || '—'}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">Payment</span>
              <p className="font-medium mt-0.5">
                {isIncome ? '—' : entry.paymentMethod || '—'}
              </p>
            </div>

            {entry.description && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Description</span>
                <p className="font-medium mt-0.5">{entry.description}</p>
              </div>
            )}
          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              View Document
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ------------------ main component ------------------ */

export default function Ledger({ data }: { data: Entry[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const [flowFilter, setFlowFilter] = useState<'all' | 'income' | 'expense'>(
    'all',
  )
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)

  /* -------- filtering -------- */

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (flowFilter !== 'all' && row.flow !== flowFilter) return false

      if (paymentFilter !== 'all') {
        if (row.flow !== 'expense') return false
        if (row.paymentMethod !== paymentFilter) return false
      }

      if (typeFilter !== 'all') {
        if (row.flow === 'expense') {
          if (row.type !== typeFilter) return false
        } else {
          if (row.source !== typeFilter) return false
        }
      }

      return true
    })
  }, [data, flowFilter, paymentFilter, typeFilter])

  /* -------- table -------- */

  const table = useReactTable({
    data: filtered,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  /* -------- filter options -------- */

  const paymentOptions = Array.from(
    new Set(data.map((d) => d.paymentMethod).filter(Boolean)),
  ) as string[]

  const typeOptions = Array.from(
    new Set(
      [...data.map((d) => d.type), ...data.map((d) => d.source)].filter(
        Boolean,
      ),
    ),
  ) as string[]

  /* -------- UI -------- */

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* SUMMARY */}
      <SummaryBar data={data} filtered={filtered} />

      {/* SANKEY FLOW CHART */}
      <FlowChart data={filtered} />

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex border rounded-lg sm:rounded-xl overflow-hidden">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFlowFilter(f)}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm capitalize font-medium transition-colors ${
                flowFilter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[130px] sm:w-[160px] h-8 sm:h-10 text-xs sm:text-sm">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            {paymentOptions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px] sm:w-[160px] h-8 sm:h-10 text-xs sm:text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {typeOptions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      <div className="rounded-xl sm:rounded-2xl border overflow-hidden">
        <div ref={parentRef} className="h-[50vh] sm:h-[600px] overflow-auto">
          <Table className="text-xs sm:text-sm">
            <colgroup>
              {COL_WIDTHS.map((c, i) => (
                <col
                  key={i}
                  style={{ width: c.w }}
                  className={c.hideMobile ? 'hidden md:table-column' : ''}
                />
              ))}
            </colgroup>

            <TableHeader className="sticky top-0 bg-background z-10 border-b">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className={
                        (HIDE_MOBILE.has(h.id) ? 'hidden md:table-cell' : '') +
                        ' h-8 px-1.5 sm:px-2 font-medium text-muted-foreground'
                      }
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((vRow) => {
                const row = rows[vRow.index]

                return (
                  <TableRow
                    key={row.id}
                    data-index={vRow.index}
                    ref={(node) => { if (node) rowVirtualizer.measureElement(node) }}
                    style={{
                      position: 'absolute',
                      transform: `translateY(${vRow.start}px)`,
                      width: '100%',
                      display: 'table',
                      tableLayout: 'fixed',
                    }}
                    className="border-b hover:bg-muted/40 cursor-pointer"
                    onClick={() => setSelectedEntry(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`px-1.5 sm:px-2 py-1 sm:py-1.5 ${
                          HIDE_MOBILE.has(cell.column.id)
                            ? 'hidden md:table-cell'
                            : ''
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ROW-CLICK DETAIL MODAL */}
      <EntryDetailDialog
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  )
}

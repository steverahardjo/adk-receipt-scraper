'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState, useMemo } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Calendar } from '@/components/ui/calendar'
import { isSameDay } from 'date-fns'

import type { Entry } from './types'

/* ------------------ columns ------------------ */

const columnHelper = createColumnHelper<Entry>()

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => info.getValue().toLocaleDateString(),
  }),

  columnHelper.accessor('title', {
    header: 'Title',
  }),

  columnHelper.display({
    id: 'category',
    header: 'Category',
    cell: ({ row }) =>
      row.original.flow === 'expense' ? row.original.type : '—',
  }),

  columnHelper.display({
    id: 'payment',
    header: 'Payment',
    cell: ({ row }) =>
      row.original.flow === 'expense' ? row.original.paymentMethod : '—',
  }),

  columnHelper.display({
    id: 'source',
    header: 'Source',
    cell: ({ row }) =>
      row.original.flow === 'income' ? row.original.source : '—',
  }),

  columnHelper.display({
    id: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const e = row.original

      return (
        <span
          className={
            e.flow === 'income'
              ? 'text-green-500 font-medium'
              : 'text-red-500 font-medium'
          }
        >
          {e.flow === 'income' ? '+' : '-'}Rp {e.amount.toLocaleString()}
        </span>
      )
    },
  }),
]

/* ------------------ main view ------------------ */

type LedgerViewProps = {
  data: Entry[]
}

export function LedgerView({ data }: LedgerViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const filtered = useMemo(() => {
    return data.filter((row) => (date ? isSameDay(row.date, date) : true))
  }, [data, date])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
      <Calendar mode="single" selected={date} onSelect={setDate} />

      <LedgerTable data={filtered} />
    </div>
  )
}

/* ------------------ table ------------------ */

type LedgerTableProps = {
  data: Entry[]
}

function LedgerTable({ data }: LedgerTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto rounded-2xl border">
      <Table className="relative">
        {/* header */}
        <TableHeader className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* body */}
        <TableBody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((vRow) => {
            const row = rows[vRow.index]
            const isIncome = row.original.flow === 'income'

            return (
              <TableRow
                key={row.id}
                ref={vRow.measureElement}
                className={
                  isIncome
                    ? 'bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500'
                    : 'border-l-4 border-transparent'
                }
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${vRow.start}px)`,
                  width: '100%',
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

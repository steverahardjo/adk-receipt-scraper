'use client'

import { useMemo } from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import type { Entry } from './types'

type Props = {
  data: Entry[]
}

type SankeyData = {
  nodes: { id: string }[]
  links: { source: string; target: string; value: number }[]
}

const PREFIX = { income: 'i_', expense: 'e_' }

function nid(kind: 'income' | 'expense', name: string) {
  return `${PREFIX[kind]}${name}`
}

function displayLabel(id: string) {
  if (id === 'Total Income' || id === 'Remaining' || id === 'Unused') return id
  return id.slice(2)
}

const NODE_COLORS: Record<string, string> = {
  'Total Income': '#c4904a',
  'Total Expenses': '#c4904a',
  Remaining: '#5baa8a',
  Unused: '#c4904a',
}

function buildSankeyData(entries: Entry[]): SankeyData {
  const incomeBySource = new Map<string, number>()
  const expenseByType = new Map<string, number>()
  let totalIncome = 0
  let totalExpense = 0

  for (const e of entries) {
    if (e.flow === 'income') {
      const src = e.source || 'Other'
      incomeBySource.set(src, (incomeBySource.get(src) || 0) + e.amount)
      totalIncome += e.amount
    } else {
      const t = e.type || 'Other'
      expenseByType.set(t, (expenseByType.get(t) || 0) + e.amount)
      totalExpense += e.amount
    }
  }

  const incomeKeys = [...incomeBySource.keys()]
  const expenseKeys = [...expenseByType.keys()]
  const hasIncome = incomeKeys.length > 0 && totalIncome > 0
  const hasExpense = expenseKeys.length > 0 && totalExpense > 0

  if (!hasIncome && !hasExpense) return { nodes: [], links: [] }

  const nodes: { id: string }[] = []
  const links: { source: string; target: string; value: number }[] = []

  if (hasIncome && hasExpense) {
    const savings = totalIncome - totalExpense

    for (const src of incomeKeys) nodes.push({ id: nid('income', src) })
    nodes.push({ id: 'Total Income' })
    for (const t of expenseKeys) nodes.push({ id: nid('expense', t) })
    if (savings > 0) nodes.push({ id: 'Remaining' })

    for (const [src, val] of incomeBySource) {
      links.push({ source: nid('income', src), target: 'Total Income', value: val })
    }

    const totalForExpenses = Math.min(totalIncome, totalExpense)
    for (const [t, val] of expenseByType) {
      const share = totalForExpenses > 0 ? val / totalForExpenses : 0
      const linkVal = Math.round(totalIncome * share)
      if (linkVal > 0)
        links.push({ source: 'Total Income', target: nid('expense', t), value: linkVal })
    }

    if (savings > 0) {
      links.push({ source: 'Total Income', target: 'Remaining', value: savings })
    }
  } else if (hasExpense) {
    nodes.push({ id: 'Total Expenses' })
    for (const t of expenseKeys) nodes.push({ id: nid('expense', t) })
    for (const [t, val] of expenseByType)
      links.push({ source: 'Total Expenses', target: nid('expense', t), value: val })
  } else {
    for (const src of incomeKeys) nodes.push({ id: nid('income', src) })
    nodes.push({ id: 'Unused' })
    for (const [src, val] of incomeBySource)
      links.push({ source: nid('income', src), target: 'Unused', value: val })
  }

  return { nodes, links }
}

export default function FlowChart({ data }: Props) {
  const sankeyData = useMemo(() => buildSankeyData(data), [data])

  if (sankeyData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-dashed text-muted-foreground text-sm">
        No transaction data to visualize
      </div>
    )
  }

  return (
    <div className="h-56 sm:h-80 rounded-xl sm:rounded-2xl border bg-card overflow-hidden">
      <ResponsiveSankey
        data={sankeyData}
        sort="descending"
        margin={{ top: 16, right: 60, bottom: 16, left: 60 }}
        colors={(node) => {
          const id = String(node.id)
          if (NODE_COLORS[id]) return NODE_COLORS[id]
          if (id.startsWith(PREFIX.income)) return '#3d8a7a'
          return '#c97a6b'
        }}
        nodeOpacity={1}
        nodeThickness={24}
        nodeInnerPadding={3}
        nodeSpacing={14}
        nodeBorderWidth={0}
        linkOpacity={0.35}
        linkContract={3}
        enableLinkGradient={false}
        label={(node) => displayLabel(String(node.id))}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
        animate={false}
      />
    </div>
  )
}

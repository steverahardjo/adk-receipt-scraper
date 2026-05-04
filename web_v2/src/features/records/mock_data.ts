// record fetch api
import { faker } from '@faker-js/faker'
import type { Entry } from './types'

import { TYPES, PAYMENTS, INCOME_SOURCES } from './types'

/* ------------------ config ------------------ */

// deterministic data (important for dev)
faker.seed(42)

// bias helpers
const pick = <T>(arr: readonly T[]) =>
  arr[Math.floor(Math.random() * arr.length)]

const weightedFlow = (): 'expense' | 'income' =>
  Math.random() < 0.75 ? 'expense' : 'income'

/* ------------------ generators ------------------ */

function generateExpense(): Entry {
  const type = pick(TYPES)

  return {
    id: faker.string.uuid(),

    title: faker.commerce.productName(), // better than static labels

    amount: faker.number.int({
      min: 5_000,
      max: 500_000,
    }),

    currency: 'IDR',

    date: faker.date.recent({ days: 60 }),

    flow: 'expense',

    type,
    paymentMethod: pick(PAYMENTS),

    description: faker.lorem.words(3),
  }
}

function generateIncome(): Entry {
  const source = pick(INCOME_SOURCES)

  return {
    id: faker.string.uuid(),

    title: source === 'Salary' ? 'Monthly Salary' : faker.company.name(),

    amount: faker.number.int({
      min: 500_000,
      max: 8_000_000,
    }),

    currency: 'IDR',

    date: faker.date.recent({ days: 60 }),

    flow: 'income',

    source,

    description: faker.lorem.words(2),
  }
}

/* ------------------ main builder ------------------ */

export function generateEntries(count = 1000): Entry[] {
  const data: Entry[] = []

  for (let i = 0; i < count; i++) {
    const flow = weightedFlow()

    data.push(flow === 'expense' ? generateExpense() : generateIncome())
  }

  // important: sort newest first
  return data.sort((a, b) => b.date.getTime() - a.date.getTime())
}

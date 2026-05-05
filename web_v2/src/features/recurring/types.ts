import { faker } from '@faker-js/faker'

export type RecurringItem = {
  id: string
  title: string
  merchant: string
  amount: number
  currency: 'MYR' | 'USD' | 'EUR' | 'IDR'
  paymentMethod: string
  paymentAccount: string
  dueDay: number
  frequency: 'monthly' | 'yearly'
  startDate: Date
  active: boolean
  description?: string
}

export function generateRecurring(): RecurringItem[] {
  return [
    {
      id: faker.string.uuid(),
      title: 'Netflix',
      merchant: 'Netflix Inc.',
      amount: 152_000,
      currency: 'IDR',
      paymentMethod: 'Card',
      paymentAccount: 'BCA •••• 9012',
      dueDay: 15,
      frequency: 'monthly',
      startDate: new Date(2024, 0, 15),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'Spotify Premium',
      merchant: 'Spotify AB',
      amount: 55_000,
      currency: 'IDR',
      paymentMethod: 'Card',
      paymentAccount: 'BCA •••• 9012',
      dueDay: 10,
      frequency: 'monthly',
      startDate: new Date(2023, 5, 10),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'Google One',
      merchant: 'Google LLC',
      amount: 29_000,
      currency: 'IDR',
      paymentMethod: 'Card',
      paymentAccount: 'Mandiri •••• 4532',
      dueDay: 5,
      frequency: 'monthly',
      startDate: new Date(2024, 3, 5),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'Fitnes First',
      merchant: 'Fitnes First Gym',
      amount: 300_000,
      currency: 'IDR',
      paymentMethod: 'E-Wallet',
      paymentAccount: 'GoPay Wallet',
      dueDay: 1,
      frequency: 'monthly',
      startDate: new Date(2024, 6, 1),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'IndiHome Internet',
      merchant: 'PT Telkom Indonesia',
      amount: 525_000,
      currency: 'IDR',
      paymentMethod: 'Transfer',
      paymentAccount: 'BCA •••• 2321',
      dueDay: 5,
      frequency: 'monthly',
      startDate: new Date(2023, 0, 5),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'Telkomsel Pasca',
      merchant: 'Telkomsel',
      amount: 200_000,
      currency: 'IDR',
      paymentMethod: 'Card',
      paymentAccount: 'Mandiri •••• 4532',
      dueDay: 20,
      frequency: 'monthly',
      startDate: new Date(2022, 8, 20),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'Amazon Prime',
      merchant: 'Amazon Services LLC',
      amount: 350_000,
      currency: 'IDR',
      paymentMethod: 'Card',
      paymentAccount: 'BCA •••• 9012',
      dueDay: 15,
      frequency: 'yearly',
      startDate: new Date(2024, 0, 15),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'Asuransi Mobil',
      merchant: 'AXA Mandiri',
      amount: 1_250_000,
      currency: 'IDR',
      paymentMethod: 'Transfer',
      paymentAccount: 'Mandiri •••• 8991',
      dueDay: 10,
      frequency: 'yearly',
      startDate: new Date(2024, 2, 10),
      active: false,
    },
    {
      id: faker.string.uuid(),
      title: 'iCloud+',
      merchant: 'Apple Inc.',
      amount: 49_000,
      currency: 'IDR',
      paymentMethod: 'Card',
      paymentAccount: 'BCA •••• 9012',
      dueDay: 22,
      frequency: 'monthly',
      startDate: new Date(2024, 10, 22),
      active: true,
    },
    {
      id: faker.string.uuid(),
      title: 'WeWork Desk',
      merchant: 'WeWork Companies',
      amount: 850_000,
      currency: 'IDR',
      paymentMethod: 'Transfer',
      paymentAccount: 'BCA •••• 2321',
      dueDay: 1,
      frequency: 'monthly',
      startDate: new Date(2025, 0, 1),
      active: true,
    },
  ]
}

/*Shadcn form created for user profiling*/
'use client'

import * as React from 'react'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
export const profileFormSchema = z.object({
  income_source: z.string(),

  liquid_cash: z.number(),
  monthly_expense_estimate: z.number(),

  debt_total: z.number().optional(),

  goal: z
    .object({
      name: z.string(),
      amount: z.number(),
      timeframe_months: z.number(),
    })
    .optional(),
})

/*Shadcn form created for user profiling*/
'use client'

import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'

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

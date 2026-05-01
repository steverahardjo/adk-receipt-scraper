'use client'

import { NumericFormat } from 'react-number-format'
import { Loader2, Aperture } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { OCRButton } from './OCRButton'
import { OCRCameraModal } from './OCRCameraModal'
import { DatePickerInput } from './DatePickerInput'

import { TYPES, PAYMENTS, CURRENCIES, TYPE_UI, PAYMENT_UI } from '../types'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium mb-1 block">{children}</label>
}

export function ExpenseFormCard({
  form,
  onSubmit,
  isSubmitting,
  cameraOpen,
  setCameraOpen,
  onOCR,
  ocrLoading,
}: any) {
  const values = form.watch()
  const currencySymbol = CURRENCIES[values.currency] || '$'

  return (
    <main className="container max-w-2xl py-10 min-h-screen">
      <OCRCameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onSend={onOCR}
      />

      <Card className="rounded-2xl shadow-sm border">
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-semibold">Add Expense</CardTitle>
            <CardDescription>Scan receipt or enter manually</CardDescription>
          </div>

          <OCRButton onOpen={() => setCameraOpen(true)} loading={ocrLoading} />
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* TITLE */}
            <div>
              <FieldLabel>Title</FieldLabel>
              <Input
                {...form.register('title')}
                placeholder="Lunch, Grab ride..."
                className="h-11"
              />
            </div>

            {/* CURRENCY + AMOUNT */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <FieldLabel>Currency</FieldLabel>
                <select
                  value={values.currency}
                  onChange={(e) =>
                    form.setValue('currency', e.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="w-full h-11 rounded-md border px-3 bg-background"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <FieldLabel>Amount</FieldLabel>
                <NumericFormat
                  customInput={Input}
                  value={values.amount}
                  prefix={`${currencySymbol} `}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                  onValueChange={(v) =>
                    form.setValue('amount', v.floatValue ?? 0, {
                      shouldDirty: true,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>

            {/* DATE */}
            <DatePickerInput
              value={values.date}
              onChange={(d) =>
                form.setValue('date', d, {
                  shouldDirty: true,
                })
              }
              label="Date"
            />

            {/* CATEGORY */}
            <div>
              <FieldLabel>Category</FieldLabel>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {TYPES.map((t) => {
                  const Icon = TYPE_UI[t].icon
                  const active = values.type === t

                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        form.setValue('type', t, { shouldDirty: true })
                      }
                      className={cn(
                        'p-3 rounded-lg border flex flex-col items-center gap-1.5 text-xs transition',
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-muted',
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* PAYMENT */}
            <div>
              <FieldLabel>Payment</FieldLabel>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {PAYMENTS.map((p) => {
                  const Icon = PAYMENT_UI[p].icon
                  const active = values.paymentMethod === p

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        form.setValue('paymentMethod', p, {
                          shouldDirty: true,
                        })
                      }
                      className={cn(
                        'h-10 rounded-lg border flex items-center justify-center gap-2 text-sm transition',
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-muted',
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Aperture className="mr-2 h-4 w-4" />
              )}
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

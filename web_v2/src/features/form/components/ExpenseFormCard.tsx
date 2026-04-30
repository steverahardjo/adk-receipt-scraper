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

      <Card className="border shadow-md rounded-2xl">
        <CardHeader className="flex flex-row justify-between items-center border-b bg-muted/30">
          <div>
            <CardTitle className="text-2xl font-bold">Add Expense</CardTitle>
            <CardDescription>Scan receipt or enter manually</CardDescription>
          </div>

          <OCRButton onOpen={() => setCameraOpen(true)} loading={ocrLoading} />
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* TITLE */}
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                {...form.register('title')}
                placeholder="e.g. Lunch, Grab ride"
                className="h-11 mt-1"
              />
            </div>

            {/* CURRENCY + AMOUNT */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium">Currency</label>
                <select
                  value={values.currency}
                  onChange={(e) =>
                    form.setValue('currency', e.target.value, {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  className="w-full h-11 mt-1 border rounded-md px-2"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Amount</label>
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
                      shouldTouch: true,
                    })
                  }
                  className="h-11 mt-1"
                />
              </div>
            </div>

            {/* DATE */}
            <DatePickerInput
              value={values.date}
              onChange={(d) =>
                form.setValue('date', d, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              label="Date"
            />

            {/* CATEGORY */}
            <div>
              <label className="text-sm font-medium">Category</label>

              <div className="grid grid-cols-3 gap-3 mt-2">
                {TYPES.map((t) => {
                  const Icon = TYPE_UI[t].icon
                  const active = values.type === t

                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        form.setValue('type', t, {
                          shouldDirty: true,
                          shouldTouch: true,
                        })
                      }
                      className={cn(
                        'p-3 border rounded-xl flex flex-col items-center gap-2 transition',
                        active ? 'bg-primary text-white' : 'hover:bg-muted',
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{t}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* PAYMENT */}
            <div>
              <label className="text-sm font-medium">Payment</label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
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
                          shouldTouch: true,
                        })
                      }
                      className={cn(
                        'h-11 border rounded-xl flex items-center justify-center gap-2 transition',
                        active ? 'bg-primary text-white' : 'hover:bg-muted',
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
              className="w-full h-12"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Aperture className="mr-2" />
              )}
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

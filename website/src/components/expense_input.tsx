import { NumericFormat } from 'react-number-format'

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'

import { CURRENCIES } from '@/schema'

type Props = {
  control: Control<any>
}

export function ExpenseInput({ control }: Props) {
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>

          <div className="flex gap-2">
            {/* Currency */}
            <FormField
              control={control}
              name="currency"
              render={({ field: currencyField }) => (
                <Select
                  onValueChange={currencyField.onChange}
                  defaultValue={currencyField.value}
                >
                  <SelectTrigger className="h-12 w-24">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.keys(CURRENCIES).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {/* Amount */}
            <NumericFormat
              customInput={Input}
              value={field.value}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              className="h-12 text-base"
              placeholder="0.00"
              onValueChange={(v) => field.onChange(v.floatValue ?? 0)}
            />
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

"use client"

import * as React from "react"
import { PatternFormat } from "react-number-format"
import { Input } from "./input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { cn } from "#/lib/utils"

export interface Currency {
  value: string
  label: string
  flag: string
  symbol: string
}

export interface CurrencyNumberInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value?: string
  onValueChange?: (value: string, currency: string) => void
  currencies?: Currency[]
  currency?: string
  onCurrencyChange?: (currency: string) => void
  placeholder?: string
  disabled?: boolean
}

const DEFAULT_CURRENCIES: Currency[] = [
  { value: "USD", label: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { value: "IDR", label: "Indonesian Rupiah", flag: "🇮🇩", symbol: "Rp" },
  { value: "SGD", label: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
  { value: "MYR", label: "Malaysian Ringgit", flag: "🇲🇾", symbol: "RM" },
  { value: "JPY", label: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
]

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  IDR: "Rp",
  SGD: "S$",
  MYR: "RM",
  JPY: "¥",
}

export const CurrencyNumberInput = React.forwardRef<
  HTMLInputElement,
  CurrencyNumberInputProps
>(
  (
    {
      value = "",
      onValueChange,
      currencies = DEFAULT_CURRENCIES,
      currency = "USD",
      onCurrencyChange,
      placeholder = "0.00",
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const selectedCurrency =
      currencies.find((c) => c.value === currency) || currencies[0]
    const symbol = CURRENCY_SYMBOLS[currency] || selectedCurrency.symbol

    const handleValueChange = (values: { value: string }) => {
      onValueChange?.(values.value, currency)
    }

    return (
      <div className="flex items-stretch gap-0">
        <div className="relative flex-1">
          <PatternFormat
            customInput={Input}
            value={value}
            onValueChange={handleValueChange}
            thousandSeparator
            decimalScale={2}
            allowNegative={false}
            prefix={symbol}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "pr-12",
              " [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              className,
            )}
            inputRef={ref}
            {...props}
          />
        </div>
        <Select
          value={currency}
          onValueChange={onCurrencyChange}
          disabled={disabled}
        >
          <SelectTrigger
            className="w-[110px] rounded-l-none border-l-0 focus:ring-0 focus:ring-offset-0"
            size="default"
          >
            <SelectValue>
              <span className="flex items-center gap-1">
                <span>{selectedCurrency.flag}</span>
                <span className="hidden sm:inline">{selectedCurrency.value}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem key={curr.value} value={curr.value}>
                <span className="flex items-center gap-2">
                  <span>{curr.flag}</span>
                  <span>{curr.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
)

CurrencyNumberInput.displayName = "CurrencyNumberInput"

export default CurrencyNumberInput

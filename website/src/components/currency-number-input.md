# Currency Number Input Component

## Overview
A reusable number input component with built-in thousand separator and currency dropdown selector. Designed for the expense tracking feature in the Personal Finance Tracker.

## Implementation Date
March 19, 2026

## Tech Stack
- **Number Formatting**: `react-number-format` (PatternFormat)
- **UI Components**: shadcn/ui (Input, Select)
- **Icons**: Lucide React (via Select component)
- **Framework**: React 19 + TypeScript

## Files Created

### Components
- `src/components/ui/select.tsx` - Select dropdown component (Radix UI based)
- `src/components/ui/currency-number-input.tsx` - Currency number input with thousand separator

### Updated Files
- `src/routes/expense_form.tsx` - Updated InputAmount component to use CurrencyNumberInput

## Features

### Currency Number Input

| Feature | Description |
|---------|-------------|
| **Thousand Separator** | Automatically formats numbers with commas (e.g., 1,000,000) |
| **Decimal Support** | Supports 2 decimal places for cents |
| **Currency Symbol** | Displays symbol prefix based on selected currency |
| **Currency Dropdown** | Select from 5 currencies with flags |
| **Responsive** | Currency selector adapts to screen size |

### Supported Currencies

| Currency | Code | Symbol | Flag |
|----------|------|--------|------|
| US Dollar | USD | $ | 🇺🇸 |
| Indonesian Rupiah | IDR | Rp | 🇮🇩 |
| Singapore Dollar | SGD | S$ | 🇸🇬 |
| Malaysian Ringgit | MYR | RM | 🇲🇾 |
| Japanese Yen | JPY | ¥ | 🇯🇵 |

## Usage Examples

### Basic Usage

```tsx
import { CurrencyNumberInput } from "@/components/ui/currency-number-input"

function ExpenseForm() {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")

  return (
    <CurrencyNumberInput
      value={amount}
      onValueChange={(value, currency) => {
        setAmount(value)
        setCurrency(currency)
      }}
      currency={currency}
      onCurrencyChange={setCurrency}
    />
  )
}
```

### With Field Label (shadcn form)

```tsx
import { Field, FieldLabel } from "@/components/ui/field"
import { CurrencyNumberInput } from "@/components/ui/currency-number-input"

function InputAmount({ value, onValueChange, currency, onCurrencyChange }) {
  return (
    <Field>
      <FieldLabel htmlFor="input-amount">Amount</FieldLabel>
      <CurrencyNumberInput
        id="input-amount"
        value={value}
        onValueChange={onValueChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        placeholder="0.00"
      />
    </Field>
  )
}
```

### Custom Currencies

```tsx
const customCurrencies = [
  { value: "EUR", label: "Euro", flag: "🇪🇺", symbol: "€" },
  { value: "GBP", label: "British Pound", flag: "🇬🇧", symbol: "£" },
  { value: "USD", label: "US Dollar", flag: "🇺🇸", symbol: "$" },
]

<CurrencyNumberInput
  currencies={customCurrencies}
  value={amount}
  onValueChange={setAmount}
/>
```

### Disabled State

```tsx
<CurrencyNumberInput
  value={amount}
  onValueChange={setAmount}
  disabled={true}
/>
```

## Props

### CurrencyNumberInputProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | Current numeric value (unformatted) |
| `onValueChange` | `(value: string, currency: string) => void` | - | Callback when value changes |
| `currency` | `string` | `"USD"` | Selected currency code |
| `onCurrencyChange` | `(currency: string) => void` | - | Callback when currency changes |
| `currencies` | `Currency[]` | Default 5 currencies | Array of available currencies |
| `placeholder` | `string` | `"0.00"` | Input placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `className` | `string` | - | Additional CSS classes |

### Currency Interface

```ts
interface Currency {
  value: string      // Currency code (e.g., "USD")
  label: string      // Full name (e.g., "US Dollar")
  flag: string       // Emoji flag (e.g., "🇺🇸")
  symbol: string     // Currency symbol (e.g., "$")
}
```

## Design

### Visual Layout
```
┌─────────────────────────────┬──────────────┐
│ $ 1,234,567.89              │ 🇺🇸 USD    ▼ │
└─────────────────────────────┴──────────────┘
```

### Behavior
- **Input Focus**: Shows border highlight with ring animation
- **Typing**: Numbers format automatically as you type
- **Currency Change**: Updates symbol prefix immediately
- **Mobile**: Currency dropdown shows full currency names on tap

## Integration with Expense Form

The component is used in the expense form to capture transaction amounts:

```tsx
// From expense_form.tsx
export function InputAmount({
  value,
  onValueChange,
  currency,
  onCurrencyChange,
  disabled,
}) {
  const currencies: Currency[] = [
    { value: 'USD', label: 'USD — US Dollar', flag: '🇺🇸', symbol: '$' },
    { value: 'IDR', label: 'IDR — Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    // ... more currencies
  ]

  return (
    <Field>
      <FieldLabel htmlFor="input-expenseAmount">Amount</FieldLabel>
      <CurrencyNumberInput
        id="input-expenseAmount"
        value={value}
        onValueChange={onValueChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        currencies={currencies}
        placeholder="0.00"
        disabled={disabled}
      />
    </Field>
  )
}
```

## Browser Support

| Browser | Platform | Support |
|---------|----------|---------|
| Chrome | Windows, macOS, Android, iOS | ✅ Full |
| Safari | macOS, iOS | ✅ Full |
| Firefox | Windows, macOS, Linux | ✅ Full |
| Edge | Windows, macOS | ✅ Full |

## Accessibility

- **Label Association**: Uses `htmlFor` and `id` for proper label linking
- **Keyboard Navigation**: Full keyboard support for input and dropdown
- **Screen Reader**: Announces currency changes and value updates
- **Focus States**: Visible focus rings for keyboard users

## Performance Considerations

1. **Controlled Component**: Uses React controlled pattern for predictable state
2. **Memoization**: Consider using `useCallback` for change handlers in parent components
3. **Number Formatting**: Handled by `react-number-format` for optimal performance

## Future Enhancements
- Add more currencies (EUR, GBP, AUD, etc.)
- Support for custom currency addition by users
- Exchange rate conversion display
- Locale-aware number formatting (different thousand/decimal separators)
- Compact mode for mobile (smaller currency dropdown)

## Troubleshooting

### Input not formatting
- Ensure `value` is passed as a string (not number)
- Check that `onValueChange` is properly wired

### Currency dropdown not updating
- Verify `currency` prop is controlled by parent state
- Ensure `onCurrencyChange` updates the currency state

### Decimal places not showing
- Component is set to 2 decimal places by default
- Modify `decimalScale` prop in CurrencyNumberInput if needed

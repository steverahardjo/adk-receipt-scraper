# Expense Form

## Overview
A comprehensive expense entry form for the Personal Finance Tracker application. Built with React Hook Form, Zod validation, and shadcn/ui components.

## Implementation Date
March 19, 2026

## Tech Stack
- **Form Management**: React Hook Form
- **Validation**: Zod + @hookform/resolvers
- **Date Handling**: date-fns, react-day-picker
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Framework**: React 19 + TanStack Start

## Route
- **Path**: `/expense_form`
- **File**: `src/routes/expense_form.tsx`

## Features

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **Title** | Text Input | ✅ Yes | Name/description of the expense |
| **Amount** | Number Input | ✅ Yes | Expense amount with currency selector |
| **Currency** | Dropdown | ✅ Yes | Select from 5 currencies (USD, IDR, SGD, MYR, JPY) |
| **Date** | Date Picker | ✅ Yes | Calendar popup for expense date |
| **Expense Type** | Dropdown | ✅ Yes | Category selection with icons |
| **Payment Method** | Dropdown | ✅ Yes | How the expense was paid |
| **Description** | Textarea | ❌ Optional | Additional notes about the expense |

### Supported Expense Types

| Value | Label | Icon |
|-------|-------|------|
| Food | Food & Dining | 🍔 |
| Transport | Transport | 🚗 |
| Shopping | Shopping | 🛍️ |
| Bills | Bills & Utilities | 📄 |
| Entertainment | Entertainment | 🎬 |
| Health | Health | 💊 |
| Other | Other | 📦 |

### Supported Payment Methods

| Value | Label | Icon |
|-------|-------|------|
| Cash | Cash | 💵 |
| Debit | Debit Card | 💳 |
| Credit | Credit Card | 💳 |
| E-Wallet | E-Wallet | 📱 |
| Bank Transfer | Bank Transfer | 🏦 |

### Supported Currencies

| Code | Label | Symbol | Flag |
|------|-------|--------|------|
| USD | US Dollar | $ | 🇺🇸 |
| IDR | Indonesian Rupiah | Rp | 🇮🇩 |
| SGD | Singapore Dollar | S$ | 🇸🇬 |
| MYR | Malaysian Ringgit | RM | 🇲🇾 |
| JPY | Japanese Yen | ¥ | 🇯🇵 |

## Validation Rules

```typescript
const expenseFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.string().min(1, 'Amount is required'),
  currency: z.string().default('USD'),
  date: z.date({ required_error: 'Date is required' }),
  type: z.string().min(1, 'Expense type is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  description: z.string().optional(),
})
```

### Validation Messages

| Field | Error | Message |
|-------|-------|---------|
| Title | Empty | "Title is required" |
| Amount | Empty | "Amount is required" |
| Date | Empty | "Date is required" |
| Type | Empty | "Expense type is required" |
| Payment Method | Empty | "Payment method is required" |

## Components Created

### UI Components
1. **`src/components/ui/form.tsx`** - Form field components (FormItem, FormLabel, FormControl, FormMessage, FormDescription)
2. **`src/components/ui/calendar.tsx`** - Calendar date picker using react-day-picker
3. **`src/components/ui/popover.tsx`** - Popover container for calendar dropdown

### Dependencies Added
```json
{
  "react-hook-form": "latest",
  "react-day-picker": "latest",
  "date-fns": "latest",
  "@hookform/resolvers": "latest"
}
```

## Usage

### Navigation
Access the form via:
- Direct URL: `/expense_form`
- Header link (when authenticated)

### Form Submission Flow

1. User fills in all required fields
2. Clicks "Add Expense" button
3. Form validates all fields
4. Shows loading state with spinner
5. On success: Shows toast notification, redirects to home
6. On error: Shows error toast

### Example Data Output

```javascript
{
  title: "Lunch at Restaurant",
  amount: "25.50",
  currency: "USD",
  date: Date(2026-03-19T00:00:00.000Z),
  type: "Food",
  paymentMethod: "Credit",
  description: "Team lunch meeting"
}
```

## Design Features

### Visual Design
- **Island Shell Card**: Elevated card with gradient background and shadow
- **Theme Integration**: Uses sea/lagoon color scheme
- **Responsive**: Mobile-first design with adaptive layouts
- **Icons**: Emoji icons for expense types and payment methods
- **Currency Display**: Flag + code in dropdown, symbol in input prefix

### Interactions
- **Calendar Popup**: Click date field to open calendar
- **Live Currency Symbol**: Updates as currency selection changes
- **Loading State**: Button shows spinner during submission
- **Toast Notifications**: Success/error feedback via Sonner

### Accessibility
- Form labels properly associated with inputs
- Keyboard navigation support
- Focus states visible
- Error messages linked to fields via ARIA

## Code Structure

```
expense_form.tsx
├── Constants (EXPENSE_TYPES, PAYMENT_METHODS, CURRENCIES)
├── Zod Schema (expenseFormSchema)
├── Route Definition (createFileRoute)
└── ExpenseFormPage Component
    ├── Form initialization (useForm)
    ├── Submit handler (onSubmit)
    └── Form UI
        ├── Title field
        ├── Amount + Currency fields
        ├── Date picker
        ├── Expense Type dropdown
        ├── Payment Method dropdown
        ├── Description textarea
        └── Submit/Cancel buttons
```

## Future Enhancements

### Planned Features
- [ ] Photo attachment for receipts
- [ ] Recurring expense option
- [ ] Location tagging
- [ ] Split expense functionality
- [ ] Tags/labels for custom categorization
- [ ] Offline mode with sync
- [ ] Duplicate expense detection
- [ ] Smart suggestions based on history

### Integration Points
- Backend API connection for persistence
- Bank statement import/sync
- Receipt OCR scanning
- Budget limit warnings
- Category spending analytics

## Browser Support

| Browser | Platform | Support |
|---------|----------|---------|
| Chrome | Windows, macOS, Android, iOS | ✅ Full |
| Safari | macOS, iOS | ✅ Full |
| Firefox | Windows, macOS, Linux | ✅ Full |
| Edge | Windows, macOS | ✅ Full |

## Testing Checklist

- [ ] Submit form with all fields filled
- [ ] Submit form with empty required fields (validation)
- [ ] Select different currencies
- [ ] Pick dates from calendar
- [ ] Select all expense types
- [ ] Select all payment methods
- [ ] Add optional description
- [ ] Cancel button navigation
- [ ] Loading state during submission
- [ ] Toast notifications appear
- [ ] Form resets after successful submission

## Troubleshooting

### Form not submitting
- Check all required fields are filled
- Verify date is selected (not empty)
- Check browser console for validation errors

### Calendar not opening
- Ensure popover component is properly imported
- Check for z-index conflicts

### Currency symbol not updating
- Verify currency state is being watched correctly
- Check CURRENCY_SYMBOLS mapping includes selected currency

### Toast not showing
- Ensure Toaster is rendered in app root
- Check Sonner import is correct

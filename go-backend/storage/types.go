package storage

import (
	"time"
)

/* ---------- ENUMS ---------- */

type ExpenseType string
type PaymentMethod string

const (
	Food      ExpenseType = "Food"
	Transport ExpenseType = "Transport"
	Shopping  ExpenseType = "Shopping"
	Bills     ExpenseType = "Bills"
	Other     ExpenseType = "Other"
)

const (
	Cash     PaymentMethod = "Cash"
	Card     PaymentMethod = "Card"
	Transfer PaymentMethod = "Transfer"
	EWallet  PaymentMethod = "E-Wallet"
)

/* ---------- SUBSIDIARY STRUCTS ---------- */

type Asset struct {
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

type OwnedAssets struct {
	CurrentSaving float64 `json:"current_saving"`
	EmergencyFund float64 `json:"emergency_fund"`
	Assets        []Asset `json:"assets"`
}

/* ---------- CORE MODELS ---------- */

type User struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // "-" hides the password from JSON responses
	CreatedAt    time.Time `json:"created_at"`
}

type UserAppStat struct {
	ID         int64     `json:"id"`
	LastLogin  time.Time `json:"last_login"`
	UpdateAt   time.Time `json:"update_at"`
	LastIPAddr string    `json:"last_ip_address"`
}

type Profile struct {
	ID          int64   `json:"id"`
	Nickname    string  `json:"nickname"`
	MoneySource string  `json:"money_source"`
	MonthBudget float64 `json:"month_budget"`
	// Note: In Postgres, this should be a JSONB column
	OwnedAssets *OwnedAssets `json:"owned_assets,omitempty"`
}

type Expense struct {
	ID            int64         `json:"id"`
	Title         string        `json:"title"`
	Amount        float64       `json:"amount"`
	Currency      string        `json:"currency"`
	Date          time.Time     `json:"date"`
	Type          ExpenseType   `json:"type"`
	PaymentMethod PaymentMethod `json:"payment_method"`
	Description   string        `json:"description,omitempty"`
}

type Revenue struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Amount      float64   `json:"amount"`
	Currency    string    `json:"currency"`
	Date        time.Time `json:"date"`
	Description string    `json:"description,omitempty"`
}

package storage

import (
	"database/sql"
	"fmt"
	"time"

	pq "github.com/lib/pq"
)

type ExpenseStore struct {
	db *sql.DB
}

func (e *ExpenseStore) InitSchema(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS expenses (
			id             INTEGER PRIMARY KEY AUTOINCREMENT,
			title          TEXT NOT NULL,
			amount         INT NOT NULL,
			currency       TEXT NOT NULL,
			date           TEXT NOT NULL,
			type           TEXT NOT NULL,
			payment_method TEXT NOT NULL,
			description    TEXT,
			created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
			user_id 		INTEGER NOT NULL
			FOREIGN KEY (user_id) REFERENCES users(user_id)
		);
	`)
	return err
}

func (e *ExpenseStore) InsertExpense(expense *Expense) error {
	query := `
		INSERT INTO expenses (
			user_id, title, amount, currency, date, type, payment_method, description
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at`
	err := e.db.QueryRow(
		query,
		expense.UserID,
		expense.Title,
		expense.Amount,
		expense.Currency,
		expense.Date,
		expense.Type,
		expense.PaymentMethod,
		expense.Description,
	).Scan(&expense.ID, &expense.Date)

	return err
}

func (e *ExpenseStore) UpdateExpense(expense *Expense) (string, time.Time, error) {
	var returnedTitle string
	var returnedCreatedAt time.Time
	query := `
		UPDATE expenses
		SET title = $2,
		    amount = $3,
		    currency = $4,
		    description = $5,
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
		RETURNING title, created_at`

	err := e.db.QueryRow(
		query,
		expense.ID,
		expense.Title,
		expense.Amount,
		expense.Currency,
		expense.Description,
	).Scan(&returnedTitle, &returnedCreatedAt)

	if err != nil {
		return "", time.Time{}, err
	}

	return returnedTitle, returnedCreatedAt, nil
}

func (e *ExpenseStore) BatchDeleteExpense(userID int64, ids []int64) error {
	if len(ids) == 0 {
		return fmt.Errorf("[Error]DB deleting batch expense id is not sent")
	}
	query := `DELETE FROM expenses WHERE user_id = $1 AND id = ANY($2)`
	_, err := e.db.Exec(query, userID, pq.Array(ids))
	return err
}

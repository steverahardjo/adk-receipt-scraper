package storage

import (
	"database/sql"
	"fmt"

	pq "github.com/lib/pq"
)

type ExpenseStore struct {
	db *sql.DB
}

func (d *Database) MakeExpenseStore() *ExpenseStore {
	return &ExpenseStore{db: d.Conn}
}

func (e *ExpenseStore) InitSchema() error {
	_, err := e.db.Exec(`
		CREATE TABLE IF NOT EXISTS expenses (
			id             SERIAL PRIMARY KEY,
			title          VARCHAR(255) NOT NULL,
			amount         NUMERIC NOT NULL,
			currency       VARCHAR(10) NOT NULL,
			date           TIMESTAMP NOT NULL,
			type           VARCHAR(50) NOT NULL,
			payment_method VARCHAR(50) NOT NULL,
			description    TEXT,
			created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			user_id        INTEGER NOT NULL,
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
		RETURNING id`
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
	).Scan(&expense.ID)

	return err
}

func (e *ExpenseStore) UpdateExpense(expense *Expense) error {
	query := `
		UPDATE expenses
		SET title = $2,
		    amount = $3,
		    currency = $4,
		    date = $5,
		    type = $6,
		    payment_method = $7,
		    description = $8,
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
		RETURNING updated_at`

	err := e.db.QueryRow(
		query,
		expense.ID,
		expense.Title,
		expense.Amount,
		expense.Currency,
		expense.Date,
		expense.Type,
		expense.PaymentMethod,
		expense.Description,
	).Scan(&expense.Date)

	if err != nil {
		return fmt.Errorf("[ERR] updating expense: %w", err)
	}

	return nil
}

func (e *ExpenseStore) GetExpenseByID(id int64, userID int64) (*Expense, error) {
	query := `
		SELECT id, title, amount, currency, date, type, payment_method, description, user_id
		FROM expenses
		WHERE id = $1 AND user_id = $2
	`
	var expense Expense
	err := e.db.QueryRow(query, id, userID).Scan(
		&expense.ID,
		&expense.Title,
		&expense.Amount,
		&expense.Currency,
		&expense.Date,
		&expense.Type,
		&expense.PaymentMethod,
		&expense.Description,
		&expense.UserID,
	)
	if err != nil {
		return nil, fmt.Errorf("[ERR] getting expense by ID: %w", err)
	}
	return &expense, nil
}

func (e *ExpenseStore) GetAllExpenses(userID int64) ([]*Expense, error) {
	query := `
		SELECT id, title, amount, currency, date, type, payment_method, description, user_id
		FROM expenses
		WHERE user_id = $1
		ORDER BY date DESC
	`
	rows, err := e.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("[ERR] querying all expenses: %w", err)
	}
	defer rows.Close()

	var expenses []*Expense
	for rows.Next() {
		var expense Expense
		err := rows.Scan(
			&expense.ID,
			&expense.Title,
			&expense.Amount,
			&expense.Currency,
			&expense.Date,
			&expense.Type,
			&expense.PaymentMethod,
			&expense.Description,
			&expense.UserID,
		)
		if err != nil {
			return nil, fmt.Errorf("[ERR] scanning expense row: %w", err)
		}
		expenses = append(expenses, &expense)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("[ERR] iterating expense rows: %w", err)
	}

	return expenses, nil
}

func (e *ExpenseStore) BatchDeleteExpense(userID int64, ids []int64) error {
	if len(ids) == 0 {
		return fmt.Errorf("[ERR] batch delete: no expense IDs provided")
	}
	query := `DELETE FROM expenses WHERE user_id = $1 AND id = ANY($2)`
	result, err := e.db.Exec(query, userID, pq.Array(ids))
	if err != nil {
		return fmt.Errorf("[ERR] batch deleting expenses: %w", err)
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("[ERR] getting rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return fmt.Errorf("[ERR] no expenses deleted - check user_id and ids")
	}
	return nil
}

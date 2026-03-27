package storage

import (
	"github.com/lib/pq"
)

// InitExpenseSchema is now a method of the main Database struct
func (d *Database) InitExpenseSchema() error {
	_, err := d.Conn.Exec(`
        CREATE TABLE IF NOT EXISTS expenses (
            id             SERIAL PRIMARY KEY,
            user_id        INTEGER NOT NULL REFERENCES users(user_id),
            title          VARCHAR(255) NOT NULL,
            amount         NUMERIC NOT NULL,
            currency       VARCHAR(10) NOT NULL,
            date           TIMESTAMP NOT NULL,
            type           VARCHAR(50) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            description    TEXT,
            created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        );
    `)
	return err
}

func (d *Database) InsertExpense(expense *Expense) error {
	query := `
        INSERT INTO expenses (user_id, title, amount, currency, date, type, payment_method, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`

	return d.Conn.QueryRow(
		query,
		expense.UserID, expense.Title, expense.Amount, expense.Currency,
		expense.Date, expense.Type, expense.PaymentMethod, expense.Description,
	).Scan(&expense.ID)
}

func (d *Database) CompositeExpenseIndex() error {
	_, err := d.Conn.Exec(`
		CREATE INDEX ON expenses (user_id, date)
	`)
	return err
}

func (d *Database) GetExpenseByID(id int64, userID int64) (*Expense, error) {
	var e Expense
	query := `SELECT id, title, amount, currency, date, type, payment_method, description, user_id
              FROM expenses WHERE id = $1 AND user_id = $2`

	err := d.Conn.QueryRow(query, id, userID).Scan(
		&e.ID, &e.Title, &e.Amount, &e.Currency, &e.Date,
		&e.Type, &e.PaymentMethod, &e.Description, &e.UserID,
	)
	return &e, err
}

func (d *Database) GetAllExpenses(userID int64) ([]*Expense, error) {
	query := `SELECT id, title, amount, currency, date, type, payment_method, description, user_id
              FROM expenses WHERE user_id = $1 ORDER BY date DESC`

	rows, err := d.Conn.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenses []*Expense
	for rows.Next() {
		var e Expense
		if err := rows.Scan(&e.ID, &e.Title, &e.Amount, &e.Currency, &e.Date,
			&e.Type, &e.PaymentMethod, &e.Description, &e.UserID); err != nil {
			return nil, err
		}
		expenses = append(expenses, &e)
	}
	return expenses, rows.Err()
}

func (d *Database) BatchDeleteExpense(userID int64, ids []int64) error {
	if len(ids) == 0 {
		return nil
	}
	query := `DELETE FROM expenses WHERE user_id = $1 AND id = ANY($2)`
	_, err := d.Conn.Exec(query, userID, pq.Array(ids))
	return err
}

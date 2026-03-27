package storage

import (
	"database/sql"
)

type RevenueStore struct {
	db *sql.DB
}

func (e *RevenueStore) InitSchema() error {
	query := `
		CREATE TABLE IF NOT EXISTS revenues (
			id SERIAL PRIMARY KEY,
			date TIMESTAMP NOT NULL,
			amount NUMERIC NOT NULL,
			currency STRING NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			user_id INT NOT NULL
		);
		`
	_, err := e.db.Exec(query)
	return err
}

func (e *RevenueStore) InsertRevenue(revenue Revenue) error {
	query := `
		INSERT INTO revenues (date, amount, currency, user_id, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		`
	_, err := e.db.Exec(query, revenue.Date, revenue.Amount, revenue.Currency, revenue.UserID)
	return err
}

func (e *RevenueStore) UpdateRevenue(revenue Revenue) error {
	query := `
		UPDATE revenues
		SET date = $1, amount = $2, currency = $3
		WHERE id = $4
		`
	_, err := e.db.Exec(query, revenue.Date, revenue.Amount, revenue.Currency, revenue.ID)
	return err
}

func (e *RevenueStore) DeleteRevenue(revenue Revenue) error {
	query := `
		DELETE FROM revenues
		WHERE id = $1
		`
	_, err := e.db.Exec(query, revenue.ID)
	return err
}

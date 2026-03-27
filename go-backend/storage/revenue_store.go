package storage

import (
	"database/sql"
	"fmt"
)

type RevenueStore struct {
	db *sql.DB
}

func (d *Database) MakeRevenueStore() *RevenueStore {
	return &RevenueStore{db: d.Conn}
}

func (s *RevenueStore) InitSchema() error {
	query := `
		CREATE TABLE IF NOT EXISTS revenues (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			amount NUMERIC NOT NULL,
			currency VARCHAR(10) NOT NULL,
			date TIMESTAMP NOT NULL,
			description TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			user_id INTEGER NOT NULL,
			FOREIGN KEY (user_id) REFERENCES users(user_id)
		);
		`
	_, err := s.db.Exec(query)
	return err
}

func (s *RevenueStore) InsertRevenue(revenue *Revenue) error {
	query := `
		INSERT INTO revenues (title, amount, currency, date, description, user_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
		`
	err := s.db.QueryRow(query, revenue.Title, revenue.Amount, revenue.Currency, revenue.Date, revenue.Description, revenue.UserID).Scan(&revenue.ID)
	return err
}

func (s *RevenueStore) UpdateRevenue(revenue *Revenue) error {
	query := `
		UPDATE revenues
		SET title = $1, amount = $2, currency = $3, date = $4, description = $5, updated_at = CURRENT_TIMESTAMP
		WHERE id = $6
		`
	_, err := s.db.Exec(query, revenue.Title, revenue.Amount, revenue.Currency, revenue.Date, revenue.Description, revenue.ID)
	if err != nil {
		return fmt.Errorf("[ERR] updating revenue: %w", err)
	}
	return nil
}

func (s *RevenueStore) GetRevenueByID(id int64, userID int64) (*Revenue, error) {
	query := `
		SELECT id, title, amount, currency, date, description, user_id
		FROM revenues
		WHERE id = $1 AND user_id = $2
	`
	var revenue Revenue
	err := s.db.QueryRow(query, id, userID).Scan(
		&revenue.ID,
		&revenue.Title,
		&revenue.Amount,
		&revenue.Currency,
		&revenue.Date,
		&revenue.Description,
		&revenue.UserID,
	)
	if err != nil {
		return nil, fmt.Errorf("[ERR] getting revenue by ID: %w", err)
	}
	return &revenue, nil
}

func (s *RevenueStore) GetAllRevenues(userID int64) ([]*Revenue, error) {
	query := `
		SELECT id, title, amount, currency, date, description, user_id
		FROM revenues
		WHERE user_id = $1
		ORDER BY date DESC
	`
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("[ERR] querying all revenues: %w", err)
	}
	defer rows.Close()

	var revenues []*Revenue
	for rows.Next() {
		var revenue Revenue
		err := rows.Scan(
			&revenue.ID,
			&revenue.Title,
			&revenue.Amount,
			&revenue.Currency,
			&revenue.Date,
			&revenue.Description,
			&revenue.UserID,
		)
		if err != nil {
			return nil, fmt.Errorf("[ERR] scanning revenue row: %w", err)
		}
		revenues = append(revenues, &revenue)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("[ERR] iterating revenue rows: %w", err)
	}

	return revenues, nil
}

func (s *RevenueStore) DeleteRevenue(id int64, userID int64) error {
	query := `
		DELETE FROM revenues
		WHERE id = $1 AND user_id = $2
		`
	result, err := s.db.Exec(query, id, userID)
	if err != nil {
		return fmt.Errorf("[ERR] deleting revenue: %w", err)
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("[ERR] getting rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return fmt.Errorf("[ERR] no revenue deleted - check id and user_id")
	}
	return nil
}

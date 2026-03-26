package storage

import (
	"database/sql"
)

// UserStore handles all database operations for the users table
type UserStore struct {
	db *sql.DB
}

// MakeUserStore initializes the table and returns the store
func (d *Database) MakeUserStore() (*UserStore, error) {
	// Using your schema query
	query := `
	CREATE TABLE IF NOT EXISTS users (
		user_id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL UNIQUE,
		password_hash VARCHAR(255) NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		ip_address VARCHAR(255)
	);`

	_, err := d.Conn.Exec(query)
	if err != nil {
		return nil, err
	}
	return &UserStore{db: d.Conn}, nil
}

// InsertUser takes a User struct, saves it, and updates the struct with the DB-generated ID
func (s *UserStore) InsertUser(u *User) error {
	query := `
		INSERT INTO users (name, email, password_hash, ip_address)
		VALUES ($1, $2, $3, $4)
		RETURNING user_id, created_at, updated_at`

	// We use QueryRow because we want the values back from the RETURNING clause
	err := s.db.QueryRow(
		query,
		u.Name,
		u.Email,
		u.PasswordHash,
	).Scan(&u.ID, &u.CreatedAt)

	if err != nil {
		return err
	}

	return nil
}

func (s *UserStore) UpdatePasswordHash(userID int64, newHash string) error {
	query := `
		UPDATE users
		SET password_hash = $1
		WHERE user_id = $2`

	_, err := s.db.Exec(query, newHash, userID)
	return err
}

func (s *UserStore) UpdateEmail(userID int64, newEmail string) error {
	query := `
		UPDATE users
		SET email = $1
		WHERE user_id = $2`

	_, err := s.db.Exec(query, newEmail, userID)
	return err
}

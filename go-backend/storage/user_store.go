package storage

import (
	"database/sql"
	"fmt"
)

// UserStore handles all database operations for the users table
type UserStore struct {
	db *sql.DB
}

// MakeUserStore initializes and returns the store
func (d *Database) MakeUserStore() *UserStore {
	return &UserStore{db: d.Conn}
}

// InitSchema initializes the users table
func (s *UserStore) InitSchema() error {
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

	_, err := s.db.Exec(query)
	return err
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
		u.IPAddress,
	).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)

	if err != nil {
		return fmt.Errorf("[ERR] inserting user: %w", err)
	}

	return nil
}

func (s *UserStore) UpdatePasswordHash(userID int64, newHash string) error {
	query := `
		UPDATE users
		SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $2`

	_, err := s.db.Exec(query, newHash, userID)
	if err != nil {
		return fmt.Errorf("[ERR] updating password hash: %w", err)
	}
	return nil
}

func (s *UserStore) UpdateEmail(userID int64, newEmail string) error {
	query := `
		UPDATE users
		SET email = $1, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $2`

	_, err := s.db.Exec(query, newEmail, userID)
	if err != nil {
		return fmt.Errorf("[ERR] updating email: %w", err)
	}
	return nil
}

func (s *UserStore) UpdateIPAddress(userID int64, ipAddress string) error {
	query := `
		UPDATE users
		SET ip_address = $1, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $2`

	_, err := s.db.Exec(query, ipAddress, userID)
	if err != nil {
		return fmt.Errorf("[ERR] updating IP address: %w", err)
	}
	return nil
}

func (s *UserStore) GetUserByID(userID int64) (*User, error) {
	query := `
		SELECT user_id, name, email, password_hash, created_at, updated_at, ip_address
		FROM users
		WHERE user_id = $1
	`
	var user User
	err := s.db.QueryRow(query, userID).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.IPAddress,
	)
	if err != nil {
		return nil, fmt.Errorf("[ERR] getting user by ID: %w", err)
	}
	return &user, nil
}

func (s *UserStore) GetUserByEmail(email string) (*User, error) {
	query := `
		SELECT user_id, name, email, password_hash, created_at, updated_at, ip_address
		FROM users
		WHERE email = $1
	`
	var user User
	err := s.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.IPAddress,
	)
	if err != nil {
		return nil, fmt.Errorf("[ERR] getting user by email: %w", err)
	}
	return &user, nil
}

// UserAppStatStore handles user application statistics
type UserAppStatStore struct {
	db *sql.DB
}

// InitSchema initializes the user_app_stats table
func (s *UserAppStatStore) InitSchema(db *sql.DB) error {
	s.db = db
	query := `
		CREATE TABLE IF NOT EXISTS user_app_stats (
			user_id INTEGER PRIMARY KEY,
			last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_ip_address VARCHAR(255),
			FOREIGN KEY (user_id) REFERENCES users(user_id)
		)
	`
	_, err := s.db.Exec(query)
	return err
}

// InsertOrUpdateStat creates or updates user app statistics
func (s *UserAppStatStore) InsertOrUpdateStat(stat *UserAppStat) error {
	query := `
		INSERT INTO user_app_stats (user_id, last_login, last_ip_address, updated_at)
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
		ON CONFLICT (user_id) DO UPDATE SET
			last_login = EXCLUDED.last_login,
			last_ip_address = EXCLUDED.last_ip_address,
			updated_at = CURRENT_TIMESTAMP
	`
	_, err := s.db.Exec(query, stat.UserID, stat.LastLogin, stat.LastIPAddr)
	if err != nil {
		return fmt.Errorf("[ERR] inserting/updating user app stat: %w", err)
	}
	return nil
}

// GetStat retrieves user app statistics
func (s *UserAppStatStore) GetStat(userID int64) (*UserAppStat, error) {
	query := `
		SELECT user_id, last_login, updated_at, last_ip_address
		FROM user_app_stats
		WHERE user_id = $1
	`
	var stat UserAppStat
	err := s.db.QueryRow(query, userID).Scan(
		&stat.UserID,
		&stat.LastLogin,
		&stat.UpdatedAt,
		&stat.LastIPAddr,
	)
	if err != nil {
		return nil, fmt.Errorf("[ERR] getting user app stat: %w", err)
	}
	return &stat, nil
}

// UpdateLastLogin updates the last login timestamp
func (s *UserAppStatStore) UpdateLastLogin(userID int64) error {
	query := `
		UPDATE user_app_stats
		SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $1
	`
	_, err := s.db.Exec(query, userID)
	if err != nil {
		return fmt.Errorf("[ERR] updating last login: %w", err)
	}
	return nil
}

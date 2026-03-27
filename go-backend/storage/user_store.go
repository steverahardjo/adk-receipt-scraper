package storage

import (
	"fmt"
)

// --- SCHEMA INITIALIZATION ---

func (d *Database) InitUserSchema() error {
	// We combine both tables here since they are tightly coupled
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			user_id       SERIAL PRIMARY KEY,
			name          VARCHAR(255) NOT NULL,
			email         VARCHAR(255) NOT NULL UNIQUE,
			password_hash VARCHAR(255) NOT NULL,
			created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			ip_address    VARCHAR(255)
		);`,
		`CREATE TABLE IF NOT EXISTS user_app_stats (
			user_id         INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
			last_login      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_ip_address VARCHAR(255),
			updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		);`,
	}

	for _, q := range queries {
		if _, err := d.Conn.Exec(q); err != nil {
			return fmt.Errorf("[DB] failed to init user schemas: %w", err)
		}
	}
	return nil
}

// --- USER CORE METHODS ---

func (d *Database) InsertUser(u *User) error {
	query := `
		INSERT INTO users (name, email, password_hash, ip_address)
		VALUES ($1, $2, $3, $4)
		RETURNING user_id, created_at, updated_at`

	return d.Conn.QueryRow(query, u.Name, u.Email, u.PasswordHash, u.IPAddress).
		Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
}

func (d *Database) GetUserByID(userID int64) (*User, error) {
	var u User
	query := `SELECT user_id, name, email, password_hash, created_at, updated_at, ip_address
	          FROM users WHERE user_id = $1`

	err := d.Conn.QueryRow(query, userID).Scan(
		&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.CreatedAt, &u.UpdatedAt, &u.IPAddress,
	)
	return &u, err
}

func (d *Database) GetUserByEmail(email string) (*User, error) {
	var u User
	query := `SELECT user_id, name, email, password_hash, created_at, updated_at, ip_address
	          FROM users WHERE email = $1`

	err := d.Conn.QueryRow(query, email).Scan(
		&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.CreatedAt, &u.UpdatedAt, &u.IPAddress,
	)
	return &u, err
}

// --- USER UPDATE METHODS ---

func (d *Database) UpdateUserEmail(userID int64, newEmail string) error {
	query := `UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`
	_, err := d.Conn.Exec(query, newEmail, userID)
	return err
}

func (d *Database) UpdateUserIP(userID int64, ip string) error {
	query := `UPDATE users SET ip_address = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`
	_, err := d.Conn.Exec(query, ip, userID)
	return err
}

// --- USER STATS METHODS (Aggregated/Isolated) ---

func (d *Database) SyncUserStats(stat *UserAppStat) error {
	query := `
		INSERT INTO user_app_stats (user_id, last_login, last_ip_address, updated_at)
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
		ON CONFLICT (user_id) DO UPDATE SET
			last_login = EXCLUDED.last_login,
			last_ip_address = EXCLUDED.last_ip_address,
			updated_at = CURRENT_TIMESTAMP`

	_, err := d.Conn.Exec(query, stat.UserID, stat.LastLogin, stat.LastIPAddr)
	return err
}

func (d *Database) GetUserStats(userID int64) (*UserAppStat, error) {
	var s UserAppStat
	query := `SELECT user_id, last_login, updated_at, last_ip_address
	          FROM user_app_stats WHERE user_id = $1`

	err := d.Conn.QueryRow(query, userID).Scan(&s.UserID, &s.LastLogin, &s.UpdatedAt, &s.LastIPAddr)
	return &s, err
}

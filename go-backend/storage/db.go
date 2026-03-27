// interface to talk to our postgresql database for all the file for everything
package storage

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq" // Driver registration
)

type Database struct {
	Conn *sql.DB
}

// GetConnStr builds the string from Env.
// Moved out of const because os.Getenv happens at runtime.
func GetConnStr() string {
	host := "localhost"
	port := os.Getenv("DB_PORT") // Changed from PORT to avoid web server conflicts
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")

	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, pass, name)
}

func ConnectPostgres(connStr string, max_pool int) (*Database, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("[DB] Connection open error: %w", err)
	}

	if err = db.Ping(); err != nil {
		return nil, fmt.Errorf("[DB] Ping failed: %w", err)
	}

	db.SetMaxOpenConns(max_pool)
	db.SetMaxIdleConns(max_pool)

	return &Database{Conn: db}, nil
}

func (d *Database) Close() {
	if err := d.Conn.Close(); err != nil {
		log.Printf("[ERR] Closing database: %v", err)
	}
}

// InitAllSchemas runs all table creations in the correct order.
// This is better than separate InitSchema calls in every file.
func (d *Database) InitAllSchemas() error {
	// 1. Users first (needed for foreign keys)
	// 2. Expenses & Profiles next
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
		`CREATE TABLE IF NOT EXISTS expenses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            title VARCHAR(255) NOT NULL,
            amount NUMERIC NOT NULL,
            currency VARCHAR(10) NOT NULL,
            date TIMESTAMP NOT NULL,
            type VARCHAR(50),
            payment_method VARCHAR(50),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
		`CREATE TABLE IF NOT EXISTS profiles (
            user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
            nickname VARCHAR(256) NOT NULL,
            money_source TEXT NOT NULL,
            month_budget NUMERIC NOT NULL,
            owned_assets JSONB
        );`,
	}

	for _, q := range queries {
		if _, err := d.Conn.Exec(q); err != nil {
			return fmt.Errorf("[DB] Schema init failed: %w", err)
		}
	}
	return nil
}

func (d *Database) Reset() {
	log.Println("[WARN] Resetting entire database schema...")
	commands := []string{
		"DROP SCHEMA public CASCADE;",
		"CREATE SCHEMA public;",
		"GRANT ALL ON SCHEMA public TO postgres;",
		"GRANT ALL ON SCHEMA public TO public;",
	}

	for _, q := range commands {
		if _, err := d.Conn.Exec(q); err != nil {
			log.Printf("[DEBUG-ERR] Reset step failed: %v", err)
		}
	}
}

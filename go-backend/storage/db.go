//interface to talk to our postgresql database for all the file for everything

package storage

import (
	sql "database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type Database struct {
	Conn *sql.DB
}

func ConnectPostgres(connStr string) (*Database, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("[DB] Unable to connect: %w", err)
	}
	//test connection through ping
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("[DB] Unable to ping: %w", err)
	}
	return &Database{Conn: db}, nil
}

func (d *Database) Close() {
	if err := d.Conn.Close(); err != nil {
		log.Printf("[ERR] Error closing database: %v", err)
	}
}

func (d *Database) Reset() {
	// This kills everything: tables, types, and sequences
	commands := []string{
		"DROP SCHEMA public CASCADE;",
		"CREATE SCHEMA public;",
		"GRANT ALL ON SCHEMA public TO postgres;",
		"GRANT ALL ON SCHEMA public TO public;",
	}

	for _, q := range commands {
		if _, err := d.Conn.Exec(q); err != nil {
			log.Printf("[DEBUG-ERR] Reset failed: %v", err)
		}
	}
}

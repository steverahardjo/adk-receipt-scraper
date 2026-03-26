package storage

import (
	"database/sql"
	"github.com/pq"
)

type User struct {
	user_id int64
	name string
	email string
	passwordHash string
	ipAddress string
}

query:= `
CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ip_address VARCHAR(255)
);
`

func (d *Database) MakeUserStore() (*UserStore, error) {
	_, err := d.db.Exec(query)
	if err != nil {
		return nil, err
	}
	return &UserStore{db: db}, nil
}

func (d *Database) InsertUser()

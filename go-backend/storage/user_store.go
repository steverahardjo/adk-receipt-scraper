package storage

func (d *Database) GetUserByID(userID int64) (*User, error) {
	var u User
	query := `SELECT id, name, email, updated_at, created_at
	          FROM "user" WHERE user_id = $1`

	err := d.Conn.QueryRow(query, userID).Scan(
		&u.ID, &u.Name, &u.Email, &u.UpdatedAt,
	)
	return &u, err
}

func (d *Database) GetUserByEmail(email string) (*User, error) {
	var u User
	query := `SELECT id, name, email, updated_at, created_at
	          FROM "user" WHERE email = $1`

	err := d.Conn.QueryRow(query, email).Scan(
		&u.ID, &u.Name, &u.Email, &u.UpdatedAt,
	)
	return &u, err
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

package storage

func (d *Database) InitProfileSchema() error {
	_, err := d.Conn.Exec(`
        CREATE TABLE IF NOT EXISTS profiles (
            user_id      INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
            nickname     VARCHAR(256) NOT NULL,
            money_source TEXT NOT NULL,
            month_budget NUMERIC(15, 2) NOT NULL,
            quant_asset NUMERIC(15, 2)
        )`)
	return err
}

func (d *Database) GetProfile(userID int64) (*Profile, error) {
	var p Profile
	query := `SELECT user_id, nickname, money_source, month_budget FROM profiles WHERE user_id = $1`

	err := d.Conn.QueryRow(query, userID).Scan(&p.ID, &p.Nickname, &p.MoneySource, &p.MonthBudget)
	return &p, err
}

func (d *Database) UpdateProfile(p *Profile) error {
	query := `UPDATE profiles SET nickname = $2, money_source = $3, month_budget = $4 WHERE user_id = $1`
	_, err := d.Conn.Exec(query, p.ID, p.Nickname, p.MoneySource, p.MonthBudget)
	return err
}

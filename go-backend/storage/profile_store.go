// Storing useful aggregated info about users for dashboard
package storage

import (
	"database/sql"
	"encoding/json"
	"fmt"
)

type ProfileStore struct {
	db *sql.DB
}

func (s *ProfileStore) InitSchema(db *sql.DB) error {
	s.db = db
	_, err := s.db.Exec(`
		CREATE TABLE IF NOT EXISTS profiles (
			user_id INTEGER PRIMARY KEY,
			nickname VARCHAR(256) NOT NULL,
			money_source TEXT NOT NULL,
			month_budget NUMERIC NOT NULL,
			owned_assets JSONB
		)
	`)
	return err
}

func (s *ProfileStore) InsertProfile(profile *Profile) error {
	assetsJSON, err := json.Marshal(profile.OwnedAssets)
	if err != nil {
		return fmt.Errorf("[ERR] marshaling owned_assets: %w", err)
	}

	query := `
		INSERT INTO profiles (
			user_id, nickname, money_source, month_budget, owned_assets
		) VALUES ($1, $2, $3, $4, $5)
	`
	_, err = s.db.Exec(query, profile.ID, profile.Nickname, profile.MoneySource, profile.MonthBudget, assetsJSON)
	return err
}

func (s *ProfileStore) GetProfile(userID int64) (*Profile, error) {
	row := s.db.QueryRow(`
		SELECT user_id, nickname, money_source, month_budget, owned_assets 
		FROM profiles WHERE user_id = $1
	`, userID)

	var profile Profile
	var assetsJSON []byte
	err := row.Scan(&profile.ID, &profile.Nickname, &profile.MoneySource, &profile.MonthBudget, &assetsJSON)
	if err != nil {
		return nil, fmt.Errorf("[ERR] getting profile: %w", err)
	}

	if len(assetsJSON) > 0 {
		if err := json.Unmarshal(assetsJSON, &profile.OwnedAssets); err != nil {
			return nil, fmt.Errorf("[ERR] unmarshaling owned_assets: %w", err)
		}
	}

	return &profile, nil
}

func (s *ProfileStore) UpdateProfile(profile *Profile) error {
	assetsJSON, err := json.Marshal(profile.OwnedAssets)
	if err != nil {
		return fmt.Errorf("[ERR] marshaling owned_assets: %w", err)
	}

	query := `
		UPDATE profiles 
		SET nickname = $2, money_source = $3, month_budget = $4, owned_assets = $5
		WHERE user_id = $1
	`
	_, err = s.db.Exec(query, profile.ID, profile.Nickname, profile.MoneySource, profile.MonthBudget, assetsJSON)
	return err
}

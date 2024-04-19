package models

import (
	"time"
)

type Site struct {
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
	Setup            bool      `json:"setup"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	OpenRegistration bool      `json:"openRegistration"`
}

func (db DB) SiteGet() (*Site, error) {
	const query = `
		SELECT created_at,updated_at,setup,name,description,open_registration
		FROM site
	`

	var site Site

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query).Scan(
		&site.CreatedAt,
		&site.UpdatedAt,
		&site.Setup,
		&site.Name,
		&site.Description,
		&site.OpenRegistration,
	)

	if err != nil {
		return nil, err
	}

	return &site, nil
}

func (db DB) GetAdminCount() (int64, error) {
	const query = `
		SELECT COUNT(*)
		FROM user_
		WHERE role = 'ADMIN'
	`

	var adminCount int64

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query).Scan(&adminCount)
	if err != nil {
		return 0, err
	}

	return adminCount, nil
}

package models

import (
	"context"
	"embed"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

type DB struct {
	PG *pgxpool.Pool
}

func OpenDatabase(connString string) (DB, error) {
	slog.Info("Connecting to database...")

	pg, err := pgxpool.New(context.Background(), connString)
	if err != nil {
		return DB{}, err
	}

	// Wait 30 seconds for database to boot
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	err = pg.Ping(ctx)
	if err != nil {
		return DB{}, err
	}

	// Return the sql.DB connection pool.
	return DB{pg}, nil
}

func (db DB) Migrate(migrationsFS embed.FS) error {
	goose.SetBaseFS(migrationsFS)

	if err := goose.SetDialect("postgres"); err != nil {
		return err
	}

	sqlDB := stdlib.OpenDBFromPool(db.PG)

	if err := goose.Up(sqlDB, "migrations"); err != nil {
		return err
	}

	return nil
}

func (db DB) context() (context.Context, context.CancelFunc) {
	const dbTimeout = 3 * time.Second

	return context.WithTimeout(context.Background(), dbTimeout)
}

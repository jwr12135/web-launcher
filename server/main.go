package main

import (
	"embed"
	"log/slog"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/lmittmann/tint"
	"github.com/sourcetab/sourcetab/internal/models"
	"github.com/sourcetab/sourcetab/internal/serve"
)

//go:embed migrations
var migrationsFS embed.FS

//go:embed "public"
var publicFS embed.FS

func main() {
	slog.SetDefault(slog.New(
		tint.NewHandler(os.Stdout, &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: time.DateTime,
		}),
	))

	port := 3333
	dbConnString := "postgres://sourcetab:sourcetab@/sourcetab?sslmode=disable"
	enableLimiter := true
	ipHeader := ""

	db, err := models.OpenDatabase(dbConnString)
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	defer db.PG.Close()

	err = db.Migrate(migrationsFS)
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}

	adminCount, err := db.GetAdminCount()
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}

	if adminCount == 0 {
		serve.AdminRegisterCode = uuid.New()
		slog.Warn("No admins detected. Visit the following URL to register: http://localhost:3333/register?admin=" + serve.AdminRegisterCode.String())
	}

	err = serve.Serve(serve.ServeConfig{
		Port:          port,
		DB:            db,
		EnableLimiter: enableLimiter,
		IpHeader:      ipHeader,
		PublicFS:      publicFS,
	})
	if err != nil {
		slog.Error(err.Error())
	}
}

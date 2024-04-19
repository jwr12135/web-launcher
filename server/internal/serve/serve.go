package serve

import (
	"context"
	"embed"
	"errors"
	"fmt"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/sourcetab/sourcetab/internal/models"
)

type ServeConfig struct {
	Port          int
	DB            models.DB
	EnableLimiter bool
	IpHeader      string
	PublicFS      embed.FS
}

func Serve(config ServeConfig) error {
	rootMux := http.NewServeMux()
	apiMux := http.NewServeMux()

	apiMux.HandleFunc("GET /api/v1/site", siteGetHandler)

	apiMux.HandleFunc("GET /api/v1/auth/status", statusHandler)
	apiMux.HandleFunc("POST /api/v1/auth/register", registerHandler)
	apiMux.HandleFunc("POST /api/v1/auth/login", loginHandler)
	apiMux.HandleFunc("POST /api/v1/auth/refresh", refreshHandler)
	apiMux.HandleFunc("POST /api/v1/auth/logout", logoutHandler)

	apiMux.HandleFunc("GET /api/v1/users", userListHandler)
	apiMux.HandleFunc("GET /api/v1/users/{username}", userGetHandler)

	apiMux.HandleFunc("GET /api/v1/projects", projectListHandler)
	apiMux.HandleFunc("GET /api/v1/projects/{id}", projectGetByIDHandler)
	apiMux.HandleFunc("POST /api/v1/projects/{id}/star", projectCreateStar)
	apiMux.HandleFunc("DELETE /api/v1/projects/{id}/star", projectDeleteStar)

	var apiHandler http.Handler = apiMux
	apiHandler = authMiddleware(apiHandler, config.DB)
	apiHandler = limiterMiddleware(apiHandler, config.EnableLimiter, config.IpHeader)
	apiHandler = corsMiddleware(apiHandler)
	rootMux.Handle("/api/", apiHandler)

	publicFSRoot, err := fs.Sub(config.PublicFS, "public")
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}

	rootMux.Handle("/", spaMiddleware(http.FileServer(http.FS(publicFSRoot)), publicFSRoot))

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", config.Port),
		Handler:      logMiddleware(rootMux),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	shutdownError := make(chan error)

	go func() {
		quit := make(chan os.Signal, 1)

		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

		<-quit

		slog.Info("Stopping server...")

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err := srv.Shutdown(ctx)
		if err != nil {
			shutdownError <- err
		}

		shutdownError <- nil
	}()

	slog.Info("Starting server...")
	slog.Info(fmt.Sprintf("Listening on http://localhost%s", srv.Addr))

	err = srv.ListenAndServe()
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	err = <-shutdownError
	if err != nil {
		return err
	}

	return nil
}

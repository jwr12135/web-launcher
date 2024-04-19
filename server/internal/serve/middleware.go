package serve

import (
	"crypto/md5"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net"
	"net/http"
	"os"
	"path"
	"strings"
	"sync"
	"time"

	"log/slog"

	"github.com/google/uuid"
	"github.com/sourcetab/sourcetab/internal/models"
	"github.com/sourcetab/sourcetab/internal/utils"
	"golang.org/x/time/rate"
)

func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		slog.Debug(r.Method + " " + r.Host + r.RequestURI + " " + r.Proto + " from " + r.RemoteAddr)

		next.ServeHTTP(w, r)
	})
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func limiterMiddleware(next http.Handler, enabled bool, ipHeader string) http.Handler {
	if !enabled {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			next.ServeHTTP(w, r)
		})
	}

	const requestRate = 2
	const requestBursts = 4
	const cleanUpDuration = 10 * time.Minute

	type client struct {
		limiter  *rate.Limiter
		lastSeen time.Time
	}

	var (
		mu      sync.Mutex
		clients = make(map[string]*client)
	)

	go func() {
		for {
			time.Sleep(cleanUpDuration / 2)

			mu.Lock()

			for ip, client := range clients {
				if time.Since(client.lastSeen) > cleanUpDuration {
					delete(clients, ip)
				}
			}

			mu.Unlock()
		}
	}()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var ip string

		if ipHeader == "" {
			// Remove port number if present
			if strings.ContainsRune(r.RemoteAddr, ':') {
				ip, _, _ = net.SplitHostPort(r.RemoteAddr)
			} else {
				ip = r.RemoteAddr
			}
		} else {
			ip = r.Header.Get(ipHeader)
		}

		mu.Lock()

		if _, found := clients[ip]; !found {
			clients[ip] = &client{
				limiter: rate.NewLimiter(rate.Limit(requestRate), requestBursts),
			}
		}

		clients[ip].lastSeen = time.Now()

		if !clients[ip].limiter.Allow() {
			mu.Unlock()
			slog.Warn(fmt.Sprintf(ip + " was rate limited"))
			utils.ClientError(w, 429)
			return
		}

		mu.Unlock()

		next.ServeHTTP(w, r)
	})
}

func authMiddleware(next http.Handler, db models.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session := models.AnonymousSession
		user := models.AnonymousUser

		w.Header().Set("Vary", "Authorization")

		authorizationHeader := r.Header.Get("Authorization")

		if authorizationHeader != "" {
			headerParts := strings.Split(authorizationHeader, " ")
			// Invalid authorization format
			if len(headerParts) != 2 || headerParts[0] != "Bearer" {
				utils.ClientError(w, http.StatusUnauthorized)
				return
			}

			sessionToken, err := uuid.Parse(headerParts[1])
			if err != nil {
				utils.ClientError(w, http.StatusUnauthorized)
				return
			}

			newSession := &models.Session{
				ID: sessionToken,
			}
			newUser, err := db.UserGetWithSession(newSession)
			if err == nil {
				session = newSession
				user = newUser
			}
		}

		r = contextSetDB(r, db)
		r = contextSetSession(r, session)
		r = contextSetUser(r, user)

		next.ServeHTTP(w, r)
	})
}

func spaMiddleware(next http.Handler, publicFS fs.FS) http.Handler {
	etags := make(map[string]string)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p := strings.TrimLeft(path.Clean(r.URL.Path), "/")
		if _, err := publicFS.Open(p); p == "" || errors.Is(err, os.ErrNotExist) {
			p = "index.html"
			r.URL.Path = "/"
		}

		if etags[p] == "" {
			h := md5.New()
			f, err := publicFS.Open(p)
			if err != nil {
				utils.ServerError(w, err)
				return
			}
			if _, err := io.Copy(h, f); err != nil {
				utils.ServerError(w, err)
				return
			}
			etags[p] = fmt.Sprintf("%x", h.Sum(nil))
		}

		if match := r.Header.Get("If-None-Match"); match == etags[p] {
			w.WriteHeader(http.StatusNotModified)
			return
		}

		w.Header().Add("ETag", etags[p])

		next.ServeHTTP(w, r)
	})
}

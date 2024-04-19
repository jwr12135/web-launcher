package serve

import (
	"context"
	"net/http"

	"github.com/sourcetab/sourcetab/internal/models"
)

type contextKey string

const contextKeyDB contextKey = "db"
const contextKeyUser contextKey = "user"
const contextKeySession contextKey = "session"

func contextSetDB(r *http.Request, db models.DB) *http.Request {
	ctx := context.WithValue(r.Context(), contextKeyDB, db)
	return r.WithContext(ctx)
}
func contextDB(r *http.Request) models.DB {
	db, ok := r.Context().Value(contextKeyDB).(models.DB)
	if !ok {
		panic("missing db value in request context")
	}

	return db
}

func contextSetUser(r *http.Request, user *models.User) *http.Request {
	ctx := context.WithValue(r.Context(), contextKeyUser, user)
	return r.WithContext(ctx)
}
func contextUser(r *http.Request) *models.User {
	user, ok := r.Context().Value(contextKeyUser).(*models.User)
	if !ok {
		panic("missing user value in request context")
	}

	return user
}

func contextSetSession(r *http.Request, session *models.Session) *http.Request {
	ctx := context.WithValue(r.Context(), contextKeySession, session)
	return r.WithContext(ctx)
}
func contextSession(r *http.Request) *models.Session {
	session, ok := r.Context().Value(contextKeySession).(*models.Session)
	if !ok {
		panic("missing session value in request context")
	}

	return session
}

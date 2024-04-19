package models

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	ID      uuid.UUID `json:"-"`
	UserID  int64     `json:"-"`
	Expires time.Time `json:"expires"`
}

var AnonymousSession = &Session{}

func (session *Session) IsAnonymous() bool {
	return session == AnonymousSession
}

func (db DB) SessionNew(userID int64) (*Session, error) {
	sessionToken, err := uuid.NewRandom()
	if err != nil {
		return nil, err
	}

	session := Session{
		ID:      sessionToken,
		UserID:  userID,
		Expires: time.Now().Add(2160 * time.Hour /* 90 days */),
	}

	err = db.SessionInsert(&session)
	if err != nil {
		return nil, err
	}

	return &session, err
}

func (db DB) SessionInsert(session *Session) error {
	const query = `
		INSERT INTO session (id, user_id, expires)
		VALUES ($1, $2, $3)
	`

	args := []interface{}{session.ID, session.UserID, session.Expires}

	ctx, cancel := db.context()
	defer cancel()

	_, err := db.PG.Exec(ctx, query, args...)
	return err
}

func (db DB) SessionDelete(session *Session) error {
	const query = `
		DELETE FROM session
		WHERE id = $1
	`

	ctx, cancel := db.context()
	defer cancel()

	_, err := db.PG.Exec(ctx, query, session.ID)
	return err
}

func (db DB) SessionDeleteAllForUser(userID int64) error {
	const query = `
		DELETE FROM session
		WHERE user_id = $1
	`

	ctx, cancel := db.context()
	defer cancel()

	_, err := db.PG.Exec(ctx, query, userID)
	return err
}

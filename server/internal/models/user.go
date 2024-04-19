package models

import (
	"time"

	"github.com/alexedwards/argon2id"
)

type User struct {
	ID           int64     `json:"id"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	Username     string    `json:"username"`
	Email        string    `json:"-"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	DisplayName  string    `json:"displayName"`
	About        string    `json:"about"`
}

var AnonymousUser = &User{Role: "GUEST"}

func (user *User) IsAnonymous() bool {
	return user == AnonymousUser
}

func (user *User) SetPassword(password string) error {
	passwordHash, err := argon2id.CreateHash(password, argon2id.DefaultParams)
	if err != nil {
		return err
	}

	user.PasswordHash = passwordHash
	return nil
}

func (user *User) ComparePassword(password string) (bool, error) {
	match, err := argon2id.ComparePasswordAndHash(password, user.PasswordHash)
	if err != nil {
		return false, err
	}

	return match, nil
}

func (db DB) UserCreate(user *User) error {
	const query = `
		INSERT INTO user_ (username, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at
	`

	args := []interface{}{user.Username, user.Email, user.PasswordHash}

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, args...).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return err
	}

	return nil
}

func (db DB) UserCreateAdmin(user *User) error {
	const query = `
		INSERT INTO user_ (username, email, password_hash, role)
		VALUES ($1, $2, $3, 'ADMIN')
		RETURNING id, created_at, updated_at, role
	`

	args := []interface{}{user.Username, user.Email, user.PasswordHash}

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, args...).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt, &user.Role)
	if err != nil {
		return err
	}

	return nil
}

func (db DB) UserGet(username string) (*User, error) {
	const query = `
		SELECT id, created_at,updated_at,username,email,password_hash,role,display_name,about
		FROM user_
		WHERE username = $1
	`

	var user User

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, username).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.DisplayName,
		&user.About,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (db DB) UserUpdate(user *User) error {
	const query = `
		UPDATE user_
		SET updated_at = now(), email = $2, password_hash = $3
		WHERE id = $1
		RETURNING updated_at
	`

	args := []interface{}{
		user.ID,
		user.Email,
		user.PasswordHash,
	}

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, args...).Scan(&user.UpdatedAt)
	if err != nil {
		return err
	}

	return nil
}

func (db DB) UserGetWithSession(session *Session) (*User, error) {
	query := `
		SELECT 
			u.id,u.created_at,u.updated_at,u.username,u.email,u.password_hash,u.role,u.display_name,u.about,
			s.expires
		FROM session s JOIN user_ u ON s.user_id=u.id
    WHERE s.id = $1
			AND s.expires > $2
	`

	args := []interface{}{session.ID, time.Now()}

	var user User

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, args...).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.DisplayName,
		&user.About,
		&session.Expires,
	)
	if err != nil {
		return nil, err
	}

	session.UserID = user.ID

	return &user, nil
}

func (db DB) UserList() ([]User, error) {
	const query = `
		SELECT id, created_at,updated_at,username,email,password_hash,role,display_name,about
		FROM user_
	`

	ctx, cancel := db.context()
	defer cancel()

	rows, err := db.PG.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []User
	for rows.Next() {
		var user User
		if err := rows.Scan(
			&user.ID,
			&user.CreatedAt,
			&user.UpdatedAt,
			&user.Username,
			&user.Email,
			&user.PasswordHash,
			&user.Role,
			&user.DisplayName,
			&user.About,
		); err != nil {
			return nil, err
		}
		items = append(items, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}

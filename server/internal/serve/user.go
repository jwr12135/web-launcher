package serve

import (
	"errors"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/sourcetab/sourcetab/internal/utils"
)

func userListHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)

	users, err := db.UserList()
	if err != nil {
		utils.ServerError(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, users, http.Header{})
}

func userGetHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)

	username := r.PathValue("username")

	user, err := db.UserGet(username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			utils.NotFoundError(w)
		} else {
			utils.ServerError(w, err)
		}
		return
	}

	utils.WriteJSON(w, http.StatusOK, user, http.Header{})
}

package serve

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/sourcetab/sourcetab/internal/models"
	"github.com/sourcetab/sourcetab/internal/utils"
)

var AdminRegisterCode uuid.UUID

type registerParams struct {
	Username  string `json:"username" validate:"required,min=3"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=8"`
	AdminCode string `json:"adminCode"`
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)

	var params registerParams
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		utils.ClientError(w, http.StatusBadRequest)
		return
	}
	validate := validator.New(validator.WithRequiredStructEnabled())
	err = validate.Struct(params)
	if err != nil {
		utils.ClientError(w, http.StatusBadRequest)
		return
	}

	isAdmin := false
	if params.AdminCode != "" {
		adminCodeUUID, err := uuid.Parse(params.AdminCode)
		if err != nil {
			utils.ClientError(w, http.StatusForbidden)
			return
		}
		if adminCodeUUID == AdminRegisterCode {
			isAdmin = true
		} else {
			utils.ClientError(w, http.StatusForbidden)
			return
		}
	}

	user := models.User{
		Username: params.Username,
		Email:    params.Email,
	}
	err = user.SetPassword(params.Password)
	if err != nil {
		utils.ServerError(w, err)
		return
	}

	if isAdmin {
		err = db.UserCreateAdmin(&user)
	} else {
		err = db.UserCreate(&user)
	}
	if err != nil {
		utils.ServerError(w, err)
		return
	}

	w.WriteHeader(http.StatusCreated)

	if isAdmin {
		AdminRegisterCode = uuid.UUID{}
	}
}

// TODO: Add password min length here
type loginParams struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)

	var params loginParams
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		utils.ClientError(w, http.StatusBadRequest)
		return
	}
	validate := validator.New(validator.WithRequiredStructEnabled())
	err = validate.Struct(params)
	if err != nil {
		utils.ClientError(w, http.StatusBadRequest)
		return
	}

	user, err := db.UserGet(params.Username)
	// Username does not exist
	if err != nil {
		utils.ClientError(w, http.StatusUnauthorized)
		return
	}

	// Password does not match
	passwordMatches, err := user.ComparePassword(params.Password)
	if err != nil || !passwordMatches {
		utils.ClientError(w, http.StatusUnauthorized)
		return
	}

	session, err := db.SessionNew(user.ID)
	if err != nil {
		utils.ServerError(w, err)
		return
	}
	utils.WriteJSON(w, http.StatusOK, utils.JsonWrap{
		"session": utils.JsonWrap{
			"token":   session.ID,
			"expires": session.Expires,
		},
		"user": user,
	}, http.Header{})
}

func refreshHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)
	oldSession := contextSession(r)

	if oldSession.IsAnonymous() {
		utils.ClientError(w, http.StatusUnauthorized)
		return
	}

	user := contextUser(r)

	session, err := db.SessionNew(user.ID)
	if err != nil {
		utils.ServerError(w, err)
		return
	}
	utils.WriteJSON(w, http.StatusOK, utils.JsonWrap{
		"session": utils.JsonWrap{
			"token":   session.ID,
			"expires": session.Expires,
		},
	}, http.Header{})

	db.SessionDelete(oldSession)
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)
	oldSession := contextSession(r)

	if oldSession.IsAnonymous() {
		utils.ClientError(w, http.StatusUnauthorized)
		return
	}

	err := db.SessionDelete(oldSession)
	if err != nil {
		utils.ServerError(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, utils.JsonWrap{
		"user": models.AnonymousUser,
	}, http.Header{})
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	session := contextSession(r)
	user := contextUser(r)

	utils.WriteJSON(w, http.StatusOK, utils.JsonWrap{
		"session": session,
		"user":    user,
	}, http.Header{})
}

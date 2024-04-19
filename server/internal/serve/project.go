package serve

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/sourcetab/sourcetab/internal/models"
	"github.com/sourcetab/sourcetab/internal/utils"
)

func projectListHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)
	user := contextUser(r)

	params := models.ProjectListParams{
		Sort:        r.URL.Query().Get("sort"),
		CreatedBy:   r.URL.Query().Get("createdBy"),
		StaredBy:    r.URL.Query().Get("staredBy"),
		ProjectType: r.URL.Query().Get("projectType"),
	}

	projects, err := db.ProjectList(user.ID, params)
	if err != nil {
		utils.ServerError(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, projects, http.Header{})
}

func projectGetByIDHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)
	user := contextUser(r)

	resourceIDInt, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.NotFoundError(w)
		return
	}

	resourceID := int64(resourceIDInt)

	project, err := db.ProjectGet(resourceID, user.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			utils.NotFoundError(w)
		} else {
			utils.ServerError(w, err)
		}
		return
	}

	utils.WriteJSON(w, http.StatusOK, project, http.Header{})
}

func projectCreateStar(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)
	user := contextUser(r)
	if user.IsAnonymous() {
		utils.ClientError(w, http.StatusUnauthorized)
		return
	}

	resourceIDInt, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.NotFoundError(w)
		return
	}

	resourceID := int64(resourceIDInt)

	projectStars, err := db.ProjectCreateStar(resourceID, user.ID)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.ConstraintName == "project_star_project_id_fkey" {
			utils.NotFoundError(w)
		} else {
			utils.ServerError(w, err)
		}
		return
	}

	utils.WriteJSON(w, http.StatusOK, utils.JsonWrap{
		"stats": utils.JsonWrap{
			"stars": projectStars,
		},
		"isStared": true,
	}, http.Header{})
}

func projectDeleteStar(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)
	user := contextUser(r)

	if user.IsAnonymous() {
		utils.ClientError(w, http.StatusUnauthorized)
		return
	}

	resourceIDInt, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.NotFoundError(w)
		return
	}

	resourceID := int64(resourceIDInt)

	projectStars, err := db.ProjectDeleteStar(resourceID, user.ID)
	if err != nil {
		utils.ServerError(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, utils.JsonWrap{
		"stats": utils.JsonWrap{
			"stars": projectStars,
		},
		"isStared": false,
	}, http.Header{})
}

func projectCreateHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)
	user := contextUser(r)

	if user.IsAnonymous() {
		utils.ClientError(w, http.StatusUnauthorized)
		return
	}

	var params resourceReq

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		utils.ClientError(w, http.StatusBadRequest)
		return
	}

	if !isValidResource(&params) {
		utils.ClientError(w, http.StatusBadRequest)
		return
	}

	resourceDataInterface, err := json.Marshal(
		&params.Data,
	)
	if err != nil {
		utils.ClientError(w, http.StatusBadRequest)
	}

	project := models.Project{
		Type:       params.Type,
		UserID:     user.ID,
		Visibility: params.Visibility,
		Name:       params.Name,
		Data:       resourceDataInterface,
	}
	err = db.ProjectCreate(&project)
	if err != nil {
		utils.ServerError(w, err)
	}

	utils.WriteJSON(w, http.StatusOK, project, http.Header{})
}

type resourceReq struct {
	Type       string      `json:"type"`
	Visibility string      `json:"visibility"`
	Name       string      `json:"name"`
	Data       interface{} `json:"data"`
}

func isValidResource(project *resourceReq) bool {
	switch project.Type {
	case
		"workspace":
		return true
	}

	return false
}

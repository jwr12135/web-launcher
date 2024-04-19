package models

import (
	"encoding/json"
	"time"
)

type Project struct {
	ID         int64           `json:"id"`
	CreatedAt  time.Time       `json:"createdAt"`
	UpdatedAt  time.Time       `json:"updatedAt"`
	Type       string          `json:"type"`
	UserID     int64           `json:"userID"`
	Visibility string          `json:"visibility"`
	Name       string          `json:"name"`
	Data       json.RawMessage `json:"data"`
}

type ProjectStats struct {
	Stars int64 `json:"stars"`
}

type ProjectView struct {
	Project  Project      `json:"project"`
	Creator  User         `json:"creator"`
	Stats    ProjectStats `json:"stats"`
	IsStared bool         `json:"isStared"`
}

func (db DB) ProjectCreate(project *Project) error {
	const query = `
		INSERT INTO project (type, user_id, visibility, name, data)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`

	args := []interface{}{project.Type, project.UserID, project.Visibility, project.Name, project.Data}

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, args...).Scan(&project.ID, &project.CreatedAt, &project.UpdatedAt)
	if err != nil {
		return err
	}

	return nil
}

// Retrieves a public project or a project under the listed user, a userID of 0 represents no user.
func (db DB) ProjectGet(id int64, requestingUserID int64) (*ProjectView, error) {
	const query = `
		SELECT p.id, p.created_at, p.updated_at, p.type, p.user_id, p.visibility, p.name, p.data,
			u.id,u.created_at,u.updated_at,u.username,u.email,u.password_hash,u.role,u.display_name,u.about,
			COALESCE((SELECT COUNT(*) AS value
						FROM project_star
						GROUP BY project_id
						HAVING project_id=p.id),0) stars,
			EXISTS(SELECT * FROM project_star WHERE project_id=p.id AND user_id=$2)
		FROM project p
			JOIN user_ u ON p.user_id=u.id
		WHERE p.id = $1 AND (visibility = 'public' OR u.id = $2)
	`

	projectView := ProjectView{}

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, id, requestingUserID).Scan(
		&projectView.Project.ID,
		&projectView.Project.CreatedAt,
		&projectView.Project.UpdatedAt,
		&projectView.Project.Type,
		&projectView.Project.UserID,
		&projectView.Project.Visibility,
		&projectView.Project.Name,
		&projectView.Project.Data,
		&projectView.Creator.ID,
		&projectView.Creator.CreatedAt,
		&projectView.Creator.UpdatedAt,
		&projectView.Creator.Username,
		&projectView.Creator.Email,
		&projectView.Creator.PasswordHash,
		&projectView.Creator.Role,
		&projectView.Creator.DisplayName,
		&projectView.Creator.About,
		&projectView.Stats.Stars,
		&projectView.IsStared,
	)

	if err != nil {
		return nil, err
	}

	return &projectView, nil
}

func (db DB) ProjectCreateStar(id int64, userID int64) (*int64, error) {
	const query = `
		WITH inserted_row AS (
			INSERT INTO project_star (project_id,user_id)
			VALUES ($1,$2)
			ON CONFLICT DO NOTHING
			RETURNING *
		)
		SELECT COUNT(*) FROM (
			SELECT user_id FROM project_star WHERE project_id=$1
			UNION SELECT user_id FROM inserted_row) stars;
	`

	var projectStars int64

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, id, userID).Scan(
		&projectStars,
	)

	if err != nil {
		return nil, err
	}

	return &projectStars, nil
}

func (db DB) ProjectDeleteStar(id int64, userID int64) (*int64, error) {
	const query = `
		WITH deleted_row AS (
			DELETE FROM project_star
			WHERE project_id=$1 AND user_id=$2
			RETURNING *
		)
		SELECT COUNT(*) FROM (
			SELECT user_id FROM project_star WHERE project_id=$1
			EXCEPT SELECT user_id FROM deleted_row) stars;
	`

	var projectStars int64

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, id, userID).Scan(
		&projectStars,
	)

	if err != nil {
		return nil, err
	}

	return &projectStars, nil
}

func (db DB) ProjectUpdate(project *Project, userID int64) error {
	const query = `
		UPDATE project
		SET updated_at = now(), visibility = $3, name = $4, data = $5
		WHERE id = $1 AND user_id = $2
		RETURNING updated_at
	`

	args := []interface{}{
		project.ID,
		userID,
		project.Visibility,
		project.Name,
		project.Data,
	}

	ctx, cancel := db.context()
	defer cancel()

	err := db.PG.QueryRow(ctx, query, args...).Scan(&project.UpdatedAt)
	if err != nil {
		return err
	}

	return nil
}

type ProjectListParams struct {
	Sort        string
	CreatedBy   string
	StaredBy    string
	ProjectType string
}

func (db DB) ProjectList(requestingUserID int64, params ProjectListParams) ([]ProjectView, error) {
	const query = `
		SELECT p.id, p.created_at, p.updated_at, p.type, p.user_id, p.visibility, p.name, p.data,
			u.id,u.created_at,u.updated_at,u.username,u.email,u.password_hash,u.role,u.display_name,u.about,
			COALESCE((SELECT COUNT(*) AS value
						FROM project_star
						GROUP BY project_id
						HAVING project_id=p.id),0) stars,
			EXISTS(SELECT * FROM project_star WHERE project_id=p.id AND user_id=$1)
		FROM project p
			JOIN user_ u ON p.user_id=u.id
		WHERE (visibility = 'public' OR u.id = $1)
			AND ($2='' OR u.username = $2)
			AND ($3='' OR EXISTS(SELECT * FROM project_star JOIN user_ inner_u ON user_id=inner_u.id WHERE project_id=p.id AND inner_u.username=$3))
			AND ($4='' OR p.type=$4)
	`

	const createdSort = `
		ORDER BY p.created_at DESC, p.id DESC
	`
	const updatedSort = `
		ORDER BY p.updated_at DESC, p.id DESC
	`
	const trendingSort = `
		ORDER BY (
			SELECT COUNT(*)
			FROM project_star
			WHERE project_id=p.id AND created_at > CURRENT_DATE - INTERVAL '1 week'
		) DESC, p.id DESC
	`
	const popularSort = `
		ORDER BY (
			SELECT COUNT(*)
			FROM project_star
			WHERE project_id=p.id
		) DESC, p.id DESC
	`
	const fallbackSort = `
		ORDER BY p.id DESC
	`

	var sort string
	switch params.Sort {
	case "created":
		sort = createdSort
	case "updated":
		sort = updatedSort
	case "trending":
		sort = trendingSort
	case "popular":
		sort = popularSort
	default:
		sort = fallbackSort
	}

	ctx, cancel := db.context()
	defer cancel()

	rows, err := db.PG.Query(ctx, query+sort, requestingUserID, params.CreatedBy, params.StaredBy, params.ProjectType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []ProjectView{}
	for rows.Next() {
		projectView := ProjectView{}
		if err := rows.Scan(
			&projectView.Project.ID,
			&projectView.Project.CreatedAt,
			&projectView.Project.UpdatedAt,
			&projectView.Project.Type,
			&projectView.Project.UserID,
			&projectView.Project.Visibility,
			&projectView.Project.Name,
			&projectView.Project.Data,
			&projectView.Creator.ID,
			&projectView.Creator.CreatedAt,
			&projectView.Creator.UpdatedAt,
			&projectView.Creator.Username,
			&projectView.Creator.Email,
			&projectView.Creator.PasswordHash,
			&projectView.Creator.Role,
			&projectView.Creator.DisplayName,
			&projectView.Creator.About,
			&projectView.Stats.Stars,
			&projectView.IsStared,
		); err != nil {
			return nil, err
		}
		items = append(items, projectView)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}

-- +goose Up
-- +goose StatementBegin
CREATE TABLE project_star (
  project_id bigint NOT NULL REFERENCES project ON DELETE CASCADE,
  user_id bigint NOT NULL REFERENCES user_ ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE project_star;
-- +goose StatementEnd

-- +goose Up
-- +goose StatementBegin
CREATE TABLE session (
  id uuid PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES user_ ON DELETE CASCADE,
  expires timestamptz NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE session;
-- +goose StatementEnd

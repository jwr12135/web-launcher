-- +goose Up
-- +goose StatementBegin
CREATE TABLE site (
  id bigint PRIMARY KEY DEFAULT 1 CHECK(id=1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  setup boolean NOT NULL DEFAULT FALSE,
  name text NOT NULL DEFAULT 'Sourcetab',
  description text NOT NULL DEFAULT '',
  open_registration boolean NOT NULL DEFAULT FALSE
);
INSERT INTO site DEFAULT VALUES;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE site;
-- +goose StatementEnd

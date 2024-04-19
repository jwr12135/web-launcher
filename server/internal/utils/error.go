package utils

import (
	"net/http"

	"log/slog"
)

func ServerError(w http.ResponseWriter, err error) {
	slog.Error(err.Error())

	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func ClientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func NotFoundError(w http.ResponseWriter) {
	ClientError(w, http.StatusNotFound)
}

package utils

import (
	"encoding/json"
	"net/http"
)

type JsonWrap map[string]interface{}

func WriteJSON(w http.ResponseWriter, status int, data interface{}, headers http.Header) {
	jsonByte, err := json.Marshal(data)
	if err != nil {
		ServerError(w, err)
		return
	}

	for key, value := range headers {
		w.Header()[key] = value
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(jsonByte))
}

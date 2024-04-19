package serve

import (
	"net/http"

	"github.com/sourcetab/sourcetab/internal/utils"
)

func siteGetHandler(w http.ResponseWriter, r *http.Request) {
	db := contextDB(r)

	site, err := db.SiteGet()
	if err != nil {
		utils.ServerError(w, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, site, http.Header{})
}

package controller

import(
	"net/http"
	"database/sql"
)

type MenuController struct{
	DB *sql.DB
}

func(mc *MenuController) GetDefaultMenu(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This is menu page`))
}

func(mc *MenuController) GetMenuByCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This is menu-category page`))
}
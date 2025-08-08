package controller

import(
	"net/http"
	"database/sql"
)

type ChefController struct{
	DB *sql.DB
}

func(mc *ChefController) GetAllPendingOrders(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This is chef page`))
}

func(mc *ChefController) UpdateChef(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This updates chef`))
}
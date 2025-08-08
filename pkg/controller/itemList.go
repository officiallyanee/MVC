package controller

import(
	"net/http"
	"database/sql"
)

type ListController struct{
	DB *sql.DB
}

func(mc *ListController) GetList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This is itemlist`))
}

func(mc *ListController) GetPriceList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This is itemList page`))
}
package controller

import(
	"net/http"
	"database/sql"
)

type OrdersController struct{
	DB *sql.DB
}

func(mc *OrdersController) GetOrders(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This is orders page`))
}

func(mc *MenuController) UpdateReceiveTime(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This changes receive time`))
}
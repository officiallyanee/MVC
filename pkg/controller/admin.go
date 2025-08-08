package controller

import(
	"net/http"
	"database/sql"
)

type AdminController struct{
	DB *sql.DB
}

func(mc *AdminController) GetAllOrders(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This is admin page`))
}

func(mc *AdminController) UpdatePaymentStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`This updates payment status`))
}
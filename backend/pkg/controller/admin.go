package controller

import (
	"MVC/pkg/models"
	"MVC/pkg/types"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type AdminController struct {
	DB *sql.DB
}

func (ac *AdminController) GetAllOrders(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	search := vars["search"]
	page,err := strconv.ParseUint(vars["page"],10,64)
	if err != nil {
		http.Error(w, "Invalid page number", http.StatusBadRequest)
		return
	}
	if search == "all" {
        search = ""
    }
	orders,totalPages, err := models.GetOrders(ac.DB, search,page)
	if err != nil {
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := struct {
		Orders      []types.OrderDetails `json:"orders"`
		TotalPages  uint64               `json:"total_pages"`
	}{
		Orders: orders,
		TotalPages:totalPages,
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (ac *AdminController) UpdatePaymentStatus(w http.ResponseWriter, r *http.Request) {
	var req struct {
		OrderID string `json:"order_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if req.OrderID == "" {
		http.Error(w, "Missing order_id in request", http.StatusBadRequest)
		return
	}

	err := models.UpdatePaymentStatus(ac.DB, req.OrderID)
	if err != nil {
		http.Error(w, "Failed to update payment status", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Payment status updated successfully",
	})
}

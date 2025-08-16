package controller

import (
	"MVC/pkg/models"
	"database/sql"
	"encoding/json"
	"net/http"
)

type AdminController struct {
	DB *sql.DB
}

func (ac *AdminController) GetAllOrders(w http.ResponseWriter, r *http.Request) {
	orders, err := models.GetOrders(ac.DB)
	if err != nil {
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(orders); err != nil {
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

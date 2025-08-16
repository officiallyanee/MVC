package controller

import (
	"MVC/pkg/middleware"
	"MVC/pkg/models"
	"database/sql"
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

type OrdersController struct {
	DB *sql.DB
}

func (oc *OrdersController) GetOrders(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "Forbidden - No Claims Found", http.StatusForbidden)
		return
	}

	userID, ok := claims["id"].(string)
	if !ok {
		http.Error(w, "Forbidden - No User Found", http.StatusForbidden)
		return
	}

	orders, err := models.GetAllOrders(oc.DB, userID)
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

func (oc *OrdersController) UpdateOrder(w http.ResponseWriter, r *http.Request) {
	var req struct {
		OrderID     string       `json:"order_id"`
		ReceiveTime sql.NullTime `json:"received_time"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	if req.OrderID == "" {
		http.Error(w, "Missing order_id in request", http.StatusBadRequest)
		return
	}
	if !req.ReceiveTime.Valid {
		http.Error(w, "Missing received_time in request", http.StatusBadRequest)
		return
	}

	err = models.UpdateReceiveTime(oc.DB, req.OrderID, req.ReceiveTime)
	if err != nil {
		http.Error(w, "Failed to update receive time", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": `Receive Time Updated`})
}

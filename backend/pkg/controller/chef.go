package controller

import (
	"MVC/pkg/middleware"
	"MVC/pkg/models"
	"database/sql"
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

type ChefController struct {
	DB *sql.DB
}

func (cc *ChefController) GetAllPendingOrders(w http.ResponseWriter, r *http.Request) {
	orders, err := models.GetPendingOrders(cc.DB)
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

func (cc *ChefController) UpdateChef(w http.ResponseWriter, r *http.Request) {
	var req struct {
		OrderID string `json:"order_id"`
		ItemId  uint64 `json:"item_id"`
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
	if req.ItemId == 0 {
		http.Error(w, "Missing item_id in request", http.StatusBadRequest)
		return
	}
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

	err = models.UpdateChef(cc.DB, req.OrderID, req.ItemId, userID)
	if err != nil {
		http.Error(w, "Failed to update chef", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": `Chef updated`})
}

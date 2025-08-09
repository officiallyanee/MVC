package controller

import(
	"net/http"
	"database/sql"
	"MVC/pkg/models"
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"MVC/pkg/middleware"
)

type ChefController struct{
	DB *sql.DB
}

func(mc *ChefController) GetAllPendingOrders(w http.ResponseWriter, r *http.Request) {
	orders,err:= models.GetPendingOrders(mc.DB)
	if err!=nil{
		http.Error(w,"Some Unknown error occured while fetching orders",http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(orders); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func(mc *ChefController) UpdateChef(w http.ResponseWriter, r *http.Request) {
	var req struct{
		OrderID     string   `json:"order_id"`
		ItemId      uint64   `json:"item_id"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON body", http.StatusBadRequest)
        return
    }

	claims,ok:= r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "Forbidden - No Claims Found", http.StatusForbidden)
		return
	}

	userID, ok:= claims["id"].(string)
	if !ok {
		http.Error(w, "Forbidden - No User Found", http.StatusForbidden)
		return
	}

	err = models.UpdateChef(mc.DB,req.OrderID,req.ItemId,userID)
	if err!=nil{
		http.Error(w,"Some Unknown error occured while fetching orders",http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`Chef updated`))
}
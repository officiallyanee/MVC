package controller

import(
	"net/http"
	"database/sql"
	"MVC/pkg/models"
	"github.com/golang-jwt/jwt/v5"
	"MVC/pkg/middleware"
	"encoding/json"
)

type OrdersController struct{
	DB *sql.DB
}

func(mc *OrdersController) GetOrders(w http.ResponseWriter, r *http.Request) {
	claims,ok:= r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "Forbidden - No Claims Found", http.StatusForbidden)
		return
	}

	userID,ok:= claims["id"].(string)
	if !ok {
		http.Error(w, "Forbidden - No User Found", http.StatusForbidden)
		return
	}

	orders,err:= models.GetAllOrders(mc.DB,userID)
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

func(mc *OrdersController) UpdateOrder(w http.ResponseWriter, r *http.Request) {
	var req struct{
		OrderID     string       `json:"orderID"`
		ReceiveTime sql.NullTime `json:"receiveTime"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON body", http.StatusBadRequest)
        return
    }

	err = models.UpdateReceiveTime(mc.DB,req.OrderID,req.ReceiveTime)
	if err!=nil{
		http.Error(w,"Some Unknown error occured while fetching orders",http.StatusInternalServerError)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`Receive Time Updated`))
}
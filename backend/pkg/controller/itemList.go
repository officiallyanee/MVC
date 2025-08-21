package controller

import (
	"backend/pkg/middleware"
	"backend/pkg/models"
	"backend/pkg/types"
	"database/sql"
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

type ListController struct {
	DB *sql.DB
}

func (lc *ListController) GetList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": `This is a render route for itemList`})
}

func (lc *ListController) MakePriceList(w http.ResponseWriter, r *http.Request) {
	var itemList []types.ItemList

	err := json.NewDecoder(r.Body).Decode(&itemList)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	if len(itemList) == 0 {
		http.Error(w, "Item list cannot be empty", http.StatusBadRequest)
		return
	}

	itemPriceList, err := models.GetListDetails(lc.DB, itemList)
	if err != nil {
		http.Error(w, "Failed to retrieve price list details", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(itemPriceList); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (lc *ListController) CheckAvailiblity(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tablenoStr := vars["tableno"]
	tableno, err := strconv.ParseUint(tablenoStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid table number", http.StatusBadRequest)
		return
	}

	status, err := models.GetTableStatus(lc.DB, uint64(tableno))
	if err != nil {
		http.Error(w, "Failed to fetch table status", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(status); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (lc *ListController) GetTableNo(w http.ResponseWriter, r *http.Request) {
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

	tableNo, err := models.GetCustomerTable(lc.DB, userID)
	if err != nil {
		http.Error(w, "Failed to get tableno", http.StatusInternalServerError)
		return
	}
	if tableNo == 0 {
		http.Error(w, "No Table Found", http.StatusForbidden)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(tableNo); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (lc *ListController) PlaceOrder(w http.ResponseWriter, r *http.Request) {
	var order types.Order
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

	var orderList types.OrderSubDetails
	err := json.NewDecoder(r.Body).Decode(&orderList)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	if len(orderList.ItemList) == 0 {
		http.Error(w, "Cannot place an order with no items", http.StatusBadRequest)
		return
	}
	if orderList.TableNo <= 0 || orderList.TableNo > 50 {
		http.Error(w, "Invalid table number", http.StatusBadRequest)
		return
	}

	order.OrderID = uuid.New().String()
	order.CustomerID = userID
	order.TableNo = orderList.TableNo
	order.Specifications = orderList.Specifications
	order.OrderedTime = orderList.OrderedTime
	order.ReceivedTime = sql.NullTime{Valid: false}
	order.TotalFare = orderList.TotalFare
	order.PaymentStatus = "pending"

	err = models.PlaceOrder(lc.DB, order)
	if err != nil {
		http.Error(w, "Failed to place order", http.StatusInternalServerError)
		return
	}

	var subOrder []types.SubOrder

	for _, item := range orderList.ItemList {
		subOrder = append(subOrder, types.SubOrder{
			OrderID:  order.OrderID,
			ItemID:   item.ItemID,
			Quantity: item.Quantity,
		})
	}

	err = models.PlaceSubOrder(lc.DB, subOrder)
	if err != nil {
		http.Error(w, "Failed to place suborder", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": `Order Placed Successfully`})
}

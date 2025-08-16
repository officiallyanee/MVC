package controller

import (
	"MVC/pkg/models"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type MenuController struct {
	DB *sql.DB
}

func (mc *MenuController) GetDefaultMenu(w http.ResponseWriter, r *http.Request) {

	items, err := models.GetItemsByCategory(mc.DB, "Starters")
	if err != nil {
		http.Error(w, "Failed to fetch menu", http.StatusInternalServerError)
		return
	}
	categories, err := models.GetAllCategories(mc.DB)
	if err != nil {
		http.Error(w, "Failed to fetch categories", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := struct {
		First  interface{} `json:"items"`
		Second interface{} `json:"categories"`
	}{
		First:  items,
		Second: categories,
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (mc *MenuController) GetMenuByCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	category := vars["category"]
	if category == "" {
		http.Error(w, "Category cannot be empty", http.StatusBadRequest)
		return
	}
	items, err := models.GetItemsByCategory(mc.DB, category)
	if err != nil {
		http.Error(w, "Failed fetching menu", http.StatusInternalServerError)
		return
	}
	if len(items) == 0 {
		http.Error(w, "No items found for this category", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(items); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

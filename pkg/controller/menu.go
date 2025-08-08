package controller

import(
	"net/http"
	"encoding/json"
	"MVC/pkg/models"
	"github.com/gorilla/mux"
	"database/sql"
)

type MenuController struct{
	DB *sql.DB
}

func(mc *MenuController) GetDefaultMenu(w http.ResponseWriter, r *http.Request) {

	items,err:= models.GetItemsByCategory(mc.DB,"Starters")
	if(err!=nil){
		http.Error(w,"Some Unknown error occured while fetching menu",http.StatusInternalServerError)
		return
	}
	categories,err:=models.GetAllCategories(mc.DB)
	if(err!=nil){
		http.Error(w,"Some Unknown error occured while fetching categories",http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := struct {
		First  interface{} `json:"items"`
		Second interface{} `json:"categories"`
	}{
		First: items,
		Second: categories,
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
        http.Error(w, "Failed to encode response", http.StatusInternalServerError)
    }
}

func(mc *MenuController) GetMenuByCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	category:=vars["category"]
	categories,err:= models.GetItemsByCategory(mc.DB,category)
	if(err!=nil){
		http.Error(w,"Some Unknown error occured while fetching menu",http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(categories); err != nil {
        http.Error(w, "Failed to encode response", http.StatusInternalServerError)
    }
}
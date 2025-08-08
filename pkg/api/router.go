package api

import(
	"MVC/pkg/controller"
	"MVC/pkg/utils"
	"MVC/pkg/middleware"
	"net/http"
	"log"
	"github.com/gorilla/mux"
)

func Routing(){
	router := mux.NewRouter().StrictSlash(true)
	
	authController := controller.AuthController{DB: utils.DB}
	router.HandleFunc("/register", authController.Register).Methods("POST")
	router.HandleFunc("/login", authController.Login).Methods("POST")

	auth := router.PathPrefix("/").Subrouter()
	auth.Use(middleware.Authenticate)

	menuController:=controller.MenuController{DB:utils.DB}
	menu := auth.PathPrefix("/menu").Subrouter()
	menu.Use(middleware.RestrictTo("customer","chef","admin"))
	menu.HandleFunc("", menuController.GetDefaultMenu).Methods("GET")

	adminController:=controller.AdminController{DB:utils.DB}
	admin := auth.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.RestrictTo("admin"))
	admin.HandleFunc("", adminController.GetAllOrders).Methods("GET")

	chefController:=controller.ChefController{DB:utils.DB}
	chef := auth.PathPrefix("/chef").Subrouter()
	chef.Use(middleware.RestrictTo("chef"))
	chef.HandleFunc("", chefController.GetAllPendingOrders).Methods("GET")

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
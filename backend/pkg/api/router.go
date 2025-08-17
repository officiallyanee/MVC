package api

import (
	"MVC/pkg/controller"
	"MVC/pkg/middleware"
	"MVC/pkg/utils"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func StartServer() {
	router := mux.NewRouter()
	router.Use(middleware.CORSMiddleware)
	router.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusNoContent)
    })

	authController := controller.AuthController{DB: utils.DB}
	router.HandleFunc("/register", authController.Register).Methods("POST")
	router.HandleFunc("/login", authController.Login).Methods("POST")

	auth := router.PathPrefix("/").Subrouter()
	auth.Use(middleware.Authenticate)

	menuController := controller.MenuController{DB: utils.DB}
	menuSubRouter := auth.PathPrefix("/menu").Subrouter()
	menuSubRouter.Use(middleware.RestrictTo("customer","chef","admin"))
	menuSubRouter.HandleFunc("", menuController.GetDefaultMenu).Methods("GET")
	menuSubRouter.HandleFunc("/{category}", menuController.GetMenuByCategory).Methods("GET")

	adminController := controller.AdminController{DB: utils.DB}
	adminSubRouter := auth.PathPrefix("/admin").Subrouter()
	adminSubRouter.Use(middleware.RestrictTo("admin"))
	adminSubRouter.HandleFunc("/{search}/{page}", adminController.GetAllOrders).Methods("GET")

	chefController := controller.ChefController{DB: utils.DB}
	chefSubRouter := auth.PathPrefix("/chef").Subrouter()
	chefSubRouter.Use(middleware.RestrictTo("chef"))
	chefSubRouter.HandleFunc("", chefController.GetAllPendingOrders).Methods("GET")
	chefSubRouter.HandleFunc("", chefController.UpdateChef).Methods("PATCH")

	listController := controller.ListController{DB: utils.DB}
	listSubRouter := auth.PathPrefix("/itemList").Subrouter()
	listSubRouter.Use(middleware.RestrictTo("customer", "chef", "admin"))
	listSubRouter.HandleFunc("", listController.GetList).Methods("GET")
	listSubRouter.HandleFunc("/itemPriceList", listController.MakePriceList).Methods("POST")
	listSubRouter.HandleFunc("/tablestatus/{tableno}", listController.CheckAvailiblity).Methods("GET")
	listSubRouter.HandleFunc("/customerTableNo", listController.GetTableNo).Methods("GET")
	listSubRouter.HandleFunc("/order", listController.PlaceOrder).Methods("POST")

	ordersController := controller.OrdersController{DB: utils.DB}
	orderSubRouter := auth.PathPrefix("/orders").Subrouter()
	orderSubRouter.Use(middleware.RestrictTo("customer", "chef", "admin"))
	orderSubRouter.HandleFunc("", ordersController.GetOrders).Methods("GET")
	orderSubRouter.HandleFunc("", ordersController.UpdateOrder).Methods("PATCH")

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}

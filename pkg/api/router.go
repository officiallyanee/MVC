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
	router := mux.NewRouter()
	
	authController := controller.AuthController{DB: utils.DB}
	router.HandleFunc("/register", authController.Register).Methods("POST")
	router.HandleFunc("/login", authController.Login).Methods("POST")

	auth := router.PathPrefix("/").Subrouter()
	auth.Use(middleware.Authenticate)

	menuController:=controller.MenuController{DB:utils.DB}
	menu := auth.PathPrefix("/menu").Subrouter()
	menu.Use(middleware.RestrictTo("customer","chef","admin"))
	menu.HandleFunc("", menuController.GetDefaultMenu).Methods("GET")
	menu.HandleFunc("/{category}", menuController.GetMenuByCategory).Methods("GET")

	adminController:=controller.AdminController{DB:utils.DB}
	admin := auth.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.RestrictTo("admin"))
	admin.HandleFunc("", adminController.GetAllOrders).Methods("GET")

	chefController:=controller.ChefController{DB:utils.DB}
	chef := auth.PathPrefix("/chef").Subrouter()
	chef.Use(middleware.RestrictTo("chef"))
	chef.HandleFunc("", chefController.GetAllPendingOrders).Methods("GET")
	chef.HandleFunc("", chefController.UpdateChef).Methods("PATCH")

	listController:=controller.ListController{DB:utils.DB}
	list := auth.PathPrefix("/itemList").Subrouter()
	list.Use(middleware.RestrictTo("customer","chef","admin"))
	list.HandleFunc("",listController.GetList).Methods("GET")
	list.HandleFunc("/itemPriceList",listController.MakePriceList).Methods("POST")
	list.HandleFunc("/tablestatus/{tableno}",listController.CheckAvailiblity).Methods("GET")
	list.HandleFunc("/customerTableNo",listController.GetTableNo).Methods("GET")
	list.HandleFunc("/order",listController.PlaceOrder).Methods("POST")

	ordersController:=controller.OrdersController{DB:utils.DB}
	order := auth.PathPrefix("/orders").Subrouter()
	order.Use(middleware.RestrictTo("customer","chef","admin"))
	order.HandleFunc("", ordersController.GetOrders).Methods("GET")
	order.HandleFunc("", ordersController.UpdateOrder).Methods("PATCH")

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
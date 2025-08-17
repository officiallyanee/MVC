package types

import "database/sql"

type Config struct {
	MySQLHost     string
	MySQLUser     string
	MySQLPassword string
	MySQLDatabase string
	MySQLPort     string
}

type User struct {
    UserID   string
    Name     string
    Email    string
    PasswordStore string
    Role     string
}

type RegisterReq struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Item struct {
    ItemID       uint64  `json:"item_id"`
    Name         string  `json:"name"`
    PricePerItem float64 `json:"price_per_item"`
    Description  string  `json:"description"`
    Availablity  bool    `json:"availablity"`
    ImageURL     string  `json:"image_url"`
    Category     string  `json:"category"`
}

type Category struct {
    Category string `json:"category"`
}

type ItemPriceList struct {
	ItemID       uint64  `json:"item_id"`
	ItemName     string  `json:"item_name"`
	Quantity	 uint64  `json:"quantity"`
	Price        float64 `json:"price"`
}

type ItemList struct{

	ItemID       uint64  `json:"item_id"`
	Quantity	 uint64  `json:"quantity"`
}
type Order struct{
	OrderID        string 		`json:"order_id"`
	CustomerID     string 		`json:"customer_id"`
	TableNo        uint64 		`json:"table_no"`
	Specifications string 		`json:"specifications"`
	OrderedTime    string 		`json:"ordered_time"`
	ReceivedTime   sql.NullTime `json:"received_time"`
	TotalFare      float64 		`json:"total_fare"`
	PaymentStatus  string 		`json:"payment_status"`
}

type SubOrder struct{
	OrderID  string `json:"order_id"`
	ItemID   uint64 `json:"item_id"`
	Quantity uint64 `json:"quantity"`
	ChefID   string `json:"chef_id"`
}

type CompleteOrder struct{
	Order    Order      `json:"order"`
	ItemList []ItemList `json:"item_list"`
}

type CompleteOrderWithPrice struct {
	Order
	ItemPriceList []ItemPriceList `json:"item_list"`
}

type OrderSubDetails struct{
	TableNo        uint64 		`json:"table_no"`
	Specifications string 		`json:"specifications"`
	OrderedTime    string 		`json:"ordered_time"`
	TotalFare      float64 		`json:"total_fare"`
	ItemList       []ItemList 	`json:"item_list"`
}

type SubOrderWithName struct{
	ItemID   uint64 		`json:"item_id"`
	Quantity uint64 		`json:"quantity"`
	Name     string 		`json:"name"`
	ChefID   sql.NullString `json:"chef_id"`
}
type OrderAndSubOrders struct{
	Order    Order          		`json:"order"`
	SubOrders []SubOrderWithName	`json:"sub_orders"`
}
type OrderWithCustomerName struct {
	Order              
	CustomerName string `json:"customer_name"`
}

type OrderDetails struct {
	Order     OrderWithCustomerName `json:"order"`
	SubOrders []SubOrderWithName           `json:"sub_orders"`
}
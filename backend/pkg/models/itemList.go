package models

import (
    "database/sql"
	"MVC/pkg/types"
	"log"
)

func GetListDetails(db *sql.DB, list []types.ItemList) (*[]types.ItemPriceList,error) {
	query := "SELECT name, price_per_item FROM item_list WHERE item_id = ?";
	var priceList []types.ItemPriceList
	for _, item := range list {
		var price struct{
			ItemName string
			ItemPrice float64
		} 
		err:=db.QueryRow(query, item.ItemID).Scan(&price.ItemName,&price.ItemPrice)
		if err == sql.ErrNoRows {
			return nil, nil 
		}
		if err != nil {
			return nil, err
		}
		itemList:=types.ItemPriceList{
			ItemID:  item.ItemID,
			ItemName:    price.ItemName,
			Quantity:item.Quantity,
			Price:   price.ItemPrice*float64(item.Quantity),
		}
		priceList=append(priceList,itemList)
	}
	return &priceList,nil
}

func GetTableStatus(db *sql.DB,tableno uint64) (bool, error){
	query:="SELECT payment_status FROM orders WHERE payment_status = 'pending' AND table_no = ?"
	var payment string
	err:=db.QueryRow(query,tableno).Scan(&payment)
	if err == sql.ErrNoRows {
		return true, nil 
	}
	if err != nil {
		return false, err
	}
	return false, nil
}

func GetCustomerTable(db *sql.DB,userID string) (uint64, error){
	query:="SELECT table_no FROM orders WHERE payment_status = 'pending' AND customer_id = ?"
	var tableno uint64
	err:=db.QueryRow(query,userID).Scan(&tableno)
	if err==sql.ErrNoRows{
		return 0,nil 
	}
	if err!=nil {
		return 0,err
	}
	return tableno, nil
}

func PlaceOrder(db *sql.DB,order types.Order) error{
	query:="INSERT INTO orders (`order_id`,`customer_id`, `table_no`,`specifications`,`ordered_time`, `received_time`,`total_fare`, `payment_status`) VALUES (?,?,?,?,?,?,?,?)"
	_, err := db.Exec(query, order.OrderID, order.CustomerID,order.TableNo, order.Specifications, order.OrderedTime, order.ReceivedTime,order.TotalFare, order.PaymentStatus)
	if err != nil {
		log.Printf("Error placing order: %v", err)
		return err
	}
	return err
}

func PlaceSubOrder(db *sql.DB,subOrder []types.SubOrder) error{
	query:="INSERT INTO sub_orders (`order_id`, `item_id`, `quantity`) VALUES (?,?,?)"
	for _, sub := range subOrder {
		_, err := db.Exec(query, sub.OrderID, sub.ItemID, sub.Quantity)
		if err != nil {
			return err
		}
	}
	return nil
}

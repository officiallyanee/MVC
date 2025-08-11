package models

import (
	"database/sql"
	"MVC/pkg/types"
)

func GetPendingOrders(db *sql.DB) ([]types.OrderAndSubOrders, error) {
	var orders []types.Order
	rows, err := db.Query("SELECT * FROM orders WHERE received_time IS NULL")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	query:=`SELECT sub_orders.item_id, sub_orders.quantity, item_list.name, sub_orders.chef_id 
            FROM sub_orders 
            INNER JOIN item_list ON sub_orders.item_id = item_list.item_id 
            WHERE order_id = ?`
	for rows.Next() {
		var order types.Order
		err := rows.Scan(
			&order.OrderID,
			&order.CustomerID,
			&order.TableNo,
			&order.Specifications,
			&order.OrderedTime,
			&order.ReceivedTime,
			&order.TotalFare,
			&order.PaymentStatus,
		)
		if err != nil {
			return nil, err
		}

		orders=append(orders, order)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	var fullOrders []types.OrderAndSubOrders

	for i := range orders {
		fullOrder := types.OrderAndSubOrders{Order: orders[i]} 

		subOrdersRows, err := db.Query(query, fullOrder.Order.OrderID)    
		if err != nil {
			return nil, err
		}

		for subOrdersRows.Next() {
			var subOrder types.SubOrder2
			if err := subOrdersRows.Scan(
				&subOrder.ItemID,
				&subOrder.Quantity,
				&subOrder.Name,
				&subOrder.ChefID,
			); err != nil {
				return nil, err
			}
			fullOrder.SubOrders = append(fullOrder.SubOrders, subOrder)
		}
		subOrdersRows.Close()

		fullOrders = append(fullOrders, fullOrder)
	}

	return fullOrders, nil
}

func UpdateChef(db *sql.DB, orderID string, itemId uint64, userID string) error {
	query := "UPDATE sub_orders SET chef_id = ? WHERE order_id = ? AND item_id =?"
	_, err := db.Exec(query, userID, orderID, itemId)
	return err
}
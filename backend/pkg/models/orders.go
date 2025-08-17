package models

import (
	"MVC/pkg/types"
	"database/sql"
)

func GetAllOrders(db *sql.DB, userID string) ([]types.CompleteOrderWithPrice, error) {
	query := "SELECT * FROM orders WHERE customer_id = ? ORDER BY payment_status = 'pending' DESC"
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []types.CompleteOrderWithPrice
	for rows.Next() {
		var order types.CompleteOrderWithPrice
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
		orders = append(orders, order)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	for i := range orders {
		subQuery :=`SELECT sub_orders.item_id, sub_orders.quantity, item_list.name,item_list.price_per_item 
                     FROM sub_orders 
                     INNER JOIN item_list ON sub_orders.item_id = item_list.item_id 
                     WHERE order_id = ?`
		rows, err := db.Query(subQuery, orders[i].OrderID)
		if err != nil {
			return nil, err
		}

		if err != nil {
			return nil, err
		}
		defer rows.Close()

		for rows.Next() {
			var subOrder types.ItemPriceList
			err := rows.Scan(
				&subOrder.ItemID,
				&subOrder.Quantity,
				&subOrder.ItemName,
				&subOrder.Price,
			)
			if err != nil {
				return nil, err
			}
			orders[i].ItemPriceList = append(orders[i].ItemPriceList, subOrder)
		}
		if err = rows.Err(); err != nil {
			return nil, err
		}

	}
	return orders, nil
}

func UpdateReceiveTime(db *sql.DB, orderID string, receiveTime sql.NullTime) error {
	query := "UPDATE orders SET received_time = ? WHERE order_id = ?"
	_, err := db.Exec(query, receiveTime, orderID)
	return err
}

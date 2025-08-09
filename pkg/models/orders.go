package models

import (
	"database/sql"
	"MVC/pkg/types"
)

func GetAllOrders(db *sql.DB, userID string) ([]types.Order, error) {
	query:= "SELECT * FROM orders WHERE customer_id = ? ORDER BY payment_status = 'pending' DESC"
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []types.Order
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
		orders = append(orders, order)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return orders, nil
}

func UpdateReceiveTime(db *sql.DB, orderID string, receiveTime sql.NullTime) error {
	query := "UPDATE orders SET received_time = ? WHERE order_id = ?"
	_, err := db.Exec(query, receiveTime, orderID)
	return err
}
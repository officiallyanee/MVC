package models

import (
	"MVC/pkg/types" 
	"database/sql"
)


func GetOrders(db *sql.DB) ([]types.OrderDetails, error) {
	dataQuery:=`SELECT o.order_id, o.customer_id, o.table_no, o.specifications, o.ordered_time, 
					o.received_time, o.total_fare, o.payment_status, ld.name 
				FROM orders o
				INNER JOIN login_details ld ON o.customer_id = ld.user_id
				ORDER BY (o.payment_status = 'pending') DESC, o.ordered_time DESC`

	rows, err := db.Query(dataQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var allOrderDetails []types.OrderDetails

	subOrderSql := `SELECT so.item_id, so.quantity, il.name, so.chef_id 
					FROM sub_orders so
					INNER JOIN item_list il ON so.item_id = il.item_id 
					WHERE so.order_id = ?`
	stmt, err := db.Prepare(subOrderSql)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	for rows.Next() {
		var orderInfo types.OrderWithCustomerName
		var orderDetails types.OrderDetails

		err := rows.Scan(
			&orderInfo.OrderID,
			&orderInfo.CustomerID,
			&orderInfo.TableNo,
			&orderInfo.Specifications,
			&orderInfo.OrderedTime,
			&orderInfo.ReceivedTime,
			&orderInfo.TotalFare,
			&orderInfo.PaymentStatus,
			&orderInfo.CustomerName,
		)
		if err != nil {
			return nil, err
		}

		subRows, err := stmt.Query(orderInfo.OrderID)
		if err != nil {
			return nil, err
		}

		var subOrders []types.SubOrder2
		for subRows.Next() {
			var subOrder types.SubOrder2
			if err := subRows.Scan(
				&subOrder.ItemID,
				&subOrder.Quantity,
				&subOrder.Name,
				&subOrder.ChefID,
			); err != nil {
				subRows.Close() 
				return nil, err
			}
			subOrders = append(subOrders, subOrder)
		}
		subRows.Close()

		orderDetails.Order = orderInfo
		orderDetails.SubOrders = subOrders
		allOrderDetails = append(allOrderDetails, orderDetails)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return allOrderDetails, nil
}

func UpdatePaymentStatus(db *sql.DB, orderID string) error {
	sql := "UPDATE orders SET payment_status = 'paid' WHERE order_id = ?"
	_, err := db.Exec(sql, orderID)
	return err
}

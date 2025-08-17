package models

import (
	"MVC/pkg/types"
	"database/sql"
)

func GetOrders(db *sql.DB, search string, page uint64) ([]types.OrderDetails, uint64, error) {
	searchSql := `
		SELECT COUNT(*) as total 
		FROM orders 
		INNER JOIN login_details ON orders.customer_id = login_details.user_id 
		WHERE login_details.name LIKE ?`

	var total uint64
	err := db.QueryRow(searchSql, "%"+search+"%").Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	dataQuery:=`
    SELECT orders.*, login_details.name 
    FROM orders 
    INNER JOIN login_details ON orders.customer_id = login_details.user_id
    WHERE login_details.name LIKE ?
    ORDER BY (payment_status = 'pending') DESC, orders.ordered_time DESC
    LIMIT 8 OFFSET ?`
	rows,err:=db.Query(dataQuery, "%"+search+"%", (page-1)*8)
	if err!=nil {
		return nil,total,err
	}
	defer rows.Close()

	var allOrderDetails []types.OrderDetails
	subOrderSql:= `SELECT so.item_id, so.quantity, il.name, so.chef_id 
                    FROM sub_orders so
                    INNER JOIN item_list il ON so.item_id = il.item_id 
                    WHERE so.order_id = ?`

	for rows.Next() {
		var orderInfo types.OrderWithCustomerName
		var orderDetails types.OrderDetails
		err:=rows.Scan(
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
		if err!=nil {
			return nil,total, err
		}
		subRows,err:= db.Query(subOrderSql, orderInfo.OrderID)
		if err!= nil {
			return nil,total, err
		}

		var subOrders []types.SubOrderWithName
		for subRows.Next() {
			var subOrder types.SubOrderWithName
			err := subRows.Scan(
				&subOrder.ItemID,
				&subOrder.Quantity,
				&subOrder.Name,
				&subOrder.ChefID,
			)
			if err!=nil {
				subRows.Close() 
				return nil,total, err
			}
			subOrders=append(subOrders, subOrder)
		}
		subRows.Close()

		orderDetails.Order=orderInfo
		orderDetails.SubOrders=subOrders
		allOrderDetails = append(allOrderDetails, orderDetails)
	}
	err=rows.Err()
	if err!=nil {
		return nil,total,err
	}
	return allOrderDetails,total,nil
}

func UpdatePaymentStatus(db *sql.DB, orderID string) error {
    query:="UPDATE orders SET payment_status = 'paid' WHERE order_id = ?"
    _,err:= db.Exec(query, orderID)
    return err
}

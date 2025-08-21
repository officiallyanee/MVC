package models

import (
	"backend/pkg/types"
	"database/sql"
	"log"
)

func GetItemsByCategory(db *sql.DB, category string) ([]types.Item, error) {
	query := `
        WITH CategoryNames AS (
            SELECT c.item_id, cl.category
            FROM categories c
            JOIN category_list cl ON c.category_id = cl.category_id  
            WHERE cl.category = ?
        )
        SELECT item_list.*,CategoryNames.category
        FROM item_list
        INNER JOIN CategoryNames ON item_list.item_id = CategoryNames.item_id
        `
	rows, err := db.Query(query, category)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer rows.Close()
	var items []types.Item
	for rows.Next() {
		var i types.Item
		err := rows.Scan(
			&i.ItemID,
			&i.Name,
			&i.PricePerItem,
			&i.Description,
			&i.Availablity,
			&i.ImageURL,
			&i.Category,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}
		items = append(items, i)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
		return nil, err
	}
	return items, nil
}

func GetAllCategories(db *sql.DB) (*[]types.Category, error) {
	query := `SELECT category FROM category_list`
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer rows.Close()

	var categories []types.Category
	for rows.Next() {
		var c types.Category
		err := rows.Scan(&c.Category)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}
		categories = append(categories, c)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
		return nil, err
	}
	return &categories, nil
}

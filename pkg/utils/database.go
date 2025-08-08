package utils

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"MVC/pkg/config"
	"MVC/pkg/types"
)

var DB *sql.DB

func InitDatabase(cfg types.Config) (*sql.DB, error) {
	
	var err error
	DB, err = sql.Open("mysql", config.DSN(cfg))
	if err != nil {
		return nil, fmt.Errorf("error opening database: %v", err)
	}

	// Connection pool settings
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)

	// Test connection
	if err = DB.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to database: %v", err)
	}

	fmt.Println("Database connected successfully!")
	return DB, nil
}

// CloseDatabase closes the database connection
func CloseDatabase() error {
	if DB != nil {
		fmt.Println("Closing database connection...")
		return DB.Close()
	}
	return nil
}

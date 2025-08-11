package config

import (
	"fmt"
	"os"
	"MVC/pkg/types"
)


func LoadConfig() types.Config {
	return types.Config{
		MySQLHost:     os.Getenv("MYSQL_HOST"),
		MySQLUser:     os.Getenv("MYSQL_USER"),
		MySQLPassword: os.Getenv("MYSQL_PASSWORD"),
		MySQLDatabase: os.Getenv("MYSQL_DATABASE"),
		MySQLPort:     os.Getenv("MYSQL_PORT"),
	}
}

func DSN(c types.Config) string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		c.MySQLUser, c.MySQLPassword, c.MySQLHost, c.MySQLPort, c.MySQLDatabase)
}

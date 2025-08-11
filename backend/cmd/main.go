package main

import (
	"fmt"
	"log"
	"MVC/pkg/config"
	"MVC/pkg/utils"
	"MVC/pkg/api"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../../.env") 
	if err != nil {
		fmt.Println("Warning: .env file not found:", err)
	}
	cfg := config.LoadConfig()
	
	_, err = utils.InitDatabase(cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer utils.CloseDatabase()

    api.Routing()

}

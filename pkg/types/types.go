package types

type Config struct {
	MySQLHost     string
	MySQLUser     string
	MySQLPassword string
	MySQLDatabase string
	MySQLPort     string
}

type User struct {
    UserID   string
    Name     string
    Email    string
    PwdStore string
    Role     string
}

type Req struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Item struct {
    ItemID       uint64  `json:"item_id"`
    Name         string  `json:"name"`
    PricePerItem float64 `json:"price_per_item"`
    Description  string  `json:"description"`
    Availablity  bool    `json:"availablity"`
    ImageURL     string  `json:"image_url"`
    Category     string  `json:"category"`
}

type Category struct {
    Category string `json:"category"`
}
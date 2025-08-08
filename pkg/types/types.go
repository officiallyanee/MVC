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

package models

import (
    "database/sql"
	"backend/pkg/types"
)

func InsertUser(db *sql.DB, user types.User) error {
    query := `
        INSERT INTO login_details (user_id, name, email, pwd_hash, role)
        VALUES (?, ?, ?, ?, ?)
    `
    _, err := db.Exec(query, user.UserID, user.Name, user.Email, user.PasswordStore, user.Role)
    return err
}

func GetUserDetails(db *sql.DB, name string) (*types.User, error) {
    query := `SELECT user_id, name, email, pwd_hash, role FROM login_details WHERE name = ?`

    var u types.User
    err := db.QueryRow(query, name).Scan(&u.UserID, &u.Name, &u.Email, &u.PasswordStore, &u.Role)
    if err == sql.ErrNoRows {
        return nil, nil 
    }
    if err != nil {
        return nil, err
    }
    return &u, nil
}

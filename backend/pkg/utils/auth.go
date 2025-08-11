package utils

import (
	"github.com/golang-jwt/jwt/v5"
	"os"
)

func ValidateToken(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, nil
		}
		return []byte(os.Getenv("ACCESS_TOKEN_SECRET")), nil
	})
}
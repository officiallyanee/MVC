package utils

import (
	"MVC/pkg/types"
	"github.com/golang-jwt/jwt/v5"
	"math/rand"
	"os"
	"strings"
	"time"
)

func ValidateToken(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, nil
		}
		return []byte(os.Getenv("ACCESS_TOKEN_SECRET")), nil
	})
}
func GenerateSalt(length int) string {
	charset := "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	seed := rand.New(rand.NewSource(time.Now().UnixNano()))
	var sb strings.Builder
	for i := 0; i < length; i++ {
		sb.WriteByte(charset[seed.Intn(len(charset))])
	}
	return sb.String()
}

func GenerateToken(user types.User) (string, error) {
	claims := jwt.MapClaims{
		"id":   user.UserID,
		"name": user.Name,
		"role": user.Role,
		"exp":  time.Now().Add(48 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("ACCESS_TOKEN_SECRET")
	return token.SignedString([]byte(secret))
}

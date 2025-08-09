package controller

import (
	"database/sql"
	"encoding/json"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"MVC/pkg/models"
	"MVC/pkg/types"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	DB *sql.DB
}

func(ac *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req types.Req

	if err:= json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w,"Invalid input", http.StatusBadRequest)
		return
	}
	
	if strings.TrimSpace(req.Name) == "" || strings.TrimSpace(req.Email) == "" {
        http.Error(w, "Name and Email cannot be empty", http.StatusBadRequest)
        return
    }

	if len(req.Password)<8 {
		http.Error(w,"Password must be at least 8 characters", http.StatusBadRequest)
		return
	}

	userID:= uuid.New().String()
	salt:= generateSalt(8)
	saltedPwd:= req.Password + salt

	pwdHash,err:= bcrypt.GenerateFromPassword([]byte(saltedPwd), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w,"Error hashing password", http.StatusInternalServerError)
		return
	}

	pwdStore:= salt+string(pwdHash)
	user:= types.User{
		UserID:   userID,
		Name:     req.Name,
		Email:    req.Email,
		PwdStore: pwdStore,
		Role:     "customer",
	}

	if err:= models.PostUserDetails(ac.DB, user); err != nil {
		http.Error(w,"User already exists", http.StatusBadRequest)
		return
	}

	token,err:= generateToken(user)
	if err!=nil {
		http.Error(w,"Error generating token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w,&http.Cookie{
		Name:     "token",
		Value:    token,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
	})

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`User registered successfully`))
}

func (ac *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	var req struct{
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	if err:=json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	
	if strings.TrimSpace(req.Name) == "" {
        http.Error(w, "Name cannot be empty", http.StatusBadRequest)
        return
    }

	if len(req.Password)<8 {
		http.Error(w,"Password must be at least 8 characters", http.StatusBadRequest)
		return
	}

	user,err:= models.GetUserDetails(ac.DB, req.Name)
	if err!= nil||user == nil {
		http.Error(w, "No user found. Sign up first!", http.StatusBadRequest)
		return
	}

	salt:= user.PwdStore[:8]
	saltedHash:= user.PwdStore[8:]
	saltedPwd:= req.Password+salt

	if err:= bcrypt.CompareHashAndPassword([]byte(saltedHash), []byte(saltedPwd)); err != nil {
		http.Error(w, "Incorrect credentials", http.StatusBadRequest)
		return
	}

	token,err:= generateToken(*user)
	if err!=nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Login successful"}`))
}

func generateSalt(length int) string {
	charset:= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	seed:= rand.New(rand.NewSource(time.Now().UnixNano()))
	var sb strings.Builder
	for i:= 0; i < length; i++ {
		sb.WriteByte(charset[seed.Intn(len(charset))])
	}
	return sb.String()
}

func generateToken(user types.User) (string, error) {
	claims := jwt.MapClaims{
		"id":   user.UserID,
		"name": user.Name,
		"role": user.Role,
		"exp":  time.Now().Add(48 * time.Hour).Unix(),
	}

	token:= jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret:= os.Getenv("ACCESS_TOKEN_SECRET")
	return token.SignedString([]byte(secret))
}

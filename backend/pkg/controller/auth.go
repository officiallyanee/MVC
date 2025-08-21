package controller

import (
	"backend/pkg/models"
	"backend/pkg/types"
	"backend/pkg/utils"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	DB *sql.DB
}

func (ac *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req types.RegisterReq
	
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Name) == "" || strings.TrimSpace(req.Email) == "" {
		http.Error(w, "Name and Email cannot be empty", http.StatusBadRequest)
		return
	}

	if len(req.Password) < 8 {
		http.Error(w, "Password must be at least 8 characters", http.StatusBadRequest)
		return
	}

	userID := uuid.New().String()
	salt := utils.GenerateSalt(8)
	saltedPassword := req.Password + salt

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(saltedPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	passwordStore := salt + string(passwordHash)
	user := types.User{
		UserID:        userID,
		Name:          req.Name,
		Email:         req.Email,
		PasswordStore: passwordStore,
		Role:          "customer",
	}

	if err := models.InsertUser(ac.DB, user); err != nil {
		http.Error(w, "User already exists", http.StatusBadRequest)
		return
	}

	token, err := utils.GenerateToken(user)
	if err != nil {
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

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
        "username": user.Name,
        "role":     user.Role,
    })
}

func (ac *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Name) == "" {
		http.Error(w, "Name cannot be empty", http.StatusBadRequest)
		return
	}
	
	user, err := models.GetUserDetails(ac.DB, req.Name)
	if err != nil || user == nil {
		http.Error(w, "No user found. Sign up first!", http.StatusBadRequest)
		return
	}

	salt := user.PasswordStore[:8]
	saltedHash := user.PasswordStore[8:]
	saltedPassword := req.Password + salt

	if err := bcrypt.CompareHashAndPassword([]byte(saltedHash), []byte(saltedPassword)); err != nil {
		http.Error(w, "Incorrect credentials", http.StatusBadRequest)
		return
	}

	token, err := utils.GenerateToken(*user)
	if err != nil {
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
	json.NewEncoder(w).Encode(map[string]string{"username": user.Name, "role": user.Role})
}

func (ac *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
		Path:     "/",
	})
	w.WriteHeader(http.StatusOK)
}

package handlers

import (
	"codefuture-backend/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return []byte("dev_secret_key_change_in_prod")
	}
	return []byte(secret)
}

func (h *Handler) HandleSignup(w http.ResponseWriter, r *http.Request) {

	var req models.SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Simple validation
	if req.Email == "" || req.Password == "" || req.Name == "" {
		sendJSONError(w, "Name, email, and password are required", http.StatusBadRequest)
		return
	}

	// Check if user exists (simplification: CreateUser might fail with unique constraint)
	// Ideally check first, but let's rely on DB constraint or Check method for now.
	// Actually, CreateUser will fail if email exists.

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		sendJSONError(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := h.dataStore.CreateUser(user); err != nil {
		// Differentiate error types ideally (duplicate email)
		sendJSONError(w, "Error creating user (email may be taken)", http.StatusConflict)
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		sendJSONError(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(models.AuthResponse{
		Token: token,
		User:  *user,
	})
}

func (h *Handler) HandleLogin(w http.ResponseWriter, r *http.Request) {

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.dataStore.GetUserByEmail(req.Email)
	if err != nil {
		sendJSONError(w, "Error fetching user", http.StatusInternalServerError)
		return
	}
	if user == nil {
		sendJSONError(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		sendJSONError(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		sendJSONError(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(models.AuthResponse{
		Token: token,
		User:  *user,
	})
}

func generateToken(userID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // 3 days
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJWTSecret())
}

// HandleSocialLoginDemo simulates a social login for development/demo purposes
func (h *Handler) HandleSocialLoginDemo(w http.ResponseWriter, r *http.Request) {

	var req struct {
		Provider string `json:"provider"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Create or get a demo user based on provider
	email := fmt.Sprintf("demo.%s@example.com", req.Provider)
	name := fmt.Sprintf("%s User (Demo)", req.Provider)

	// Check if user exists
	user, _ := h.dataStore.GetUserByEmail(email)

	if user == nil {
		// Create new demo user
		user = &models.User{
			Name:     name,
			Email:    email,
			Password: "social_login_dummy_password", // In real world, social auth uses different flow
		}
		if err := h.dataStore.CreateUser(user); err != nil {
			sendJSONError(w, "Error creating demo user", http.StatusInternalServerError)
			return
		}
	}

	token, err := generateToken(user.ID)
	if err != nil {
		sendJSONError(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(models.AuthResponse{
		Token: token,
		User:  *user,
	})
}

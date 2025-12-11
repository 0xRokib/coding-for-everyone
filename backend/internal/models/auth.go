package models

import "time"

// User represents a registered user
type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Password  string    `json:"-"` // Don't expose password in JSON
	CreatedAt time.Time `json:"created_at"`
}

// SignupRequest payload
type SignupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginRequest payload
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse payload
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

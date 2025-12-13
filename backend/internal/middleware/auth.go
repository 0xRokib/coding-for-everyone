package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserIDKey contextKey = "userID"

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return []byte("dev_secret_key_change_in_prod")
	}
	return []byte(secret)
}

// AuthMiddleware validates the JWT token and adds user_id to context
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 1. Handle Preflight Options
		if r.Method == "OPTIONS" {
			next(w, r)
			return
		}

		// 2. Helper to set CORS locally in case we return error before handler
		setCORS := func() {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			setCORS()
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return getJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			setCORS()
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			userID := int(claims["user_id"].(float64))
			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next(w, r.WithContext(ctx))
		} else {
			setCORS()
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		}
	}
}

// OptionalAuthMiddleware adds user_id to context if token is present, but doesn't block if missing
func OptionalAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" {
			tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				return getJWTSecret(), nil
			})

			if err == nil && token.Valid {
				if claims, ok := token.Claims.(jwt.MapClaims); ok {
					userID := int(claims["user_id"].(float64))
					ctx := context.WithValue(r.Context(), UserIDKey, userID)
					next(w, r.WithContext(ctx))
					return
				}
			}
		}
		// Continue without user_id if check fails or no token
		next(w, r)
	}
}

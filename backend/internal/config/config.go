package config

import (
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

type Config struct {
	Port              string
	GeminiAPIKey      string
	JWTSecret         string
	FrontendURL       string
	DatabasePath      string
	GoogleOAuthConfig *oauth2.Config
	GitHubOAuthConfig *oauth2.Config
}

func LoadConfig() *Config {
	// Load .env file
	if err := godotenv.Load("../../.env"); err != nil {
		godotenv.Load() // Fallback
	}

	cfg := &Config{
		Port:         getEnv("PORT", "8081"),
		GeminiAPIKey: os.Getenv("GEMINI_API_KEY"),
		JWTSecret:    getEnv("JWT_SECRET", "default-dev-secret"), // Fallback for dev
		FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:3001"),
		DatabasePath: getDBPath(),
	}

	// OAuth Configurations
	callbackBase := getEnv("CALLBACK_URL_BASE", "http://localhost:8081/api/auth")

	cfg.GoogleOAuthConfig = &oauth2.Config{
		RedirectURL:  callbackBase + "/google/callback",
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}

	cfg.GitHubOAuthConfig = &oauth2.Config{
		RedirectURL:  callbackBase + "/github/callback",
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user:email"},
		Endpoint:     github.Endpoint,
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getDBPath() string {
	// Robust DB path checking
	if _, err := os.Stat("backend/codefuture.db"); err == nil {
		return "backend/codefuture.db"
	}
	if _, err := os.Stat("codefuture.db"); err == nil {
		return "codefuture.db"
	}
	// Default fallbacks based on where binary might run
	if _, err := os.Stat("../../codefuture.db"); err == nil {
		return "../../codefuture.db"
	}
	return "./codefuture.db"
}

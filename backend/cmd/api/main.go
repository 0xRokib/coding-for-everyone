package main

import (
	"log"
	"net/http"

	"codefuture-backend/internal/config"
	"codefuture-backend/internal/handlers"
	"codefuture-backend/internal/middleware"
	"codefuture-backend/internal/services"
	"codefuture-backend/internal/store"
)

func main() {
	// 1. Load Configuration (Centralized)
	cfg := config.LoadConfig()

	// 2. Initialize Database
	// We could use cfg.DatabasePath here but NewStore handles it internally for now.
	// Since NewStore logic was slightly complex with path detection, let's stick to existing
	// or refactor NewStore to accept path. For this iteration, existing NewStore is fine as
	// it locates the same file config.go points to.
	db := store.NewStore()
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Printf("Warning: Database ping failed: %v", err)
	} else {
		log.Println("Connected to Database")
		db.InitSchema()
	}

	// 3. Initialize AI Service
	if cfg.GeminiAPIKey == "" {
		log.Fatal("GEMINI_API_KEY environment variable is required")
	}
	aiService, err := services.NewAIService(cfg.GeminiAPIKey)
	if err != nil {
		log.Fatalf("Failed to initialize AI service: %v", err)
	}
	defer aiService.Close()

	// 4. Initialize Handlers with dependencies
	h := handlers.NewHandler(aiService, db, cfg)

	// 4. Register Routes
	http.HandleFunc("/api/lesson-plan", middleware.OptionalAuthMiddleware(h.HandleLessonPlan))
	http.HandleFunc("/api/courses", middleware.AuthMiddleware(h.HandleGetCourses))
	http.HandleFunc("/api/chat", h.HandleChat)
	http.HandleFunc("/api/execute", h.HandleExecute)
	http.HandleFunc("/api/math", h.HandleMath)
	http.HandleFunc("/api/signup", h.HandleSignup)
	http.HandleFunc("/api/contact", middleware.OptionalAuthMiddleware(h.HandleContactSubmission))
	http.HandleFunc("/api/login", h.HandleLogin)
	http.HandleFunc("/api/auth/social-demo", h.HandleSocialLoginDemo)

	// Real Social Auth
	http.HandleFunc("/api/auth/google/login", h.HandleGoogleLogin)
	http.HandleFunc("/api/auth/google/callback", h.HandleGoogleCallback)
	http.HandleFunc("/api/auth/github/login", h.HandleGitHubLogin)
	http.HandleFunc("/api/auth/github/callback", h.HandleGitHubCallback)

	// Community
	http.HandleFunc("/api/community/posts", middleware.OptionalAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			// Enforce Auth for Create Post
			if r.Context().Value(middleware.UserIDKey) == nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			h.HandleCreatePost(w, r)
		} else {
			// Public Read (GET)
			h.HandleGetPosts(w, r)
		}
	}))

	// Roadmap
	http.HandleFunc("/api/roadmap", middleware.AuthMiddleware(h.HandleGetRoadmap))
	http.HandleFunc("/api/roadmap/progress", middleware.AuthMiddleware(h.HandleUpdateProgress))
	// New Custom Roadmap Routes
	http.HandleFunc("/api/roadmap/generate", middleware.AuthMiddleware(h.HandleGenerateCustomRoadmap))
	http.HandleFunc("/api/roadmap/view", h.HandleGetRoadmapByID) // Public/Hybrid

	// 5. Start Server with CORS
	log.Println("Backend server running on :8081")

	// Wrap the default mux with CORS middleware
	handler := corsMiddleware(http.DefaultServeMux)

	if err := http.ListenAndServe(":8081", handler); err != nil {
		log.Fatal(err)
	}
}

// corsMiddleware adds CORS headers to all responses
// corsMiddleware adds CORS headers to all responses
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from both Vite dev server and other ports
		origin := r.Header.Get("Origin")

		// For development, we'll be permissive and reflect the origin if it exists
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			// Fallback for tools without Origin header (like curl) - though browsers always send it
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Title")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

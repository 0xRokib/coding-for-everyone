package handlers

import (
	"codefuture-backend/internal/middleware"
	"codefuture-backend/internal/models"
	"encoding/json"
	"net/http"
)

func (h *Handler) HandleGetPosts(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		return
	}

	posts, err := h.dataStore.GetPosts()
	if err != nil {
		sendJSONError(w, "Failed to fetch posts", http.StatusInternalServerError)
		return
	}

	if posts == nil {
		posts = []models.Post{}
	}

	json.NewEncoder(w).Encode(posts)
}

func (h *Handler) HandleCreatePost(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		sendJSONError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Fetch user name for author_name (could also be done via join)
	user, err := h.dataStore.GetUserByID(userID)
	if err != nil || user == nil {
		sendJSONError(w, "User not found", http.StatusUnauthorized)
		return
	}

	var req models.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	post := &models.Post{
		UserID:     userID,
		AuthorName: user.Name,
		Title:      req.Title,
		Content:    req.Content,
		Topic:      req.Topic,
	}

	if err := h.dataStore.CreatePost(post); err != nil {
		sendJSONError(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(post)
}
